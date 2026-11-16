import { NextResponse } from "next/server";
import { today, startRound, checkGuess, finishRound, finalResults, GameError } from "../../../../lib/rarelist/game";

export const dynamic = "force-dynamic";

const HANDLERS = {
  start: startRound,
  guess: checkGuess,
  finish: finishRound,
  final: finalResults,
};

export async function GET(_request, { params }) {
  const { action } = await params;
  if (action !== "today") return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(today());
}

export async function POST(request, { params }) {
  const { action } = await params;
  const handler = HANDLERS[action];
  if (!handler) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  try {
    return NextResponse.json(await handler(body || {}));
  } catch (err) {
    if (err instanceof GameError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("[rarelist]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
