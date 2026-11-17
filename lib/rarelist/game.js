// Rarelist game service — everything the API routes do. SERVER-ONLY.

import { randomBytes } from "node:crypto";
import { ANSWERS_PER_ROUND, ROUNDS_PER_DAY, dayIndex, puzzleNumber } from "./core.js";
import { listFor, listsForDay, hintsFor, publicListInfo } from "./daily.js";
import { indexList, matchGuess, AMBIGUOUS } from "./match.js";
import { blendedShares, describe, scoreKeys } from "./rarity.js";
import {
  readLive,
  recordRound,
  readSubmissions,
  readFinal,
  writeFinal,
  readHistory,
  writeHistory,
  liveAvailable,
} from "./store.js";

export class GameError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const PLAYER_RE = /^[a-z0-9]{8,40}$/i;

function checkPlayer(playerId) {
  if (!PLAYER_RE.test(String(playerId || ""))) throw new GameError("Bad player id.");
  return String(playerId);
}

// A round can be played on its own day, or just after midnight by someone
// who started before it.
function checkPlayableDay(day) {
  const today = dayIndex();
  const d = Number(day);
  if (!Number.isInteger(d) || d < today - 1 || d > today) throw new GameError("That puzzle isn't open.", 409);
  return d;
}

function checkRound(round) {
  const r = Number(round);
  if (!Number.isInteger(r) || r < 0 || r >= ROUNDS_PER_DAY) throw new GameError("Bad round.");
  return r;
}

async function currentShares(list, day, round) {
  const [history, live] = await Promise.all([readHistory(list.id), readLive(day, round)]);
  return blendedShares(list, history, live);
}

export function today() {
  const day = dayIndex();
  return {
    day,
    puzzle: puzzleNumber(day),
    rounds: ROUNDS_PER_DAY,
    answersPerRound: ANSWERS_PER_ROUND,
    live: liveAvailable(),
  };
}

// Everything the browser needs to play the round without the network: the
// list's answers and aliases plus each answer's current rarity. Like Wordle
// or Sporcle, the answers ship to the client — a guess can't wait on a
// server round trip with the clock running. The pack is lightly scrambled
// so the list isn't readable at a glance in the network tab.
function buildPack(list, shares) {
  const payload = {
    id: list.id,
    surnames: Boolean(list.surnames),
    answers: list.answers.map(([display, , ...aliases]) => [display, 0, ...aliases]),
    decoys: list.decoys || [],
    rarity: Object.fromEntries(indexList(list).answers.map((a) => [a.key, describe(shares.get(a.key))])),
  };
  const salt = randomBytes(8);
  const bytes = Buffer.from(JSON.stringify(payload), "utf8");
  for (let i = 0; i < bytes.length; i++) bytes[i] ^= salt[i % salt.length];
  return `${salt.toString("base64")}.${bytes.toString("base64")}`;
}

// No dice here: the roll is a pure function the client computes itself, so
// this can be fetched the moment the player taps Roll, hiding any server
// latency behind the dice animation.
export async function startRound({ day, round }) {
  const d = checkPlayableDay(day);
  const r = checkRound(round);
  const list = listFor(d, r);
  const { shares, n } = await currentShares(list, d, r);
  return {
    day: d,
    round: r,
    list: publicListInfo(list),
    hintOrder: hintsFor(list, d, r, 3),
    players: n,
    pack: buildPack(list, shares),
  };
}

export async function checkGuess({ day, round, guess, have }) {
  const d = checkPlayableDay(day);
  const r = checkRound(round);
  const list = listFor(d, r);
  const text = String(guess || "").slice(0, 80);
  const idx = matchGuess(list, text);
  if (idx === AMBIGUOUS) return { result: "ambiguous" };
  if (idx < 0) return { result: "wrong" };

  const answer = indexList(list).answers[idx];
  const already = Array.isArray(have) ? have.map(String) : [];
  if (already.includes(answer.key)) return { result: "duplicate", key: answer.key, display: answer.display };

  const { shares } = await currentShares(list, d, r);
  return {
    result: "correct",
    key: answer.key,
    display: answer.display,
    ...describe(shares.get(answer.key)),
  };
}

function cleanKeys(list, keys) {
  const valid = new Set(indexList(list).answers.map((a) => a.key));
  const out = [];
  for (const k of Array.isArray(keys) ? keys : []) {
    const key = String(k);
    if (valid.has(key) && !out.includes(key)) out.push(key);
    if (out.length === ANSWERS_PER_ROUND) break;
  }
  return out;
}

