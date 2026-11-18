// The slice of the bank a run needs on the device: each prompt's answers plus
// the live answer counts, so the browser can score exactly like the server.

import { getPrompt } from "./scoring.js";
import { readObserved } from "./store.js";

export async function promptPacks(ids) {
  const out = [];
  for (const id of ids.slice(0, 12)) {
    const p = getPrompt(id);
    if (!p) continue;
    out.push({ id: p.id, text: p.text, answers: p.answers, observed: await readObserved(p.id) });
  }
  return out;
}
