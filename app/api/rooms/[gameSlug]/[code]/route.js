import { NextResponse } from "next/server";
import { getEngine } from "../../../../../lib/engines";
import { getRoom, updateRoom } from "../../../../../lib/rooms";
import { kvConfigured } from "../../../../../lib/kv";

export async function GET(request, { params }) {
  const { gameSlug, code } = await params;

  if (!kvConfigured()) {
    return NextResponse.json(
      { error: "Online play isn't set up yet — no KV store is configured for this deployment." },
      { status: 503 }
    );
  }

  try {
    getEngine(gameSlug);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }

  const room = await getRoom(gameSlug, code);
  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }
  return NextResponse.json({ code: code.toUpperCase(), ...room });
}

export async function POST(request, { params }) {
  const { gameSlug, code } = await params;

  if (!kvConfigured()) {
    return NextResponse.json(
      { error: "Online play isn't set up yet — no KV store is configured for this deployment." },
      { status: 503 }
    );
  }

  let engine;
  try {
    engine = getEngine(gameSlug);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }

  let action;
  try {
    action = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const room = await updateRoom(gameSlug, code, (state) => engine.applyAction(state, action));
    return NextResponse.json(room);
  } catch (err) {
    const status = err.status || 400;
    return NextResponse.json({ error: err.message || "Action rejected." }, { status });
  }
}
