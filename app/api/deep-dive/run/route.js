import { NextResponse } from "next/server";
import { pickPrompts, PROMPTS_PER_RUN, SECONDS_PER_PROMPT } from "../../../../lib/deepDive/scoring";
import { promptPacks } from "../../../../lib/deepDive/pack";

export const dynamic = "force-dynamic";

// Starts a run. The seven prompts come with their answer lists so the device
// can score each answer instantly — a 25-second clock can't wait on the
// network. Like Wordle, the answers are on the device for this run only.
export async function POST(request) {
  let pack = "general";
  try {
    const body = await request.json();
    if (typeof body?.pack === "string") pack = body.pack;
  } catch {
    // No body is fine — that's a general run.
  }

  const ids = pickPrompts(PROMPTS_PER_RUN, pack).map((p) => p.id);
  const prompts = await promptPacks(ids);
  return NextResponse.json({ prompts, seconds: SECONDS_PER_PROMPT, pack });
}
