// Pure game engine for Word Streak. No React, no timers — just state in,
// state out. Both the local pass-and-play UI and the online room API call
// into this so the rules can never drift between the two modes.

export const WORD_COUNT = 5;

function emptyWords() {
  return Array.from({ length: WORD_COUNT }, () => "");
}

function cleanWord(w) {
  return (w || "").replace(/[^a-zA-Z]/g, "").toLowerCase();
}

export function createInitialState() {
  return {
    p1Words: null, // becomes an array of 5 once submitted
    p2Words: null,
    starter: "p1",
    wins: { p1: 0, p2: 0 },
    playing: false,
    currentTurn: "p1",
    p1TargetIndex: 1,
    p2TargetIndex: 1,
    p1Revealed: 1,
    p2Revealed: 1,
    finishOrder: [],
    guessInputEcho: "", // not used server-side, kept for shape symmetry
    lastEvent: null, // { type: 'correct' | 'wrong' | 'reveal', by }
  };
}

function validateWords(words) {
  if (!Array.isArray(words) || words.length !== WORD_COUNT) return null;
  const cleaned = words.map(cleanWord);
  if (cleaned.some((w) => w.length < 1)) return null;
  return cleaned;
}

export function applyAction(state, action) {
  switch (action.type) {
    case "SUBMIT_WORDS": {
      const { seat, words } = action;
      const cleaned = validateWords(words);
      if (!cleaned) throw new Error("Enter all 5 words first.");
      const key = seat === "p1" ? "p1Words" : "p2Words";
      const next = { ...state, [key]: cleaned };
      if (next.p1Words && next.p2Words && !next.playing) {
        next.playing = true;
        next.currentTurn = next.starter;
        next.p1TargetIndex = 1;
        next.p2TargetIndex = 1;
        next.p1Revealed = 1;
        next.p2Revealed = 1;
        next.finishOrder = [];
        next.lastEvent = null;
      }
      return next;
    }

    case "GUESS": {
      const { seat, guess } = action;
      if (!state.playing) throw new Error("Game hasn't started yet.");
      if (state.finishOrder.length === 2) throw new Error("Round is over.");
      const soloRemaining = state.finishOrder.length === 1 ? state.finishOrder[0] === "p1" ? "p2" : "p1" : null;
      const actingSeat = soloRemaining || state.currentTurn;
      if (seat !== actingSeat) throw new Error("Not your turn.");

      const targetWords = actingSeat === "p1" ? state.p2Words : state.p1Words;
      const targetIndexKey = actingSeat === "p1" ? "p1TargetIndex" : "p2TargetIndex";
      const revealedKey = actingSeat === "p1" ? "p1Revealed" : "p2Revealed";
      const targetIndex = state[targetIndexKey];
      const currentWord = targetWords[targetIndex];
      const guessClean = cleanWord(guess);

      const next = { ...state };

      if (guessClean === currentWord) {
        if (targetIndex === WORD_COUNT - 1) {
          const finishOrder = state.finishOrder.includes(actingSeat)
            ? state.finishOrder
            : [...state.finishOrder, actingSeat];
          next.finishOrder = finishOrder;
          next.lastEvent = { type: "correct", by: actingSeat };
          if (finishOrder.length === 2) {
            const roundWinner = finishOrder[0];
            next.wins = { ...state.wins, [roundWinner]: state.wins[roundWinner] + 1 };
          } else {
            next.currentTurn = actingSeat === "p1" ? "p2" : "p1";
          }
        } else {
          next[targetIndexKey] = targetIndex + 1;
          next[revealedKey] = 1;
          next.lastEvent = { type: "correct", by: actingSeat };
        }
      } else {
        next.lastEvent = { type: "wrong", by: actingSeat };
        if (state.finishOrder.length === 0) {
          next.currentTurn = actingSeat === "p1" ? "p2" : "p1";
        }
        // if one player already finished, the turn simply stays put
      }
      return next;
    }

    case "REVEAL": {
      const { seat } = action;
      if (!state.playing) throw new Error("Game hasn't started yet.");
      if (state.finishOrder.length === 2) throw new Error("Round is over.");
      const soloRemaining = state.finishOrder.length === 1 ? state.finishOrder[0] === "p1" ? "p2" : "p1" : null;
      const actingSeat = soloRemaining || state.currentTurn;
      if (seat !== actingSeat) throw new Error("Not your turn.");

      const targetWords = actingSeat === "p1" ? state.p2Words : state.p1Words;
      const targetIndexKey = actingSeat === "p1" ? "p1TargetIndex" : "p2TargetIndex";
      const revealedKey = actingSeat === "p1" ? "p1Revealed" : "p2Revealed";
      const targetIndex = state[targetIndexKey];
      const currentWord = targetWords[targetIndex];
      const revealed = state[revealedKey];
      const canReveal = currentWord.length - revealed > 1;
      if (!canReveal) throw new Error("No hints left — you must guess.");

      const next = { ...state };
      next[revealedKey] = Math.min(revealed + 1, currentWord.length);
      next.lastEvent = { type: "reveal", by: actingSeat };
      if (state.finishOrder.length === 0) {
        next.currentTurn = actingSeat === "p1" ? "p2" : "p1";
      }
      return next;
    }

    case "PLAY_AGAIN": {
      return {
        ...createInitialState(),
        starter: state.starter === "p1" ? "p2" : "p1",
        wins: state.wins,
      };
    }

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
