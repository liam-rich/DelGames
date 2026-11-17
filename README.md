# DelGames

A small arcade of the puzzle games we keep coming back to — built with Next.js, ready to deploy on Vercel.

## Games

- **Word Streak** — our "Chain" game. Player 1 builds a 5-word chain where each word connects to the next. Player 2 sees the first word and the first letters of the rest, then reveals letters or guesses their way down the chain.
- **Codenames Duet** — the two-player co-op version of Codenames.
- **Category Scales** — a reversed Wavelength: one of you secretly marks a scale, the other invents categories and guesses where the mark is.
- **Deep Dive** — solo, pass-and-play or two phones. Seven prompts, 25 seconds each, name one thing. The rarer your answer, the deeper you sink. 109 prompts across six themed packs.

- **Rarelist** — a daily trivia game. Everyone gets the same three lists each day (UTC). Roll two dice to set your clock and buy letter hints, then name five answers per list. Rarer answers score more.

The first three are two-player, and each offers pass-and-play or two-phone online play.

Deep Dive prompts are grouped into packs — Mixed Bag (everything), Atlas,
Natural World, The Larder, Showtime and Household. Each pack narrows the pool
and repaints the dive with its own ink and printed pattern.

## Deep Dive scoring

Rarity is graded against real data rather than guesswork. Two signals are blended
when the bank is built:

1. **Corpus frequency** — word counts from the Google Web Trillion Word Corpus
   (Peter Norvig's `count_1w.txt`, 333k words). How often a word is used is a
   decent proxy for how readily it comes to mind, and within a category it ranks
   answers roughly the way players do: `apple` 50M → `banana` 5.5M → `lychee` 108k.
2. **Curation order** — each answer list in `scripts/deep-dive/prompts/` is
   written most-nameable first. That supplies the word-sense judgement a unigram
   corpus can't: frequency alone would rank `it` as the top school subject and
   `thing` as the top superhero.

Points are Shannon surprisal — how many bits of information your answer carries —
so a 1-in-1000 pick scores roughly four times an obvious one. Once the game is
live, real player answers are recorded and blended in on top of the corpus prior,
so rarity sharpens as more people play.

To regenerate `lib/deepDive/bank.js` after editing the prompt files:

```bash
node scripts/deep-dive/build-bank.mjs
```

The corpus downloads once to `.cache/` (gitignored, ~5MB).

Answer matching has an edge-case harness — qualifier words ("dental floss" →
floss), plurals, spacing, typos, and the guards that stop one entry shadowing
another:

```bash
node scripts/deep-dive/test-matching.mjs
```

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying

Push to GitHub and import the repo in [Vercel](https://vercel.com/new) — it's a
standard Next.js app.

Two-phone online play and the Deep Dive leaderboard both need a KV store: add
Vercel KV (or an Upstash Redis integration) to the project and redeploy. Without
one, Deep Dive still plays fine — it falls back to the corpus prior and hides the
leaderboard.

## Rarelist

Code lives in `lib/rarelist/` (server-side rules, list bank, rarity model, storage) and
`app/rarelist/` (the client). The full answer bank (`lib/rarelist/lists.js`) is only imported by
the API route; the browser receives one round's list at a time.

- **Daily lists** — `daily.js` deals the bank out in shuffled cycles, three per UTC day,
  avoiding two lists from the same category on one day.
- **Dice** — two dice per round, a pure function of (player, day, round), so a reload never
  rerolls. The player picks which die sets the clock (30–90s) and which buys letter hints
  (0–3). Doubles add 15 seconds. Each player gets two rerolls per day.
- **No network during play** — like Wordle or Sporcle, the round's answers ship to the browser
  (lightly scrambled) when the player rolls, and every guess, typos included, is graded on the
  device. Round results post to the server in the background, with retries.
- **Matching** — case, accents, punctuation and leading articles are ignored; each answer has
  aliases; small typos are accepted when they point at exactly one answer; bare surnames work
  for people lists, and shared surnames ("Roosevelt") ask the player to be more specific.
- **Rarity** — each answer has a 1–100 popularity estimate. A simulation of players drawing
  five answers turns that into a baseline pick rate. Live pick rates are blended in with
  `w = n / (n + 200)`. When a list runs again, its last final pick rates also feed the baseline.
- **Tiers and points** — Common (≥35% of players), Uncommon (15–35%), Rare (5–15%),
  Legendary (<5%). Points move smoothly with log pick rate: roughly 10–15 / 15–27 / 27–42 / 42–60.
- **Provisional vs final** — scores shown during the day are provisional. The first request
  for a past day's results locks a snapshot (final pick rates and every player's re-scored
  total), which gives each player a final score and rank.

Live stats need Vercel KV / Upstash Redis (the same env vars as online play). Without a store
the game still works, scoring against the baseline only. In `next dev` an in-memory store
stands in.

Tune points and tiers in `lib/rarelist/core.js`, and the blend constant in `lib/rarelist/rarity.js`.
