// Persistence for Deep Dive: the live answer distribution and the leaderboard.
//
// Every read and write degrades gracefully. If no KV store is configured the
// game still plays perfectly — scoring just falls back to the corpus prior and
// the leaderboard reports itself as unavailable rather than erroring.

import { getKv, kvConfigured } from "../kv.js";

const OBS = (promptId) => `dd:obs:${promptId}`;
const OBS_TOTAL = (promptId) => `dd:obs:${promptId}:total`;
const BOARD = "dd:leaderboard";
export const MAX_BOARD = 25;

// A score earns a name entry only if it would actually land on the board.
export function qualifiesForBoard(points, board) {
  if (!points) return false;
  if (!board || board.length < MAX_BOARD) return true;
  return points > board[board.length - 1].points;
}

// The leaderboard needs sorted sets, which the local dev fallback store in
// lib/kv.js doesn't implement — so check for the capability, not just config.
export function storeAvailable() {
  if (!kvConfigured()) return false;
  try {
    return typeof getKv().zadd === "function";
  } catch {
    return false;
  }
}

// How often players have actually given each answer for a prompt.
export async function readObserved(promptId) {
  if (!kvConfigured()) return null;
  try {
    const kv = getKv();
    if (typeof kv.hgetall !== "function") return null; // dev fallback store
    const [counts, total] = await Promise.all([kv.hgetall(OBS(promptId)), kv.get(OBS_TOTAL(promptId))]);
    if (!counts || !total) return null;
    const parsed = {};
    for (const [k, v] of Object.entries(counts)) parsed[k] = Number(v) || 0;
    return { counts: parsed, total: Number(total) || 0 };
  } catch {
    return null;
  }
}

// Record a valid answer so rarity sharpens as more people play.
export async function recordAnswer(promptId, answerKey) {
  if (!kvConfigured() || !answerKey) return;
  try {
    const kv = getKv();
    if (typeof kv.hincrby !== "function") return;
    await Promise.all([kv.hincrby(OBS(promptId), answerKey, 1), kv.incr(OBS_TOTAL(promptId))]);
  } catch {
    // Never let bookkeeping break a run.
  }
}

export async function readLeaderboard() {
  if (!kvConfigured()) return null;
  try {
    const kv = getKv();
    if (typeof kv.zrange !== "function") return null;
    const rows = await kv.zrange(BOARD, 0, MAX_BOARD - 1, { rev: true, withScores: true });
    const out = [];
    for (let i = 0; i < rows.length; i += 2) {
      const entry = typeof rows[i] === "string" ? safeParse(rows[i]) : rows[i];
      if (entry) out.push({ ...entry, points: Number(rows[i + 1]) || 0 });
    }
    return out;
  } catch {
    return null;
  }
}

export async function submitScore({ name, points, best }) {
  if (!kvConfigured()) return null;
  try {
    const kv = getKv();
    if (typeof kv.zadd !== "function") return null;
    const member = JSON.stringify({ name, best, at: Date.now() });
    await kv.zadd(BOARD, { score: points, member });
    // Keep only the top scores so the free tier stays tidy.
    await kv.zremrangebyrank(BOARD, 0, -(MAX_BOARD + 1));
    return await readLeaderboard();
  } catch {
    return null;
  }
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
