// Rarity model. SERVER-ONLY.
//
// The cold-start problem: the first player of the day would otherwise see
// every answer as "Legendary" because nobody else has named it yet. So every
// answer starts with a seeded baseline pick rate, and live data takes over as
// the day fills up:
//
//   share = w · live + (1 − w) · baseline,     w = n / (n + K)
//
// where n is how many players have finished that round today. At K players the
// two count equally; by a few thousand, live data dominates.
//
// The baseline itself comes from:
//   1. A popularity prior — each answer's 1–100 popularity estimate, turned
//      into an expected pick rate by simulating players who draw five answers
//      in proportion to how readily each comes to mind.
//   2. History — if the list has run before, its final pick rates from that
//      day are blended in the same way, weighted by how many played then.

import { ANSWERS_PER_ROUND, mulberry32, hashString, tierFor, pointsFor } from "./core.js";
import { indexList } from "./match.js";

export const BLEND_K = 200;

// Recall is much more top-heavy than a linear 1–100 scale suggests: the most
// famous answers crowd out everything else. Raising weights to this power
// before simulating matches the steep head / long tail of real pick data.
const SHARPNESS = 1.6;
const SIMULATED_PLAYERS = 6000;
// Players don't always reach five. Simulated players stop early sometimes.
const PICKS_DISTRIBUTION = [
  [5, 0.7],
  [4, 0.15],
  [3, 0.1],
  [2, 0.05],
];

const priorCache = new Map();

// → Map<answerKey, share>
export function priorShares(list) {
  if (priorCache.has(list.id)) return priorCache.get(list.id);
  const { answers } = indexList(list);
  const weights = answers.map((a) => Math.pow(a.weight, SHARPNESS));
  const counts = new Array(answers.length).fill(0);
  const rand = mulberry32(hashString(`prior|${list.id}`));

  for (let p = 0; p < SIMULATED_PLAYERS; p++) {
    let picks = ANSWERS_PER_ROUND;
    const r = rand();
    let acc = 0;
    for (const [n, prob] of PICKS_DISTRIBUTION) {
      acc += prob;
      if (r < acc) {
        picks = n;
        break;
      }
    }
    picks = Math.min(picks, answers.length);
    const taken = new Uint8Array(answers.length);
    let remaining = weights.reduce((s, w) => s + w, 0);
    for (let k = 0; k < picks; k++) {
      let x = rand() * remaining;
      let chosen = -1;
      for (let i = 0; i < weights.length; i++) {
        if (taken[i]) continue;
        x -= weights[i];
        if (x <= 0) {
          chosen = i;
          break;
        }
      }
      if (chosen === -1) {
        for (let i = weights.length - 1; i >= 0; i--) if (!taken[i]) { chosen = i; break; }
      }
      taken[chosen] = 1;
      remaining -= weights[chosen];
      counts[chosen]++;
    }
  }

  const out = new Map();
  answers.forEach((a, i) => out.set(a.key, Math.max(counts[i] / SIMULATED_PLAYERS, 0.002)));
  priorCache.set(list.id, out);
  return out;
}

// history: { shares: {key: share}, n } | null
export function baselineShares(list, history) {
  const prior = priorShares(list);
  if (!history || !history.n) return prior;
  const w = history.n / (history.n + BLEND_K);
  const out = new Map();
  for (const [key, p] of prior) {
    const h = history.shares?.[key];
    out.set(key, h == null ? p : w * h + (1 - w) * p);
  }
  return out;
}

// live: { n, counts: {key: count} } | null
export function blendedShares(list, history, live) {
  const base = baselineShares(list, history);
  const n = live?.n || 0;
  if (!n) return { shares: base, n: 0, weight: 0 };
  const w = n / (n + BLEND_K);
  const out = new Map();
  for (const [key, p] of base) {
    const c = Number(live.counts?.[key] || 0);
    out.set(key, w * Math.min(1, c / n) + (1 - w) * p);
  }
  return { shares: out, n, weight: w };
}

export function describe(share) {
  return { share, tier: tierFor(share), points: pointsFor(share) };
}

export function scoreKeys(shares, keys) {
  let total = 0;
  const scored = keys.map((key) => {
    const d = describe(shares.get(key) ?? 0.5);
    total += d.points;
    return { key, ...d };
  });
  return { total, scored };
}
