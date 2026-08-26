// Edge-case harness for answer matching.
// Usage: node scripts/deep-dive/test-matching.mjs

import { getPrompt, scoreAnswer, matchAnswer, resolveAnswer } from "../../lib/deepDive/scoring.js";

// [promptId, input, expected] — expected null means "should not match".
const CASES = [
  // Qualifier words the bank stores in short form
  ["bathroom-item", "floss", "floss"],
  ["bathroom-item", "dental floss", "floss"],
  ["bathroom-item", "toilet paper", "toilet roll"],
  ["bathroom-item", "tooth paste", "toothpaste"],
  ["mountain", "everest", "everest"],
  ["mountain", "mount everest", "everest"],
  ["mountain", "mt everest", "everest"],
  ["river", "the nile", "nile"],
  ["river", "river nile", "nile"],
  ["river", "nile river", "nile"],
  ["cheese", "cheddar cheese", "cheddar"],
  ["tree", "oak tree", "oak"],
  // Forward containment must beat reverse: these are different countries.
  ["african-country", "republic of congo", "congo"],
  ["african-country", "democratic republic of congo", "democratic republic of congo"],

  // Bank stores the long form
  ["sea-creature", "great white shark", "great white shark"],
  ["sea-creature", "killer whale", "orca"],
  ["dog-breed", "german shepherd", "german shepherd"],
  ["capital-city", "washington d.c.", "washington dc"],

  // Plurals and spelling variants
  ["fruit", "strawberries", "strawberry"],
  ["fruit", "kiwifruit", "kiwi"],
  ["clothing", "t-shirt", "t shirt"],
  ["clothing", "tshirt", "t shirt"],
  ["clothing", "sneakers", "trainers"],
  ["insect", "ladybug", "ladybird"],
  ["insect", "lady bird", "ladybird"],

  // Everyday names for things the bank lists formally
  ["dog-breed", "alsatian", "german shepherd"],
  ["dog-breed", "sausage dog", "dachshund"],
  ["dog-breed", "lab", "labrador"],
  ["job", "bin man", "refuse collector"],
  ["bathroom-item", "loo roll", "toilet roll"],
  ["vegetable", "corn on the cob", "sweetcorn"],
  ["fruit", "sharon fruit", "persimmon"],
  ["african-country", "cote divoire", "ivory coast"],
  ["clothing", "trackies", "tracksuit"],

  // Typos
  ["fruit", "bananna", "banana"],
  ["instrument", "guitarr", "guitar"],

  // Should NOT match
  ["reptile", "quince", null],
  ["four-legged-animal", "banana", null],
  ["fruit", "", null],
  ["fruit", "asdfgh", null],

  // Containment must not let one common word claim a longer entry
  ["sea-creature", "sperm", null],
  ["sea-creature", "killer", null],
  ["big-cat", "mountain", null],
  ["instrument", "electric", null],
];

// Inputs too loose to score, but close enough to offer "did you mean?".
const SUGGEST_CASES = [
  ["fruit", "aple", "apple"],
  ["fruit", "mano", "mango"],
  ["instrument", "viol", "viola"],
  ["cheese", "brei", "brie"],
  // Two edits on a short-ish word: too loose to assume, close enough to offer.
  ["fruit", "pineapel", "pineapple"],
];

let pass = 0;
const fails = [];

for (const [promptId, input, expected] of CASES) {
  const prompt = getPrompt(promptId);
  if (!prompt) {
    fails.push(`  MISSING PROMPT ${promptId}`);
    continue;
  }
  const match = matchAnswer(prompt, input);
  const got = match ? match.key : null;
  if (got === expected) {
    pass++;
  } else {
    const pts = got ? scoreAnswer(prompt, input).points : 0;
    fails.push(`  ${promptId.padEnd(18)} "${input}"  ->  ${got ?? "(no match)"}  [want ${expected ?? "(no match)"}] ${got ? `${pts}pts` : ""}`);
  }
}

for (const [promptId, input, expected] of SUGGEST_CASES) {
  const prompt = getPrompt(promptId);
  const { answer, kind } = resolveAnswer(prompt, input);
  if (kind === "suggest" && answer?.key === expected) {
    pass++;
  } else {
    fails.push(`  ${promptId.padEnd(18)} "${input}"  ->  kind=${kind} ${answer?.key ?? ""}  [want suggest ${expected}]`);
  }
}

const total = CASES.length + SUGGEST_CASES.length;
console.log(`${pass}/${total} passed`);
if (fails.length) {
  console.log("\nFailures:");
  for (const f of fails) console.log(f);
  process.exit(1);
}
