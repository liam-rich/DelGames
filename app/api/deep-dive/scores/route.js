import { NextResponse } from "next/server";
import { getPrompt, scoreAnswer, PROMPTS_PER_RUN } from "../../../../lib/deepDive/scoring";
import {
  readObserved,
  readLeaderboard,
  submitScore,
  storeAvailable,
  qualifiesForBoard,
  MAX_BOARD,
} from "../../../../lib/deepDive/store";

export const dynamic = "force-dynamic";

// `cutoff` lets the client tell, without a second request, whether a finished
// run earned a place — and so whether to ask for a name at all.
export async function GET() {
  const board = await readLeaderboard();
  const rows = board || [];
  return NextResponse.json({
    available: storeAvailable(),
    board: rows,
    capacity: MAX_BOARD,
    cutoff: rows.length >= MAX_BOARD ? rows[rows.length - 1].points : 0,
  });
}

// The client sends the answers it gave, not a total — the run is re-scored here
// so a submitted score always reflects answers that were actually typed.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const name = String(body?.name || "").trim().slice(0, 16) || "Anonymous";
  const answers = Array.isArray(body?.answers) ? body.answers.slice(0, PROMPTS_PER_RUN) : [];
  if (!answers.length) return NextResponse.json({ error: "No answers to submit." }, { status: 400 });

  let points = 0;
  let best = null;
  let bestPoints = -1;

  for (const entry of answers) {
    const prompt = getPrompt(entry?.promptId);
    if (!prompt) continue;
    const observed = await readObserved(prompt.id);
    const result = scoreAnswer(prompt, entry?.answer, observed);
    points += result.points;
    if (result.valid && result.points > bestPoints) {
      bestPoints = result.points;
      best = result.answer;
    }
  }

  // Re-check against the live board: a rival run may have landed since the
  // client decided this score was worth a name.
  const current = await readLeaderboard();
  if (!qualifiesForBoard(points, current)) {
    return NextResponse.json({
      available: storeAvailable(),
      points,
      posted: false,
      board: current || [],
    });
  }

  const board = await submitScore({ name, points, best });
  return NextResponse.json({ available: storeAvailable(), points, posted: true, board: board || [] });
}
