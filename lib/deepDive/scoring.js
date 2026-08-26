// Deep Dive scoring. Server-side only — the bank holds the answers, so it must
// never reach the client or players could just read off the rarest pick.

import { BANK } from "./bank.js";

export const PROMPTS_PER_RUN = 7;
export const SECONDS_PER_PROMPT = 25;
export const MAX_POINTS = 100; // per prompt, so a perfect run is 700
export const METRES_PER_POINT = 10; // 700 points => 7000m, the trench floor

// The rarest share we award full marks for (1 in 1250). Matches MIN_SHARE in
// the build script, so the rarest answer in a category tops out at 100.
const REF_SHARE = 0.0008;
const REF_SURPRISAL = Math.log(1 / REF_SHARE);

// Real player answers are blended in as they accumulate. PRIOR_STRENGTH is how
// many observed answers it takes before live data outweighs the corpus prior.
const PRIOR_STRENGTH = 40;

export function normalise(raw) {
  return String(raw ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[-\s]+/g, " ")
    .trim()
    .replace(/^(a|an|the)\s+/, "");
}

// Damerau-Levenshtein (optimal string alignment): counts a swapped pair as one
// edit, so "brei" is one slip from "brie" rather than two.
function levenshtein(a, b) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 3) return 99;
  let prevPrev = null;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let best = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        best = Math.min(best, prevPrev[j - 2] + 1);
      }
      row[j] = best;
    }
    prevPrev = prev;
    prev = row;
  }
  return prev[b.length];
}

// Singular/plural variants, so "strawberries" finds "strawberry".
function variants(word) {
  const out = new Set([word]);
  if (word.endsWith("ies")) out.add(word.slice(0, -3) + "y");
  if (word.endsWith("es")) out.add(word.slice(0, -2));
  if (word.endsWith("s")) out.add(word.slice(0, -1));
  out.add(word + "s");
  // "+es" only where English actually uses it, otherwise "cap" generates
  // "capes" and collides with the separate answer "cape".
  if (/(s|x|z|ch|sh)$/.test(word)) out.add(word + "es");
  if (word.endsWith("y")) out.add(word.slice(0, -1) + "ies");
  return out;
}

export function getPrompt(id) {
  return BANK.find((p) => p.id === id) || null;
}

