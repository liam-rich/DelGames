// Decoys: real things that sit one typo away from a list's answers.
// SERVER-ONLY (reads the whole bank).
//
// Typo forgiveness is great until "Iceland" scores as Ireland or "Libra" as
// Libya. A guess that is itself a real answer elsewhere, or a common
// confusable, should be marked wrong rather than corrected. For each list we
// keep just the decoys its fuzzy matcher would otherwise accept. They ship in
// the round pack so the browser grades exactly like the server.

import { LISTS } from "./lists.js";
import { matchGuess, normalise } from "./match.js";

// Plausible wrong answers that aren't answers in any list.
const EXTRA = [
  // Countries not covered by any list
  "Albania", "Andorra", "Armenia", "Australia", "Azerbaijan", "Bahamas", "Bahrain", "Barbados", "Belarus",
  "Belize", "Bosnia", "Brunei", "Cambodia", "Costa Rica", "Cuba", "Dominica", "Dominican Republic",
  "El Salvador", "Fiji", "Georgia", "Grenada", "Guatemala", "Haiti", "Honduras", "Hungary", "Iran",
  "Iraq", "Israel", "Jamaica", "Jordan", "Kiribati", "Kosovo", "Kuwait", "Lebanon", "Liechtenstein",
  "Malaysia", "Maldives", "Moldova", "Montenegro", "Nauru", "New Zealand", "Nicaragua", "North Macedonia",
  "Oman", "Palau", "Palestine", "Panama", "Papua New Guinea", "Qatar", "Romania", "Samoa", "San Marino",
  "Saudi Arabia", "Serbia", "Singapore", "Solomon Islands", "South Korea", "Korea", "Sri Lanka", "Syria",
  "Taiwan", "Thailand", "Timor", "Tonga", "Trinidad", "Turkey", "Tuvalu", "Ukraine", "United Arab Emirates",
  "Vanuatu", "Yemen", "Greenland", "England", "Scotland", "Wales", "Britain", "Canada", "Iceland",
  // US states not covered
  "Alabama", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida",
  "Hawaii", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Nebraska", "Nevada",
  "New Jersey", "New Mexico", "North Carolina", "Oklahoma", "Oregon", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "West Virginia", "Wisconsin", "Wyoming",
  // Assorted near-misses
  "Vienna", "Venice", "Athena", "Athens", "Hades", "Lover", "Libra",
  "Tiger", "Aries", "Ariel", "Bears", "Honda", "Hero", "Kryptonite", "Elio", "Hoppers", "Onward",
  "Soul", "Luca", "Turning Red", "Elemental", "Lightyear", "Frozen", "Wish", "Elsa", "Anna", "Wicked",
  "Hamilton", "Les Miserables", "Rent", "Kevin Love", "Larry Bird", "Magic Johnson", "Ray Allen",
  "Allen Iverson", "Patrick Ewing", "Andy Murray", "Carlos Alcaraz", "Jannik Sinner", "Edward III",
  "Henry VII", "Richard I", "Pedro", "Rome", "Romeo", "Juliet", "Iron", "Zinc", "Tin", "Gold", "Silver",
  "Lion", "Eagles", "Saints", "Jets", "Giants", "Packers", "Kia", "Hyundai", "Tesla", "Moon", "Sun",
  "Titan", "Europa", "Io", "Ganymede", "Callisto", "Triton", "Charon", "Sedna", "Vesta",
];

const ALL_FORMS = (() => {
  const set = new Set();
  for (const l of LISTS) for (const [d, , ...al] of l.answers) for (const f of [d, ...al]) set.add(normalise(f));
  for (const e of EXTRA) set.add(normalise(e));
  set.delete("");
  return [...set];
})();

export function withDecoys(list) {
  if (!list || list.decoysReady) return list;
  const own = new Set(list.answers.flatMap(([d, , ...al]) => [d, ...al].map(normalise)));
  const decoys = (list.decoys || []).map(normalise);
  list.decoys = undefined; // match without decoys while working them out
  for (const f of ALL_FORMS) {
    if (own.has(f)) continue;
    if (matchGuess(list, f) >= 0) decoys.push(f);
  }
  list.decoys = decoys;
  list.decoysReady = true;
  return list;
}
