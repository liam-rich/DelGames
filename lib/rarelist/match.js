// Fuzzy answer matching. Runs on the server (to validate submissions) and in
// the browser (to grade guesses instantly from the round's answer pack).
//
// A guess matches when, after normalising, it equals an answer or alias, or is
// within a small edit distance of exactly one of them. Normalising strips case,
// accents, punctuation and leading articles; comparisons also try a
// space-less form so "walle" == "WALL-E" and "sao tome" == "São Tomé".

import { hashString, normalise, compact } from "./core.js";

export { normalise };

// Optimal string alignment distance (Damerau-Levenshtein with adjacent swaps).
function editDistance(a, b, cap) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let prevPrev = null;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prevPrev[j - 2] + 1);
      }
      row[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > cap) return cap + 1;
    prevPrev = prev;
    prev = row;
  }
  return prev[b.length];
}

// Typos allowed scale with length; short words must be exact, or "Mali" would
// accept "Malu" and "Chad" would accept "Chap".
function allowedTypos(len) {
  if (len <= 4) return 0;
  if (len <= 7) return 1;
  if (len <= 12) return 2;
  return 3;
}

export function answerKey(listId, display) {
  return hashString(`${listId}|${display}`).toString(36);
}

const indexCache = new Map();

// Builds { answers: [{key, display, weight}], exact: Map<form, Set<idx>>, forms: [{form, idx}] }
export function indexList(list) {
  if (indexCache.has(list.id)) return indexCache.get(list.id);

  const answers = list.answers.map(([display, weight]) => ({
    key: answerKey(list.id, display),
    display,
    weight,
  }));

  const exact = new Map();
  const forms = [];
  const add = (form, idx) => {
    if (!form) return;
    for (const f of new Set([form, compact(form)])) {
      if (!exact.has(f)) exact.set(f, new Set());
      exact.get(f).add(idx);
    }
    forms.push({ form: compact(form), nums: numerals(form), idx });
  };

  list.answers.forEach(([display, , ...aliases], idx) => {
    add(normalise(display), idx);
    for (const a of aliases) add(normalise(a), idx);
  });

  // Bare surnames for people lists.
  if (list.surnames) {
    const counts = new Map();
    const lastOf = list.answers.map(([display]) => {
      const parts = normalise(display).split(" ");
      return parts[parts.length - 1];
    });
    for (const s of lastOf) counts.set(s, (counts.get(s) || 0) + 1);
    // Shared surnames go in too: they hit several answers, which matchGuess
    // reports as ambiguous ("which Roosevelt?") rather than as a miss.
    lastOf.forEach((s, idx) => {
      if (s.length >= 3) add(s, idx);
    });
  }

  const index = { answers, exact, forms };
  indexCache.set(list.id, index);
  return index;
}

// Numbers and roman numerals in a title are never typo-corrected: "Moana 2"
// is not "Moana", and "Henry IX" is not "Henry IV".
function numerals(spaced) {
  return spaced
    .split(" ")
    .filter((t) => /^(\d+|[ivxl]+)$/.test(t))
    .join(" ");
}

const decoyCache = new WeakMap();
function decoySet(list) {
  if (!list.decoys) return null;
  if (!decoyCache.has(list)) decoyCache.set(list, new Set(list.decoys));
  return decoyCache.get(list);
}

export const NO_MATCH = -1;
export const AMBIGUOUS = -2;

// → index into list.answers, NO_MATCH, or AMBIGUOUS.
export function matchGuess(list, guess) {
  const g = normalise(guess);
  if (!g) return -1;
  const { exact, forms } = indexList(list);

  for (const f of [g, compact(g)]) {
    const hit = exact.get(f);
    if (hit && hit.size === 1) return [...hit][0];
    if (hit && hit.size > 1) return AMBIGUOUS; // "malone", "roosevelt"
  }

  // A guess that's a real thing in its own right (another list's answer, or
  // a known confusable like Iceland/Ireland) is wrong, not a typo.
  const decoys = decoySet(list);
  if (decoys && (decoys.has(g) || decoys.has(compact(g)))) return -1;

  const gc = compact(g);
  const gNums = numerals(g);
  const cap = allowedTypos(gc.length);
  if (cap === 0) return -1;

  let best = cap + 1;
  let bestIdx = -1;
  let tie = false;
  for (const { form, nums, idx } of forms) {
    if (form.length <= 4) continue;
    if (nums !== gNums) continue;
    // Both the guess and the answer must allow this many typos; a long guess
    // doesn't earn extra slack against a short answer.
    const limit = Math.min(cap, allowedTypos(form.length));
    const d = editDistance(gc, form, limit);
    if (d > limit) continue;
    if (d < best) {
      best = d;
      bestIdx = idx;
      tie = false;
    } else if (d === best && idx !== bestIdx) {
      tie = true;
    }
  }
  if (bestIdx === -1 || tie) return -1;
  return bestIdx;
}
