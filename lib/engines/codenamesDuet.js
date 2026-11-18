// Pure game engine for Codenames Duet, shared by pass-and-play and online
// play so the two can never disagree about the rules.
//
// Follows the real Duet rules:
// - Each player's side of the key card shows 9 agents and 3 assassins, laid
//   out like the physical cards: 3 agents are shared, 1 of each player's
//   agents is an assassin on the other side, and so on. 15 agents in total.
// - A bystander only counts against the clue-giver whose key it's on. The
//   word stays live for the other player, because it may be one of theirs.
// - Once one player's agents are all found, their partner gives every
//   remaining clue.
// - When the timer runs out, sudden death: no more clues. Either player
//   touches a word they think is one of their partner's agents, and
//   anything that isn't loses the game.

import { getRandomBoardWords } from "../wordbank.js";

const GRID_SIZE = 25;
export const TOTAL_AGENTS = 15;
export const STARTING_TURNS = 9;

// [p1 side, p2 side, how many cells] — the layout of a real key card.
const KEY_LAYOUT = [
  ["agent", "agent", 3],
  ["agent", "bystander", 5],
  ["bystander", "agent", 5],
  ["agent", "assassin", 1],
  ["assassin", "agent", 1],
  ["assassin", "assassin", 1],
  ["assassin", "bystander", 1],
  ["bystander", "assassin", 1],
  ["bystander", "bystander", 7],
];

function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function dealGame() {
  const words = getRandomBoardWords(GRID_SIZE);
  const order = shuffledIndices(GRID_SIZE);
  const keyP1 = Array(GRID_SIZE);
  const keyP2 = Array(GRID_SIZE);
  let at = 0;
  for (const [a, b, n] of KEY_LAYOUT) {
    for (let k = 0; k < n; k++, at++) {
      keyP1[order[at]] = a;
      keyP2[order[at]] = b;
    }
  }
  return {
    words,
    keyP1,
    keyP2,
    // Facts everyone can see: a found agent or a hit assassin.
    revealed: Array(GRID_SIZE).fill(null), // null | 'agent' | 'assassin'
    // Bystanders are per key: bystander.p1[i] means "not one of P1's agents".
    bystander: { p1: Array(GRID_SIZE).fill(false), p2: Array(GRID_SIZE).fill(false) },
  };
}

export const other = (seat) => (seat === "p1" ? "p2" : "p1");
export const keyOf = (game, seat) => (seat === "p1" ? game.keyP1 : game.keyP2);

export function agentsLeft(game, seat) {
  const key = keyOf(game, seat);
  return key.reduce((n, k, i) => n + (k === "agent" && game.revealed[i] !== "agent" ? 1 : 0), 0);
}

// Can a word still be guessed against this player's key?
export function guessableFor(game, seat, index) {
  return !game.revealed[index] && !game.bystander?.[seat]?.[index];
}

export function createInitialState() {
  return {
    phase: "lobby", // lobby -> clue -> guess -> (loop) -> [sudden] -> results
    game: null,
    activeGiver: "p1",
    turnsRemaining: STARTING_TURNS,
    agentsFound: 0,
    clueLog: [],
    activeClue: null, // { giver, word, number }
    guessesLeft: 0,
    lastGuess: null, // { seat, index, truth } — for feedback on every device
    outcome: null, // { result: 'won' | 'lost', reason }
  };
}

function guesserOf(state) {
  return other(state.activeGiver);
}

function endTurn(state) {
  const nextTurns = state.turnsRemaining - 1;
  const base = { ...state, activeClue: null, guessesLeft: 0, turnsRemaining: Math.max(0, nextTurns) };
  if (nextTurns <= 0) return { ...base, phase: "sudden" };
  // Clue-giving alternates, unless the next player has no agents left to clue.
  let next = other(state.activeGiver);
  if (agentsLeft(state.game, next) === 0) next = state.activeGiver;
  return { ...base, activeGiver: next, phase: "clue" };
}

function reveal(game, index, truth) {
  const revealed = [...game.revealed];
  revealed[index] = truth;
  return { ...game, revealed };
}

