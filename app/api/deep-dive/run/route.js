import { NextResponse } from "next/server";
import { pickPrompts, PROMPTS_PER_RUN, SECONDS_PER_PROMPT } from "../../../../lib/deepDive/scoring";

export const dynamic = "force-dynamic";

// Starts a run. Only prompt ids and text go to the client — never the answers.
export async function POST() {
  const prompts = pickPrompts(PROMPTS_PER_RUN).map((p) => ({ id: p.id, text: p.text }));
  return NextResponse.json({ prompts, seconds: SECONDS_PER_PROMPT });
}
