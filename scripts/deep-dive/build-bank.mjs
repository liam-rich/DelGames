// Builds lib/deepDive/bank.js from the curated prompt files.
//
// Rarity is grounded in real data: word counts from the Google Web Trillion
// Word Corpus (Peter Norvig's count_1w.txt — 333k words). How often a word is
// used in English is a good proxy for how readily it comes to mind, so within
// a single category the corpus ranks answers roughly the way players do:
//   dog 77M > apple 50M > banana 5.5M > persimmon 259k > lychee 108k
//
// Counts are compressed (count^ALPHA) before being normalised into a share,
// because raw frequency overstates how lopsided real naming is, then clamped
// so no answer is impossible to score on.
//
// Usage: node scripts/deep-dive/build-bank.mjs

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const CORPUS_URL = "https://norvig.com/ngrams/count_1w.txt";
const CORPUS_CACHE = join(ROOT, ".cache", "count_1w.txt");
const OUT = join(ROOT, "lib", "deepDive", "bank.js");

const ALPHA = 0.9; // compresses the corpus' dynamic range toward naming behaviour
const BETA = 0.62; // weight on curation rank vs corpus frequency (0 = corpus only)
// A specific phrase is far rarer than its commonest word ("glow worm" is not as
// nameable as "glow"), so each extra word discounts the count.
const MULTIWORD_PENALTY = 0.18;
const MIN_SHARE = 0.0008; // a 1-in-1250 answer is the rarest we score
const MAX_SHARE = 0.4; // nothing is more than 40% of answers
const UNKNOWN_COUNT = 30000; // word absent from the corpus => genuinely obscure
const STOPWORDS = new Set(["a", "an", "the", "of", "and", "de", "la", "el"]);

export function normalise(raw) {
  return String(raw)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[-\s]+/g, " ")
    .trim()
    .replace(/^(a|an|the)\s+/, "");
}

async function loadCorpus() {
  if (!existsSync(CORPUS_CACHE)) {
    console.log("Downloading corpus (one-off, ~5MB)...");
    const res = await fetch(CORPUS_URL);
    if (!res.ok) throw new Error(`Corpus download failed: ${res.status}`);
    await mkdir(dirname(CORPUS_CACHE), { recursive: true });
    await writeFile(CORPUS_CACHE, await res.text());
  }
  const counts = new Map();
  const text = await readFile(CORPUS_CACHE, "utf8");
  for (const line of text.split("\n")) {
    const [word, n] = line.split("\t");
    if (word && n) counts.set(word.toLowerCase(), Number(n));
  }
  return counts;
}

// A phrase is as rare as its rarest meaningful word ("great white shark" -> shark).
function phraseCount(phrase, counts) {
  const words = phrase.split(" ").filter((w) => w && !STOPWORDS.has(w));
  if (!words.length) return UNKNOWN_COUNT;
  let min = Infinity;
  for (const w of words) min = Math.min(min, counts.get(w) ?? UNKNOWN_COUNT);
  if (min === Infinity) return UNKNOWN_COUNT;
  return min * Math.pow(MULTIWORD_PENALTY, words.length - 1);
}

function buildPrompt(prompt, counts) {
  const bias = prompt.bias || {};
  const entries = [];

  for (const chunk of prompt.answers.split(",")) {
    const forms = chunk.split("|").map(normalise).filter(Boolean);
    if (!forms.length) continue;
    const [canonical, ...aliases] = forms;
    // Two signals, blended geometrically:
    //  - corpus frequency: real data, but blind to word sense ("it", "thing")
    //  - curation rank: each list is written most-nameable first, which is a
    //    human prior the corpus cannot supply. Real naming follows Zipf's law,
    //    so 1/(rank+2) is a fair shape for it.
    const corpus = Math.pow(phraseCount(canonical, counts) * (bias[canonical] ?? 1), ALPHA);
    const rank = 1 / (entries.length + 2);
    entries.push({
      key: canonical,
      aliases,
      weight: Math.pow(rank, BETA) * Math.pow(corpus / 1e4, 1 - BETA),
    });
  }

  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  const answers = entries
    .map((e) => ({
      key: e.key,
      aliases: e.aliases,
      share: Math.min(MAX_SHARE, Math.max(MIN_SHARE, e.weight / total)),
    }))
    .sort((a, b) => b.share - a.share);

  return { id: prompt.id, text: prompt.text, answers };
}

async function main() {
  const counts = await loadCorpus();
  const files = ["nature", "animals", "food", "world", "culture", "everyday"];
  const prompts = [];

  for (const name of files) {
    const mod = await import(`./prompts/${name}.js`);
    for (const p of mod.default) prompts.push(buildPrompt(p, counts));
  }

  const ids = new Set();
  for (const p of prompts) {
    if (ids.has(p.id)) throw new Error(`Duplicate prompt id: ${p.id}`);
    ids.add(p.id);
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(
    OUT,
    "// GENERATED FILE — do not edit by hand.\n" +
      "// Run: node scripts/deep-dive/build-bank.mjs\n" +
      "// Rarity weights derive from the Google Web Trillion Word Corpus.\n" +
      `// ${prompts.length} prompts, ${prompts.reduce((n, p) => n + p.answers.length, 0)} answers.\n\n` +
      `export const BANK = ${JSON.stringify(prompts)};\n`
  );

  console.log(`Wrote ${prompts.length} prompts to lib/deepDive/bank.js`);
  for (const p of prompts.slice(0, 3)) {
    const top = p.answers.slice(0, 3).map((a) => `${a.key} ${(a.share * 100).toFixed(1)}%`);
    const rare = p.answers.slice(-2).map((a) => `${a.key} ${(a.share * 100).toFixed(1)}%`);
    console.log(`  ${p.id}: ${top.join(", ")} ... ${rare.join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