// `pack` narrows the pool to one theme; "general" (or anything unknown) uses
// the whole bank.
export function pickPrompts(count = PROMPTS_PER_RUN, pack = "general") {
  const scoped = pack && pack !== "general" ? BANK.filter((p) => p.pack === pack) : BANK;
  const pool = [...(scoped.length ? scoped : BANK)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

const keyForms = (answer) => [answer.key, ...(answer.aliases || [])];
const compact = (s) => s.replace(/ /g, "");

// Do `keyWords` appear as a contiguous whole-word run inside `inputWords`?
function containsRun(inputWords, keyWords) {
  if (keyWords.length > inputWords.length) return false;
  outer: for (let i = 0; i <= inputWords.length - keyWords.length; i++) {
    for (let j = 0; j < keyWords.length; j++) {
      const a = inputWords[i + j];
      const b = keyWords[j];
      if (a !== b && !variants(a).has(b)) continue outer;
    }
    return true;
  }
  return false;
}

// Resolves an answer and says how sure we are.
//   exact | compact | contains  -> confident, score it
//   typo                        -> confident enough, score it but say so
//   suggest                     -> too loose to score; offer "did you mean?"
export function resolveAnswer(prompt, rawInput) {
  const input = normalise(rawInput);
  if (!input) return { answer: null, kind: null };

  const forms = variants(input);

  // 1. Exact, alias or plural.
  for (const answer of prompt.answers) {
    for (const key of keyForms(answer)) {
      if (forms.has(key)) return { answer, kind: "exact" };
      for (const form of forms) if (variants(key).has(form)) return { answer, kind: "exact" };
    }
  }

  // 2. Spacing differences: "tshirt" -> "t shirt", "ladybird" -> "lady bird".
  for (const answer of prompt.answers) {
    for (const key of keyForms(answer)) {
      for (const form of forms) if (compact(form) === compact(key)) return { answer, kind: "compact" };
    }
  }

  // 3. Qualifier words: "dental floss" -> floss, "mount everest" -> everest,
  //    "great white" -> great white shark. Longest key wins so "ice cream cake"
  //    resolves to "ice cream" rather than "cake".
  const inputWords = input.split(" ");
  let forwardBest = null;
  let forwardLen = 0;
  let reverseBest = null;
  let reverseLen = 0;

  for (const answer of prompt.answers) {
    for (const key of keyForms(answer)) {
      const keyWords = key.split(" ");
      if (inputWords.length - keyWords.length <= 2 && containsRun(inputWords, keyWords)) {
        if (keyWords.length > forwardLen) {
          forwardLen = keyWords.length;
          forwardBest = answer;
        }
        continue;
      }
      // Reverse only for multi-word input, so one common word can't claim a
      // long key ("sperm" shouldn't become "sperm whale").
      if (
        inputWords.length >= 2 &&
        keyWords.length - inputWords.length <= 1 &&
        containsRun(keyWords, inputWords) &&
        keyWords.length > reverseLen
      ) {
        reverseLen = keyWords.length;
        reverseBest = answer;
      }
    }
  }

  // Forward wins outright: saying the key plus qualifiers ("republic of congo")
  // is a surer signal than saying part of a longer key, which would otherwise
  // drag it to "democratic republic of congo" — a different country.
  const contained = forwardBest || reverseBest;
  if (contained) return { answer: contained, kind: "contains" };

  // 4. Nearest key by edit distance — a tight radius auto-corrects, a looser
  //    one only suggests.
  let best = null;
  let bestDist = Infinity;
  for (const answer of prompt.answers) {
    for (const key of keyForms(answer)) {
      const d = levenshtein(input, key);
      if (d < bestDist) {
        bestDist = d;
        best = answer;
      }
    }
  }
  if (!best) return { answer: null, kind: null };

  // Two edits is only safe on a long word. At eight characters it can cross to
  // a genuinely different answer ("alsatian" -> "dalmatian"), so anything that
  // loose is offered as a suggestion rather than assumed.
  const autoCorrect = input.length >= 10 ? 2 : input.length >= 5 ? 1 : 0;
  if (bestDist <= autoCorrect) return { answer: best, kind: "typo" };

  const ratio = bestDist / Math.max(input.length, best.key.length);
  if (bestDist <= 3 && ratio <= 0.4) return { answer: best, kind: "suggest" };

  return { answer: null, kind: null };
}

// Confident match only — used for scoring.
export function matchAnswer(prompt, rawInput) {
  const { answer, kind } = resolveAnswer(prompt, rawInput);
  return kind && kind !== "suggest" ? answer : null;
}

// Blends the corpus prior with however many real answers players have given.
export function blendedShare(answer, observed = null) {
  if (!observed || !observed.total) return answer.share;
  const seen = observed.counts[answer.key] || 0;
  return (answer.share * PRIOR_STRENGTH + seen) / (PRIOR_STRENGTH + observed.total);
}

// Rarity as Shannon surprisal: the less likely the answer, the more bits it
// carries, and the deeper you sink.
export function pointsForShare(share) {
  const clamped = Math.min(0.99, Math.max(REF_SHARE, share));
  const ratio = Math.log(1 / clamped) / REF_SURPRISAL;
  return Math.max(0, Math.min(MAX_POINTS, Math.round(ratio * MAX_POINTS)));
}

// Scores one answer and describes it for the reveal screen.
export function scoreAnswer(prompt, rawInput, observed = null) {
  const { answer, kind } = resolveAnswer(prompt, rawInput);

  if (!answer || kind === "suggest") {
    return {
      valid: false,
      points: 0,
      answer: null,
      share: null,
      rarerThan: 0,
      // Close enough to be worth offering, but not close enough to assume.
      suggestion: kind === "suggest" ? answer.key : null,
    };
  }

  const share = blendedShare(answer, observed);
  // How many accepted answers are more obvious than this one — i.e. the
  // percentage of the category the player dived past.
  const commoner = prompt.answers.filter((a) => blendedShare(a, observed) > share).length;
  return {
    valid: true,
    points: pointsForShare(share),
    answer: answer.key,
    share,
    rarerThan: Math.round((commoner / prompt.answers.length) * 100),
    suggestion: null,
    // Set when we read the answer as something other than what was typed, so
    // the player can see how it was interpreted.
    matchedAs: kind === "exact" ? null : answer.key,
  };
}

// A few rarer picks to show after the guess, plus the commonest for contrast.
export function revealFor(prompt, share, observed = null) {
  const sorted = [...prompt.answers].sort(
    (a, b) => blendedShare(b, observed) - blendedShare(a, observed)
  );
  const rarer = share == null ? [] : sorted.filter((a) => blendedShare(a, observed) < share);
  return {
    commonest: sorted.slice(0, 3).map((a) => a.key),
    deeper: rarer.slice(-3).reverse().map((a) => a.key),
    total: prompt.answers.length,
  };
}

export function depthFor(points) {
  return points * METRES_PER_POINT;
}
