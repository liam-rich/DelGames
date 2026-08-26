// Two-player Deep Dive. Both players get the same seven prompts and answer
// them independently; the round only opens up once both have answered, and the
// run only advances once both have said they're ready.
//
// Unlike the other engines this one is async — scoring an answer needs the
// prompt bank and the live answer distribution, both of which are server-side.

import {
  pickPrompts,
  getPrompt,
  scoreAnswer,
  revealFor,
  resolveAnswer,
  PROMPTS_PER_RUN,
  SECONDS_PER_PROMPT,
} from "../deepDive/scoring";
import { readObserved, recordAnswer } from "../deepDive/store";

export const SEATS = ["p1", "p2"];

function assertSeat(seat) {
  if (!SEATS.includes(seat)) throw new Error("Unknown player.");
}

function hasAnswered(state, seat) {
  return state.answers[seat].length > state.index;
}

export function createInitialState({ pack = "general" } = {}) {
  return {
    phase: "playing", // playing -> reveal -> (loop) -> done
    pack,
    prompts: pickPrompts(PROMPTS_PER_RUN, pack).map((p) => ({ id: p.id, text: p.text })),
    seconds: SECONDS_PER_PROMPT,
    index: 0,
    answers: { p1: [], p2: [] },
    ready: { p1: false, p2: false },
    scores: { p1: 0, p2: 0 },
  };
}

// Scores one answer against the bank and shapes it for the client.
async function buildEntry(prompt, rawAnswer) {
  const observed = await readObserved(prompt.id);
  const result = scoreAnswer(prompt, rawAnswer, observed);
  if (result.valid) recordAnswer(prompt.id, result.answer);
  return {
    ...result,
    promptId: prompt.id,
    promptText: prompt.text,
    given: rawAnswer,
    sharePercent: result.share == null ? null : Number((result.share * 100).toFixed(1)),
    reveal: revealFor(prompt, result.share, observed),
  };
}

export async function applyAction(state, action) {
  switch (action.type) {
    case "SUBMIT_ANSWER": {
      const { seat, answer } = action;
      assertSeat(seat);
      if (state.phase !== "playing") throw new Error("Not taking answers right now.");
      if (hasAnswered(state, seat)) throw new Error("You've already answered this one.");

      const prompt = getPrompt(state.prompts[state.index].id);
      if (!prompt) throw new Error("That prompt is no longer available.");

      const entry = await buildEntry(prompt, answer);
      const answers = { ...state.answers, [seat]: [...state.answers[seat], entry] };
      const scores = { ...state.scores, [seat]: state.scores[seat] + entry.points };

      // The round only opens once both have committed, so neither can see the
      // other's answer while still deciding on their own.
      const bothIn = answers.p1.length > state.index && answers.p2.length > state.index;
      return { ...state, answers, scores, phase: bothIn ? "reveal" : "playing" };
    }

    // Taking the "did you mean?" offer re-scores that player's own answer.
    // Only allowed before they've declared themselves ready.
    case "ACCEPT_SUGGESTION": {
      const { seat } = action;
      assertSeat(seat);
      if (state.phase !== "reveal") throw new Error("Nothing to correct right now.");
      if (state.ready[seat]) throw new Error("You've already locked that in.");

      const list = state.answers[seat];
      const current = list[state.index];
      if (!current?.suggestion) throw new Error("There's nothing to correct.");

      const prompt = getPrompt(current.promptId);
      const entry = await buildEntry(prompt, current.suggestion);
      const next = [...list];
      next[state.index] = entry;

      const scores = {
        ...state.scores,
        [seat]: state.scores[seat] - current.points + entry.points,
      };
      return { ...state, answers: { ...state.answers, [seat]: next }, scores };
    }

    case "READY": {
      const { seat } = action;
      assertSeat(seat);
      if (state.phase !== "reveal") throw new Error("Nothing to be ready for yet.");

      const ready = { ...state.ready, [seat]: true };
      if (!ready.p1 || !ready.p2) return { ...state, ready };

      const nextIndex = state.index + 1;
      if (nextIndex >= state.prompts.length) {
        return { ...state, ready, phase: "done" };
      }
      return { ...state, ready: { p1: false, p2: false }, index: nextIndex, phase: "playing" };
    }

    case "PLAY_AGAIN":
      return createInitialState({ pack: state.pack });

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// Re-exported so the pass-and-play screen can share the same rules.
export { resolveAnswer };
