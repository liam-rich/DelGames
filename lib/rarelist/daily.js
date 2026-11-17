// Which three lists run on which day. SERVER-ONLY.
//
// The bank is dealt out in cycles: every list runs once before any repeats,
// and each cycle is reshuffled. Within a day we try not to stack two lists of
// the same category (three geography rounds in a row is a slog).

import { LISTS, getList } from "./lists.js";
import { withDecoys } from "./decoys.js";
import { ROUNDS_PER_DAY, mulberry32, hashString } from "./core.js";
import { indexList } from "./match.js";
import { priorShares } from "./rarity.js";

const PER_CYCLE = Math.floor(LISTS.length / ROUNDS_PER_DAY);
const cycleCache = new Map();

function cycleSchedule(cycle) {
  if (cycleCache.has(cycle)) return cycleCache.get(cycle);
  const rand = mulberry32(hashString(`rarelist-cycle|${cycle}`));
  const pool = LISTS.map((l) => l.id);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const days = [];
  for (let d = 0; d < PER_CYCLE; d++) {
    const today = [];
    const cats = new Set();
    while (today.length < ROUNDS_PER_DAY && pool.length) {
      let pick = pool.findIndex((id) => !cats.has(getList(id).category));
      if (pick === -1) pick = 0;
      const [id] = pool.splice(pick, 1);
      today.push(id);
      cats.add(getList(id).category);
    }
    days.push(today);
  }
  cycleCache.set(cycle, days);
  return days;
}

export function listsForDay(day) {
  const d = Math.max(0, day);
  const cycle = Math.floor(d / PER_CYCLE);
  return cycleSchedule(cycle)[d % PER_CYCLE].map((id) => withDecoys(getList(id)));
}

export function listFor(day, round) {
  return listsForDay(day)[round] || null;
}

// Letter hints: the same answers are hinted for everyone, in the same order, so
// two players who both rolled two hints see the same two. They're drawn from
// the less obvious end of the list — a hint for "Brazil" would be no help.
export function hintsFor(list, day, round, count) {
  if (!count) return [];
  const { answers } = indexList(list);
  const prior = priorShares(list);
  const ranked = [...answers].sort((a, b) => prior.get(a.key) - prior.get(b.key));
  // Skip the very rarest third-or-so; aim for gettable-but-not-obvious.
  const start = Math.min(Math.floor(ranked.length * 0.15), Math.max(0, ranked.length - count * 2));
  const pool = ranked.slice(start, Math.max(start + count, Math.ceil(ranked.length * 0.7)));
  const rand = mulberry32(hashString(`hints|${day}|${round}|${list.id}`));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).map((a) => ({
    key: a.key,
    letter: a.display.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/^(The|A|An)\s+/, "")[0].toUpperCase(),
    words: a.display.replace(/^(The|A|An)\s+/, "").split(/\s+/).length,
  }));
}

export function publicListInfo(list) {
  return {
    id: list.id,
    title: list.title,
    note: list.note || null,
    category: list.category,
    size: list.answers.length,
  };
}
