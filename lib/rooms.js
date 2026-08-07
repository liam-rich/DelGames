import { getKv, ROOM_TTL_SECONDS } from "./kv";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — easier to read aloud

function randomCode(length = 4) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return out;
}

function roomKey(gameSlug, code) {
  return `room:${gameSlug}:${code.toUpperCase()}`;
}

// Creates a room with a fresh, unused code for the given game and stores the
// initial state. Retries a handful of times on the (very unlikely) chance of
// a collision.
export async function createRoom(gameSlug, initialState) {
  const kv = getKv();
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = randomCode();
    const key = roomKey(gameSlug, code);
    // NX = only set if it doesn't already exist.
    const ok = await kv.set(key, { version: 1, state: initialState }, { nx: true, ex: ROOM_TTL_SECONDS });
    if (ok) {
      return { code, version: 1, state: initialState };
    }
  }
  throw new Error("Could not allocate a room code, please try again.");
}

export async function getRoom(gameSlug, code) {
  const kv = getKv();
  const record = await kv.get(roomKey(gameSlug, code));
  if (!record) return null;
  return record;
}

// Applies `mutate(state) -> nextState` and persists the result. `mutate` may
// throw to reject an invalid action (e.g. acting out of turn) — the error
// message is surfaced to the caller and nothing is written.
export async function updateRoom(gameSlug, code, mutate) {
  const kv = getKv();
  const key = roomKey(gameSlug, code);
  const record = await kv.get(key);
  if (!record) {
    const err = new Error("Room not found.");
    err.status = 404;
    throw err;
  }
  const nextState = mutate(record.state);
  const nextVersion = (record.version || 1) + 1;
  await kv.set(key, { version: nextVersion, state: nextState }, { ex: ROOM_TTL_SECONDS });
  return { code, version: nextVersion, state: nextState };
}
