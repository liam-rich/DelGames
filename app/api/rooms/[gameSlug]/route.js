import { NextResponse } from "next/server";
import { getEngine } from "../../../../lib/engines";
import { createRoom } from "../../../../lib/rooms";
import { kvConfigured } from "../../../../lib/kv";

export async function POST(request, { params }) {
  const { gameSlug } = await params;

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

  // Optional creation options — Deep Dive uses this to pick a themed pack.
  // Engines that don't take options simply ignore it.
  let options = {};
  try {
    options = (await request.json()) || {};
  } catch {
    // No body is fine.
  }

  try {
    const room = await createRoom(gameSlug, engine.createInitialState(options));
    return NextResponse.json(room);
  } catch (err) {
    return NextResponse.json({ error: err.message || "Could not create room." }, { status: 500 });
  }
}
