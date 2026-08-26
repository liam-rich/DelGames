# DelGames

A small arcade of the puzzle games we keep coming back to — built with Next.js, ready to deploy on Vercel.

## Games

- **Word Streak** — our "Chain" game. Player 1 builds a 5-word chain where each word connects to the next. Player 2 sees the first word and the first letters of the rest, then reveals letters or guesses their way down the chain.
- **Codenames Duet** — the two-player co-op version of Codenames.
- **Category Scales** — a reversed Wavelength: one of you secretly marks a scale, the other invents categories and guesses where the mark is.
- **Deep Dive** — solo, pass-and-play or two phones. Seven prompts, 25 seconds each, name one thing. The rarer your answer, the deeper you sink. 109 prompts across six themed packs.

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
