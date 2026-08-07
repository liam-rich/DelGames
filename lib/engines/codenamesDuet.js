// Pure game engine for Codenames Duet. See lib/engines/wordStreak.js for
// why this is split out from the React components.

import { getRandomBoardWords } from "../wordbank.js";

const GRID_SIZE = 25;
const SHARED_AGENTS = 3;
const EXCLUSIVE_AGENTS_EACH = 6;
export const TOTAL_AGENTS = SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH * 2; // 15
const STARTING_TURNS = 9;

function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function dealGame() {
  const words = getRandomBoardWords(GRID_SIZE);
  const order = shuffledIndices(GRID_SIZE);

  const sharedAgents = order.slice(0, SHARED_AGENTS);
  const p1OnlyAgents = order.slice(SHARED_AGENTS, SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH);
  const p2OnlyAgents = order.slice(
    SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH,
    SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH * 2
  );
  const rest = order.slice(SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH * 2);
  const sharedAssassin = rest[0];
  const p1OnlyAssassin = rest[1];
  const p2OnlyAssassin = rest[2];

  const keyP1 = Array(GRID_SIZE).fill("bystander");
  const keyP2 = Array(GRID_SIZE).fill("bystander");

  [...sharedAgents, ...p1OnlyAgents].forEach((i) => (keyP1[i] = "agent"));
  [...sharedAgents, ...p2OnlyAgents].forEach((i) => (keyP2[i] = "agent"));
  [sharedAssassin, p1OnlyAssassin].forEach((i) => (keyP1[i] = "assassin"));
  [sharedAssassin, p2OnlyAssassin].forEach((i) => (keyP2[i] = "assassin"));

  return {
    words,
    keyP1,
    keyP2,
    revealed: Array(GRID_SIZE).fill(null),
  };
}

export function createInitialState() {
  return {
    phase: "lobby", // lobby -> clue -> guess -> (loop) -> results
    game: null,
    activeGiver: "p1",
    turnsRemaining: STARTING_TURNS,
    agentsFound: 0,
    clueLog: [],
    activeClue: null, // { giver, word, number }
    guessesLeft: 0,
    outcome: null, // { result: 'won' | 'lost', reason }
  };
}

function guesserOf(state) {
  return state.activeGiver === "p1" ? "p2" : "p1";
}

function endTurn(state) {
  const nextTurns = state.turnsRemaining - 1;
  if (nextTurns <= 0) {
    return {
      ...state,
      activeClue: null,
      guessesLeft: 0,
      turnsRemaining: 0,
      phase: "results",
      outcome: { result: "lost", reason: "timeout" },
    };
  }
  return {
    ...state,
    activeClue: null,
    guessesLeft: 0,
    turnsRemaining: nextTurns,
    activeGiver: guesserOf(state),
    phase: "clue",
  };
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
        guessesLeft: n + 1,
        phase: "guess",
      };
    }

    case "GUESS_TILE": {
      const { seat, index } = action;
      if (state.phase !== "guess") throw new Error("Not time to guess.");
      if (seat !== guesserOf(state)) throw new Error("Not your turn to guess.");
      if (!state.game || state.game.revealed[index]) throw new Error("That tile is already revealed.");

      const key = state.activeClue.giver === "p1" ? state.game.keyP1 : state.game.keyP2;
      const truth = key[index];
      const nextRevealed = [...state.game.revealed];
      nextRevealed[index] = truth;
      const nextGame = { ...state.game, revealed: nextRevealed };

      if (truth === "assassin") {
        return {
          ...state,
          game: nextGame,
          phase: "results",
          outcome: { result: "lost", reason: "assassin" },
        };
      }

      if (truth === "agent") {
        const nextFound = state.agentsFound + 1;
        if (nextFound >= TOTAL_AGENTS) {
          return {
            ...state,
            game: nextGame,
            agentsFound: nextFound,
            phase: "results",
            outcome: { result: "won" },
          };
        }
        const left = state.guessesLeft - 1;
        if (left <= 0) {
          return endTurn({ ...state, game: nextGame, agentsFound: nextFound });
        }
        return { ...state, game: nextGame, agentsFound: nextFound, guessesLeft: left };
      }

      // bystander — turn ends immediately
      return endTurn({ ...state, game: nextGame });
    }

    case "STOP_GUESSING": {
      const { seat } = action;
      if (state.phase !== "guess") throw new Error("Not time to guess.");
      if (seat !== guesserOf(state)) throw new Error("Not your turn to guess.");
      return endTurn(state);
    }

    case "PLAY_AGAIN": {
      return createInitialState();
    }

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