export function applyAction(state, action) {
  switch (action.type) {
    case "DEAL": {
      if (state.phase !== "lobby") throw new Error("Already dealt.");
      return { ...createInitialState(), game: dealGame(), phase: "clue" };
    }

    case "GIVE_CLUE": {
      const { seat, word, number } = action;
      if (state.phase !== "clue") throw new Error("Not time for a clue.");
      if (seat !== state.activeGiver) throw new Error("Not your turn to give a clue.");
      const clean = (word || "").trim().toUpperCase();
      if (!clean) throw new Error("Enter a one-word clue.");
      if (!/^[A-Z]+$/.test(clean)) throw new Error("Clues are a single word, letters only.");
      if (state.game.words.includes(clean)) throw new Error("That word is on the board — pick another clue.");
      const n = Math.max(0, Math.min(9, Number(number) || 0));
      const clue = { giver: seat, word: clean, number: n };
      return {
        ...state,
        activeClue: clue,
        clueLog: [...state.clueLog, clue],
        // A clue of 0 still allows guessing, as in the real game.
        guessesLeft: n === 0 ? 9 : n + 1,
        guessesMade: 0,
        lastGuess: null,
        phase: "guess",
      };
    }

    case "GUESS_TILE": {
      const { seat, index } = action;
      const g = state.game;
      if (!g || !(index >= 0 && index < GRID_SIZE)) throw new Error("No such word.");

      if (state.phase === "sudden") {
        // Touch a word you think is one of your partner's agents.
        const partner = other(seat);
        if (agentsLeft(g, partner) === 0) throw new Error("Your partner's agents are all found — they make the guesses now.");
        if (!guessableFor(g, partner, index)) throw new Error("That word is already ruled out.");
        const truth = keyOf(g, partner)[index];
        const lastGuess = { seat, index, truth };
        if (truth !== "agent") {
          const game = truth === "assassin" ? reveal(g, index, "assassin") : g;
          return { ...state, game, lastGuess, phase: "results", outcome: { result: "lost", reason: truth === "assassin" ? "assassin" : "sudden" } };
        }
        const found = state.agentsFound + 1;
        const game = reveal(g, index, "agent");
        if (found >= TOTAL_AGENTS) return { ...state, game, agentsFound: found, lastGuess, phase: "results", outcome: { result: "won" } };
        return { ...state, game, agentsFound: found, lastGuess };
      }

      if (state.phase !== "guess") throw new Error("Not time to guess.");
      if (seat !== guesserOf(state)) throw new Error("Not your turn to guess.");
      const giver = state.activeClue.giver;
      if (!guessableFor(g, giver, index)) throw new Error("That word is already ruled out.");

      const truth = keyOf(g, giver)[index];
      const lastGuess = { seat, index, truth };

      if (truth === "assassin") {
        return { ...state, game: reveal(g, index, "assassin"), lastGuess, phase: "results", outcome: { result: "lost", reason: "assassin" } };
      }

      if (truth === "agent") {
        const found = state.agentsFound + 1;
        const game = reveal(g, index, "agent");
        if (found >= TOTAL_AGENTS) {
          return { ...state, game, agentsFound: found, lastGuess, phase: "results", outcome: { result: "won" } };
        }
        const left = state.guessesLeft - 1;
        const next = { ...state, game, agentsFound: found, lastGuess, guessesLeft: left, guessesMade: (state.guessesMade || 0) + 1 };
        // Out of guesses, or nothing left on this key to find: turn over.
        if (left <= 0 || agentsLeft(game, giver) === 0) return endTurn(next);
        return next;
      }

      // Bystander on the giver's key: mark it for them only, turn over.
      const prev = g.bystander || { p1: Array(GRID_SIZE).fill(false), p2: Array(GRID_SIZE).fill(false) };
      const bystander = { ...prev, [giver]: prev[giver].map((v, i) => v || i === index) };
      return endTurn({ ...state, game: { ...g, bystander }, lastGuess });
    }

    case "STOP_GUESSING": {
      const { seat } = action;
      if (state.phase !== "guess") throw new Error("Not time to guess.");
      if (seat !== guesserOf(state)) throw new Error("Not your turn to guess.");
      if (!state.guessesMade) throw new Error("Make at least one guess first.");
      return endTurn({ ...state, lastGuess: null });
    }

    case "PLAY_AGAIN": {
      return createInitialState();
    }

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
