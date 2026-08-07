// Pure game engine for Category Scales. See lib/engines/wordStreak.js for
// why this is split out from the React components.

export const TOTAL_ROUNDS = 3;

export function scoreFor(diff) {
  if (diff <= 4) return { points: 5, label: "Perfect!" };
  if (diff <= 10) return { points: 3, label: "Close!" };
  if (diff <= 20) return { points: 1, label: "Decent" };
  return { points: 0, label: "Off the mark" };
}

export function createInitialState() {
  return {
    phase: "placing", // placing -> category -> response -> (loop) -> guessing -> reveal
    placer: "p1",
    totalScore: { p1: 0, p2: 0 },
    secretMark: null,
    rounds: [], // [{ left, right, response }]
    roundIndex: 0,
    pendingCategory: null, // { left, right }
    guessMark: null,
    result: null, // { diff, points, label }
  };
}

function guesserOf(state) {
  return state.placer === "p1" ? "p2" : "p1";
}

export function applyAction(state, action) {
  switch (action.type) {
    case "PLACE_MARK": {
      const { seat, value } = action;
      if (state.phase !== "placing") throw new Error("Marks are already placed.");
      if (seat !== state.placer) throw new Error("Only the mark-setter can do that.");
      const v = Math.max(0, Math.min(100, Number(value)));
      if (Number.isNaN(v)) throw new Error("Invalid mark.");
      return { ...state, secretMark: v, phase: "category" };
    }

    case "SUBMIT_CATEGORY": {
      const { seat, left, right } = action;
      if (state.phase !== "category") throw new Error("Not time for a category.");
      if (seat !== guesserOf(state)) throw new Error("Only the guesser invents categories.");
      const l = (left || "").trim();
      const r = (right || "").trim();
      if (!l || !r) throw new Error("Fill in both ends of the scale.");
      if (l.toLowerCase() === r.toLowerCase()) throw new Error("The two ends should be different.");
      return { ...state, pendingCategory: { left: l, right: r }, phase: "response" };
    }

    case "SUBMIT_RESPONSE": {
      const { seat, text } = action;
      if (state.phase !== "response") throw new Error("Not time for a response.");
      if (seat !== state.placer) throw new Error("Only the mark-setter responds.");
      const clean = (text || "").trim();
      if (!clean) throw new Error("Enter a response.");
      const round = { ...state.pendingCategory, response: clean };
      const rounds = [...state.rounds, round];
      const nextRoundIndex = state.roundIndex + 1;
      if (nextRoundIndex >= TOTAL_ROUNDS) {
        return { ...state, rounds, pendingCategory: null, phase: "guessing" };
      }
      return { ...state, rounds, pendingCategory: null, roundIndex: nextRoundIndex, phase: "category" };
    }

    case "SUBMIT_GUESS": {
      const { seat, value } = action;
      if (state.phase !== "guessing") throw new Error("Not time to guess.");
      if (seat !== guesserOf(state)) throw new Error("Only the guesser can guess.");
      const v = Math.max(0, Math.min(100, Number(value)));
      if (Number.isNaN(v)) throw new Error("Invalid guess.");
      const diff = Math.abs(v - state.secretMark);
      const scored = scoreFor(diff);
      const result = { diff, ...scored };
      const guesser = guesserOf(state);
      const totalScore = { ...state.totalScore, [guesser]: state.totalScore[guesser] + scored.points };
      return { ...state, guessMark: v, result, totalScore, phase: "reveal" };
    }

    case "PLAY_AGAIN": {
      return {
        ...createInitialState(),
        placer: state.placer === "p1" ? "p2" : "p1",
        totalScore: state.totalScore,
      };
    }

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
