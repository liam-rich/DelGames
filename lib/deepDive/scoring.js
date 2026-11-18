// Deep Dive scoring, server side: the rules live in score-core.js; this adds
// the prompt bank, which never ships to the browser in full.

import { BANK } from "./bank.js";
import { PROMPTS_PER_RUN } from "./score-core.js";

export * from "./score-core.js";

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

