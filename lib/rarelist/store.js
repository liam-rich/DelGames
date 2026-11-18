// Rarelist persistence. SERVER-ONLY.
//
// Layout (per UTC day D, round R):
//   rl:D:R:n        players who finished the round
//   rl:D:R:c        hash  answerKey → times named
//   rl:D:subs       hash  "<player>:<R>" → JSON array of answer keys (set once)
//   rl:D:final      JSON snapshot written the first time anyone asks for D's
//                   final results after D has ended
//   rl:hist:<list>  JSON { shares, n } — the list's last final pick rates,
//                   fed back into its baseline if it runs again
//
// Everything degrades gracefully: with no KV configured, live data is simply
// absent and the game scores against the baseline alone. In local dev an
// in-memory store stands in so the full flow can be tried.

import { getKv, kvConfigured, hasKvCreds } from "../kv.js";

const TTL = 60 * 60 * 24 * 40; // keep a day's data ~40 days

// Kept on globalThis so every route handler in the dev server shares it.
function memoryStore() {
  if (globalThis.__rarelistMemory) return globalThis.__rarelistMemory;
  const m = new Map();
  const hash = (k) => {
    if (!m.has(k)) m.set(k, new Map());
    return m.get(k);
  };
  const memory = {
    async get(k) {
      return m.has(k) ? m.get(k) : null;
    },
    async set(k, v, opts = {}) {
      if (opts.nx && m.has(k)) return null;
      m.set(k, v);
      return "OK";
    },
    async incr(k) {
      const v = Number(m.get(k) || 0) + 1;
      m.set(k, v);
      return v;
    },
    async hincrby(k, f, by) {
      const h = hash(k);
      const v = Number(h.get(f) || 0) + by;
      h.set(f, v);
      return v;
    },
    async hsetnx(k, f, v) {
      const h = hash(k);
      if (h.has(f)) return 0;
      h.set(f, v);
      return 1;
    },
    async hgetall(k) {
      const h = m.get(k);
      if (!h || !h.size) return null;
      return Object.fromEntries(h);
    },
    async expire() {
      return 1;
    },
  };
  globalThis.__rarelistMemory = memory;
  return memory;
}

function store() {
  const hasReal = hasKvCreds();
  if (hasReal) {
    try {
      return getKv();
    } catch {
      return null;
    }
  }
  if (process.env.NODE_ENV !== "production" && kvConfigured()) return memoryStore();
  return null;
}

export function liveAvailable() {
  return store() !== null;
}

// Upstash auto-deserialises JSON values; the memory store doesn't. Accept both.
function parse(v) {
  if (v == null) return null;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  return v;
}

const K = {
  n: (d, r) => `rl:${d}:${r}:n`,
  c: (d, r) => `rl:${d}:${r}:c`,
  subs: (d) => `rl:${d}:subs`,
  final: (d) => `rl:${d}:final`,
  hist: (id) => `rl:hist:${id}`,
};

export async function readLive(day, round) {
  const kv = store();
  if (!kv) return null;
  try {
    const [n, counts] = await Promise.all([kv.get(K.n(day, round)), kv.hgetall(K.c(day, round))]);
    const out = {};
    for (const [k, v] of Object.entries(counts || {})) out[k] = Number(v) || 0;
    return { n: Number(n) || 0, counts: out };
  } catch {
    return null;
  }
}

// Records a finished round once per player. Returns true if it counted.
export async function recordRound(day, round, playerId, keys) {
  const kv = store();
  if (!kv) return false;
  try {
    const fresh = await kv.hsetnx(K.subs(day), `${playerId}:${round}`, JSON.stringify(keys));
    if (!fresh) return false;
    await Promise.all([
      kv.incr(K.n(day, round)),
      ...keys.map((key) => kv.hincrby(K.c(day, round), key, 1)),
    ]);
    // Set expiries lazily; cheap and idempotent.
    await Promise.all([
      kv.expire(K.subs(day), TTL),
      kv.expire(K.n(day, round), TTL),
      kv.expire(K.c(day, round), TTL),
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function readSubmissions(day) {
  const kv = store();
  if (!kv) return null;
  try {
    const all = await kv.hgetall(K.subs(day));
    const players = new Map();
    for (const [field, value] of Object.entries(all || {})) {
      const cut = field.lastIndexOf(":");
      const pid = field.slice(0, cut);
      const round = Number(field.slice(cut + 1));
      const keys = parse(value);
      if (!Array.isArray(keys)) continue;
      if (!players.has(pid)) players.set(pid, {});
      players.get(pid)[round] = keys;
    }
    return players;
  } catch {
    return null;
  }
}

export async function readFinal(day) {
  const kv = store();
  if (!kv) return null;
  try {
    return parse(await kv.get(K.final(day)));
  } catch {
    return null;
  }
}

// First writer wins, so every reader sees the same locked snapshot.
export async function writeFinal(day, snapshot) {
  const kv = store();
  if (!kv) return false;
  try {
    const ok = await kv.set(K.final(day), JSON.stringify(snapshot), { nx: true, ex: TTL });
    return ok === "OK";
  } catch {
    return false;
  }
}

// History changes at most once a day, so each server instance caches it
// rather than paying a Redis round trip on every guess.
const HISTORY_TTL_MS = 10 * 60 * 1000;
const historyCache = new Map();

export async function readHistory(listId) {
  const kv = store();
  if (!kv) return null;
  const cached = historyCache.get(listId);
  if (cached && Date.now() - cached.at < HISTORY_TTL_MS) return cached.value;
  try {
    const value = parse(await kv.get(K.hist(listId)));
    historyCache.set(listId, { value, at: Date.now() });
    return value;
  } catch {
    return null;
  }
}

export async function writeHistory(listId, history) {
  const kv = store();
  if (!kv) return;
  try {
    await kv.set(K.hist(listId), JSON.stringify(history));
    historyCache.set(listId, { value: history, at: Date.now() });
  } catch {
    // history is a nicety
  }
}
