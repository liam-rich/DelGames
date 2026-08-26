import { NextResponse } from "next/server";
import { getPrompt, scoreAnswer, revealFor } from "../../../../lib/deepDive/scoring";
import { readObserved, recordAnswer } from "../../../../lib/deepDive/store";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const prompt = getPrompt(body?.promptId);
  if (!prompt) return NextResponse.json({ error: "Unknown prompt." }, { status: 404 });

  const observed = await readObserved(prompt.id);
  const result = scoreAnswer(prompt, body?.answer, observed);

  if (result.valid) {
    // Fire and forget — the player shouldn't wait on bookkeeping.
    recordAnswer(prompt.id, result.answer);
  }

  return NextResponse.json({
    ...result,
    sharePercent: result.share == null ? null : Number((result.share * 100).toFixed(1)),
    reveal: revealFor(prompt, result.share, observed),
  });
}
