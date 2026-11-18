import { Redis } from "@upstash/redis";

// Resolves against whichever env vars are present — works with Vercel KV
// (KV_REST_API_URL / KV_REST_API_TOKEN) or a direct Upstash Redis
// integration (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
// Values pasted into a dashboard often pick up stray whitespace, quotes, or
// lose their scheme; any of those makes every request fail with a bare
// "fetch failed". Normalise them before use.
function clean(v) {
  return (v || "").trim().replace(/^["']|["']$/g, "").trim();
}
function cleanUrl(v) {
  const u = clean(v).replace(/\/+$/, "");
  if (!u) return "";
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}
// Vercel's storage integration names its variables after whatever prefix was
// chosen when the database was connected (KV_, STORAGE_, anything), so look
// for the shape rather than one exact name.
function resolveCreds(env = process.env) {
  const pairs = [
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ];
  for (const key of Object.keys(env).sort()) {
    const m = key.match(/^(.+)_REST_API_URL$/);
    if (m && !pairs.some(([u]) => u === key)) pairs.push([key, `${m[1]}_REST_API_TOKEN`]);
  }
  for (const [u, t] of pairs) {
    if (clean(env[u]) && clean(env[t])) return { url: cleanUrl(env[u]), token: clean(env[t]), source: `${u} + ${t}` };
  }
  // Last resort: a redis connection string (REDIS_URL, STORAGE_URL, KV_URL…).
  // Upstash serves REST on the same host, and the password is the REST token.
  for (const key of Object.keys(env).sort()) {
    if (!/(^|_)URL$/.test(key)) continue;
    const v = clean(env[key]);
    if (!/^rediss?:\/\//i.test(v)) continue;
    try {
      const parsed = new URL(v);
      if (parsed.password && /upstash\.io$/i.test(parsed.hostname)) {
        return { url: `https://${parsed.hostname}`, token: decodeURIComponent(parsed.password), source: key };
      }
    } catch {
      // not a usable URL
    }
  }
  return { url: "", token: "", source: null };
}

const creds = resolveCreds();
const url = creds.url;
const token = creds.token;
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

export function hasKvCreds() {
  return hasRealCreds;
}

// Which variables the connection came from (names only, never values).
export function kvSource() {
  return creds.source;
}

// For diagnostics: which store we'd talk to (host only — never the token).
export function kvHost() {
  try {
    return url ? new URL(url).host : null;
  } catch {
    return "invalid URL";
  }
}

// Turns low-level store failures into something a player can act on.
export function describeKvError(err) {
  const msg = String(err?.message || err || "");
  if (/fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|getaddrinfo|network/i.test(msg)) {
    return "Online play can't reach its database right now. If this keeps happening, the Upstash/KV database for this site may be missing or its connection settings on Vercel may be wrong.";
  }
  if (/unauthori[sz]ed|WRONGPASS|NOAUTH|401|403/i.test(msg)) {
    return "Online play's database rejected the connection — the KV/Upstash token on Vercel looks wrong.";
  }
  return msg || "Something went wrong with online play.";
}
