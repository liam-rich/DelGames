"use client";

// Decodes the round pack from /api/rarelist/start and grades rounds locally,
// so nothing during play waits on the network.

import { indexList, matchGuess, AMBIGUOUS } from "../../lib/rarelist/match";

const cache = new Map();

export function decodePack(pack) {
  if (!pack) return null;
  if (cache.has(pack)) return cache.get(pack);
  try {
    const [saltB64, dataB64] = pack.split(".");
    const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
    const bytes = Uint8Array.from(atob(dataB64), (c) => c.charCodeAt(0));
    for (let i = 0; i < bytes.length; i++) bytes[i] ^= salt[i % salt.length];
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    const decoded = {
      list: { id: payload.id, surnames: payload.surnames, answers: payload.answers },
      rarity: payload.rarity,
    };
    cache.set(pack, decoded);
    return decoded;
  } catch {
    return null;
  }
}

// → { result: "correct" | "duplicate" | "ambiguous" | "wrong", ... }
export function gradeGuess(decoded, guess, have) {
  const idx = matchGuess(decoded.list, guess);
  if (idx === AMBIGUOUS) return { result: "ambiguous" };
  if (idx < 0) return { result: "wrong" };
  const a = indexList(decoded.list).answers[idx];
  if (have.includes(a.key)) return { result: "duplicate", key: a.key, display: a.display };
  return { result: "correct", key: a.key, display: a.display, ...decoded.rarity[a.key] };
}

// Same shape as the server's /finish response, built from the pack.
export function localSummary(decoded, keys, players = 0) {
  const scored = keys.map((key) => ({ key, ...decoded.rarity[key] }));
  const reveal = indexList(decoded.list)
    .answers.map((a) => ({ key: a.key, display: a.display, mine: keys.includes(a.key), ...decoded.rarity[a.key] }))
    .sort((x, y) => y.share - x.share);
  return {
    total: scored.reduce((s, x) => s + (x.points || 0), 0),
    scored,
    players,
    reveal,
    local: true,
  };
}
