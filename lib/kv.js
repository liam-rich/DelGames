import { Redis } from "@upstash/redis";

// Resolves against whichever env vars are present — works with Vercel KV
// (KV_REST_API_URL / KV_REST_API_TOKEN) or a direct Upstash Redis
// integration (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRealCreds = Boolean(url && token);

// In local development only, fall back to an in-memory store so two-phone
// mode can be tried out on your home network before any cloud KV is set up.
// This never activates in production — Vercel's serverless functions don't
// share memory across invocations, so this would silently break there.
const useDevFallback = !hasRealCreds && process.env.NODE_ENV !== "production";

let client = null;
let devStore = null;

function createDevStore() {
  const map = new Map();
  return {
    async get(key) {
      const entry = map.get(key);
      if (!entry) return null;
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        map.delete(key);
        return null;
      }
      return entry.value;
    },
    async set(key, value, opts = {}) {
      if (opts.nx && map.has(key)) return null;
      const expiresAt = opts.ex ? Date.now() + opts.ex * 1000 : null;
      map.set(key, { value, expiresAt });
      return "OK";
    },
  };
}

export function getKv() {
  if (useDevFallback) {
    if (!devStore) {
      devStore = createDevStore();
      console.warn(
        "[DelGames] No KV store configured — using an in-memory store for local development only. " +
          "This will NOT work once deployed; add Vercel KV (or Upstash Redis) before shipping online play."
      );
    }
    return devStore;
  }
  if (!hasRealCreds) {
    throw new Error(
      "Online play isn't set up on this deployment yet — add Vercel KV (or Upstash Redis) to the project and redeploy."
    );
  }
  if (!client) {
    client = new Redis({ url, token });
  }
  return client;
}

export function kvConfigured() {
  return hasRealCreds || useDevFallback;
}

// Rooms expire after a day of inactivity so the free-tier store doesn't fill up.
export const ROOM_TTL_SECONDS = 60 * 60 * 24;
