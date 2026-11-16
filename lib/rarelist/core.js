// Rarelist rules shared by the client and the server. Nothing in here knows
// any answers, so it's safe to bundle into the browser.

export const ROUNDS_PER_DAY = 3;
export const ANSWERS_PER_ROUND = 5;

// The day turns over at 00:00 UTC for everyone, so every player worldwide gets
// the same three lists and the same lock time.
export const EPOCH_UTC = Date.UTC(2026, 0, 1); // puzzle #1
const DAY_MS = 86_400_000;

export function dayIndex(now = Date.now()) {
  return Math.floor((now - EPOCH_UTC) / DAY_MS);
}

export function puzzleNumber(day) {
  return day + 1;
}

export function dayStart(day) {
  return EPOCH_UTC + day * DAY_MS;
}

export function msUntilReset(now = Date.now()) {
  return dayStart(dayIndex(now) + 1) - now;
}

export function dayLabel(day) {
  return new Date(dayStart(day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ---------------------------------------------------------------------------
// Seeded randomness
// ---------------------------------------------------------------------------

export function hashString(str) {
  // FNV-1a, 32-bit.
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Dice
// ---------------------------------------------------------------------------
// Two dice per round. The player assigns one to TIME and one to HINTS, so the
// roll is luck but the split is a decision. The roll is a pure function of
// (player, day, round) — the server recomputes it, so refreshing never rerolls.

export const TIME_BY_FACE = [null, 30, 40, 50, 60, 75, 90];
export const HINTS_BY_FACE = [null, 0, 1, 1, 2, 2, 3];

export function rollDice(playerId, day, round) {
  const rand = mulberry32(hashString(`rarelist|${playerId}|${day}|${round}`));
  return [1 + Math.floor(rand() * 6), 1 + Math.floor(rand() * 6)];
}

export const DOUBLES_BONUS_SECONDS = 15;

// `swap` false: die A → time, die B → hints. Doubles can't be split
// meaningfully, so they pay out extra time instead.
export function applyDice(dice, swap) {
  const [timeFace, hintFace] = swap ? [dice[1], dice[0]] : dice;
  const doubles = dice[0] === dice[1];
  return {
    timeFace,
    hintFace,
    doubles,
    seconds: TIME_BY_FACE[timeFace] + (doubles ? DOUBLES_BONUS_SECONDS : 0),
    hints: HINTS_BY_FACE[hintFace],
  };
}

// ---------------------------------------------------------------------------
// Rarity tiers and points
// ---------------------------------------------------------------------------
// `share` is the pick rate: the fraction of players who named the answer in
// that round. Tiers are coarse on purpose — small swings in live data shouldn't
// visibly flip how an answer looks.

export const TIERS = [
  { key: "legendary", label: "Legendary", short: "LEG", emoji: "🟨", maxShare: 0.05, base: 50 },
  { key: "rare", label: "Rare", short: "RARE", emoji: "🟦", maxShare: 0.15, base: 35 },
  { key: "uncommon", label: "Uncommon", short: "UNC", emoji: "🟩", maxShare: 0.35, base: 20 },
  { key: "common", label: "Common", short: "COM", emoji: "⬜", maxShare: Infinity, base: 10 },
];
export const MISS_EMOJI = "⬛";

export const TIER_BY_KEY = Object.fromEntries(TIERS.map((t) => [t.key, t]));

export function tierFor(share) {
  for (const t of TIERS) if (share < t.maxShare) return t.key;
  return "common";
}

// Points are continuous in log(share) so they glide rather than jump, with the
// anchors placed on the tier boundaries. That keeps each tier near its
// headline value (Common ~12, Uncommon ~21, Rare ~34, Legendary ~50).
const POINT_ANCHORS = [
  [0.6, 10],
  [0.35, 15],
  [0.15, 27],
  [0.05, 42],
  [0.01, 60],
];

export function pointsFor(share) {
  const s = Math.max(0, Math.min(1, share));
  if (s >= POINT_ANCHORS[0][0]) return POINT_ANCHORS[0][1];
  const last = POINT_ANCHORS[POINT_ANCHORS.length - 1];
  if (s <= last[0]) return last[1];
  for (let i = 0; i < POINT_ANCHORS.length - 1; i++) {
    const [s0, p0] = POINT_ANCHORS[i];
    const [s1, p1] = POINT_ANCHORS[i + 1];
    if (s <= s0 && s >= s1) {
      const t = (Math.log(s0) - Math.log(s)) / (Math.log(s0) - Math.log(s1));
      return Math.round(p0 + t * (p1 - p0));
    }
  }
  return POINT_ANCHORS[0][1];
}

export const BASE_POINTS = 10; // what any correct answer is worth at minimum

// ---------------------------------------------------------------------------
// Sharing
// ---------------------------------------------------------------------------

export function shareText({ day, rounds, total, final, rank, url }) {
  const lines = [`RARELIST #${puzzleNumber(day)} 🎲`];
  for (const r of rounds) {
    const cells = [];
    for (let i = 0; i < ANSWERS_PER_ROUND; i++) {
      const a = r.correct?.[i];
      cells.push(a ? TIER_BY_KEY[a.tier]?.emoji || MISS_EMOJI : MISS_EMOJI);
    }
    lines.push(cells.join(""));
  }
  let scoreLine = `${total} pts`;
  if (final && rank) scoreLine += ` · #${rank.rank} of ${rank.of}`;
  else if (!final) scoreLine += " (provisional)";
  lines.push(scoreLine);
  if (url) lines.push(url);
  return lines.join("\n");
}
