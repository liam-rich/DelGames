import { NextResponse } from "next/server";
import { getEngine } from "../../../../../lib/engines";
import { getRoom, updateRoom, claimSeat, publicRoom } from "../../../../../lib/rooms";
import { kvConfigured, describeKvError } from "../../../../../lib/kv";

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

  let room;
  try {
    room = await getRoom(gameSlug, code);
  } catch (err) {
    console.error("[rooms] read failed:", err);
    return NextResponse.json({ error: describeKvError(err) }, { status: 503 });
  }
  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }
  return NextResponse.json(publicRoom(code, room));
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
    if (action?.type === "CLAIM_SEAT") {
      return NextResponse.json(await claimSeat(gameSlug, code, action.seat, action.device, Boolean(action.force)));
    }
    const room = await updateRoom(gameSlug, code, (state) => engine.applyAction(state, action));
    return NextResponse.json(room);
  } catch (err) {
    // Game-rule rejections carry their own message; store failures don't.
    if (err.status || !/fetch failed|ENOTFOUND|ECONN|ETIMEDOUT|unauthori|WRONGPASS|NOAUTH/i.test(String(err.message))) {
      return NextResponse.json({ error: err.message || "Action rejected." }, { status: err.status || 400 });
    }
    console.error("[rooms] action failed:", err);
    return NextResponse.json({ error: describeKvError(err) }, { status: 503 });
  }
}