function revealList(list, shares, mine) {
  return indexList(list)
    .answers.map((a) => ({
      key: a.key,
      display: a.display,
      mine: mine.includes(a.key),
      ...describe(shares.get(a.key)),
    }))
    .sort((a, b) => b.share - a.share);
}

export async function finishRound({ playerId, day, round, keys }) {
  const pid = checkPlayer(playerId);
  const d = checkPlayableDay(day);
  const r = checkRound(round);
  const list = listFor(d, r);
  const mine = cleanKeys(list, keys);

  // Don't record into a day that has already been locked.
  const locked = d < dayIndex() && (await readFinal(d));
  if (!locked) await recordRound(d, r, pid, mine);

  const { shares, n } = await currentShares(list, d, r);
  const { total, scored } = scoreKeys(shares, mine);
  return {
    day: d,
    round: r,
    total,
    scored,
    players: n,
    reveal: revealList(list, shares, mine),
  };
}

// ---------------------------------------------------------------------------
// Final results
// ---------------------------------------------------------------------------

async function buildSnapshot(day) {
  const lists = listsForDay(day);
  const rounds = [];
  for (let r = 0; r < lists.length; r++) {
    const list = lists[r];
    const [history, live] = await Promise.all([readHistory(list.id), readLive(day, r)]);
    const { shares, n } = blendedShares(list, history, live);
    rounds.push({ listId: list.id, n, shares: Object.fromEntries(shares), live });
  }

  const subs = (await readSubmissions(day)) || new Map();
  const scores = [];
  for (const byRound of subs.values()) {
    let total = 0;
    for (let r = 0; r < rounds.length; r++) {
      const keys = byRound[r] || [];
      total += scoreKeys(new Map(Object.entries(rounds[r].shares)), keys).total;
    }
    scores.push(total);
  }
  scores.sort((a, b) => b - a);

  const snapshot = {
    day,
    lockedAt: Date.now(),
    rounds: rounds.map(({ listId, n, shares }) => ({ listId, n, shares })),
    scores,
  };

  if (await writeFinal(day, snapshot)) {
    // Feed the day's raw pick rates back into each list's baseline.
    await Promise.all(
      rounds.map(async ({ listId, live }) => {
        if (!live?.n) return;
        const prev = (await readHistory(listId)) || { shares: {}, n: 0 };
        const n = Math.min(prev.n + live.n, 5000);
        const shares = {};
        const keys = new Set([...Object.keys(prev.shares || {}), ...Object.keys(live.counts || {})]);
        for (const k of keys) {
          const old = prev.shares?.[k] ?? 0;
          const fresh = (live.counts?.[k] || 0) / live.n;
          shares[k] = (old * prev.n + fresh * live.n) / (prev.n + live.n);
        }
        await writeHistory(listId, { shares, n, lastDay: day });
      })
    );
    return snapshot;
  }
  // Someone else locked it first — use theirs so everyone agrees.
  return (await readFinal(day)) || snapshot;
}

export async function finalResults({ playerId, day, keysByRound }) {
  const pid = checkPlayer(playerId);
  const d = Number(day);
  const today = dayIndex();
  if (!Number.isInteger(d) || d < 0 || d >= today) throw new GameError("That day hasn't locked yet.", 409);
  if (d < today - 35) throw new GameError("That puzzle has expired.", 410);

  const lists = listsForDay(d);
  let snapshot = liveAvailable() ? await readFinal(d) : null;
  if (!snapshot && liveAvailable()) snapshot = await buildSnapshot(d);

  // Prefer what the server recorded; fall back to the client's copy if this
  // player's rounds never reached the store.
  const subs = liveAvailable() ? await readSubmissions(d) : null;
  const recorded = subs?.get(pid);

  let total = 0;
  const rounds = [];
  for (let r = 0; r < lists.length; r++) {
    const list = lists[r];
    const shares = snapshot
      ? new Map(Object.entries(snapshot.rounds[r].shares))
      : blendedShares(list, null, null).shares;
    const keys = cleanKeys(list, recorded?.[r] ?? keysByRound?.[r] ?? []);
    const { total: rt, scored } = scoreKeys(shares, keys);
    total += rt;
    rounds.push({
      list: publicListInfo(list),
      players: snapshot?.rounds[r].n || 0,
      total: rt,
      scored: scored.map((s) => ({ ...s, display: indexList(list).answers.find((a) => a.key === s.key)?.display })),
    });
  }

  let rank = null;
  if (snapshot && recorded && snapshot.scores.length) {
    const better = snapshot.scores.filter((s) => s > total).length;
    rank = { rank: better + 1, of: snapshot.scores.length };
  }

  return { day: d, puzzle: puzzleNumber(d), total, rounds, rank, live: Boolean(snapshot) };
}
