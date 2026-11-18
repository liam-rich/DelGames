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
// message is surfaced to the caller and nothing is written. It may also be
// async: Deep Dive scores answers against the bank inside the action.
export async function updateRoom(gameSlug, code, mutate) {
  const kv = getKv();
  const key = roomKey(gameSlug, code);
  const record = await kv.get(key);
  if (!record) {
    const err = new Error("Room not found.");
    err.status = 404;
    throw err;
  }
  const nextState = await mutate(record.state);
  const nextVersion = (record.version || 1) + 1;
  const next = { ...record, version: nextVersion, state: nextState };
  await kv.set(key, next, { ex: ROOM_TTL_SECONDS });
  return publicRoom(code, next);
}

// Seats belong to the device that claimed them, so two phones can't both play
// as Player 1. `force` lets a player who switched phones take their seat back.
export async function claimSeat(gameSlug, code, seat, device, force = false) {
  if (!["p1", "p2"].includes(seat)) throw Object.assign(new Error("Unknown seat."), { status: 400 });
  if (!/^[a-z0-9]{8,40}$/i.test(String(device || ""))) throw Object.assign(new Error("Bad device."), { status: 400 });
  const kv = getKv();
  const key = roomKey(gameSlug, code);
  const record = await kv.get(key);
  if (!record) throw Object.assign(new Error("Room not found."), { status: 404 });
  const seats = record.seats || {};
  const holder = seats[seat];
  if (holder && holder !== device && !force) {
    throw Object.assign(new Error(`${seat === "p1" ? "Player 1" : "Player 2"} is already taken.`), { status: 409 });
  }
  // A device holds at most one seat.
  const nextSeats = { ...seats, [seat]: device };
  const otherSeat = seat === "p1" ? "p2" : "p1";
  if (nextSeats[otherSeat] === device) delete nextSeats[otherSeat];
  const next = { ...record, seats: nextSeats };
  await kv.set(key, next, { ex: ROOM_TTL_SECONDS });
  return publicRoom(code, next);
}

// What clients see: which seats are filled, never who holds them.
export function publicRoom(code, record) {
  const seats = record.seats || {};
  return {
    code: code.toUpperCase(),
    version: record.version,
    state: record.state,
    seats: { p1: Boolean(seats.p1), p2: Boolean(seats.p2) },
  };
}
