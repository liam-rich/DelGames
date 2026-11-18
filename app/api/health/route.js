import { NextResponse } from "next/server";
import { getKv, kvConfigured, kvHost, describeKvError } from "../../../lib/kv";

export const dynamic = "force-dynamic";

// Open /api/health on a deployment to check online play's database: whether
// it's configured, which host it points at, and whether a round trip works.
// Never reveals the token.
export async function GET() {
  const out = {
    configured: kvConfigured(),
    host: kvHost(),
    envVars: {
      KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
      KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
      UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
      UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    },
    reachable: false,
  };
  if (!out.configured) {
    out.problem = "No database env vars are set for this deployment, so online play is off.";
    return NextResponse.json(out, { status: 503 });
  }
  const started = Date.now();
  try {
    const kv = getKv();
    await kv.set("health:ping", String(started), { ex: 60 });
    const back = await kv.get("health:ping");
    out.reachable = String(back) === String(started);
    out.latencyMs = Date.now() - started;
    if (!out.reachable) out.problem = "Connected, but a test value didn't read back.";
  } catch (err) {
    out.problem = describeKvError(err);
    out.rawError = String(err?.message || err).slice(0, 200);
  }
  return NextResponse.json(out, { status: out.reachable ? 200 : 503 });
}
