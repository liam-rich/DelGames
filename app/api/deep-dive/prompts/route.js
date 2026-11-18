import { NextResponse } from "next/server";
import { promptPacks } from "../../../../lib/deepDive/pack";

export const dynamic = "force-dynamic";

// Answer lists for an online room's prompts, so each phone can check words
// locally before committing them to the room.
export async function POST(request) {
  let ids = [];
  try {
    const body = await request.json();
    if (Array.isArray(body?.ids)) ids = body.ids.map(String);
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  return NextResponse.json({ prompts: await promptPacks(ids) });
}
