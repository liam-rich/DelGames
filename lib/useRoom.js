"use client";

import { useEffect, useRef, useState } from "react";

const POLL_MS = 1500;

// Polls a room's state and exposes a dispatch() for posting actions.
// `code` may be null/empty until the caller has created or joined a room.
export function useRoom(gameSlug, code) {
  const [data, setData] = useState(null); // { code, version, state }
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const versionRef = useRef(0);

  useEffect(() => {
    if (!code) return undefined;
    let cancelled = false;
    let timer = null;

    async function poll() {
      try {
        const res = await fetch(`/api/rooms/${gameSlug}/${code}`, { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error || "Room not found.");
          setConnected(false);
        } else {
          setError(null);
          setConnected(true);
          if (json.version !== versionRef.current) {
            versionRef.current = json.version;
            setData(json);
          }
        }
      } catch {
        if (!cancelled) {
          setError("Connection lost — retrying…");
          setConnected(false);
        }
      } finally {
        if (!cancelled) timer = setTimeout(poll, POLL_MS);
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [gameSlug, code]);

  async function dispatch(action) {
    const res = await fetch(`/api/rooms/${gameSlug}/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = json.error || "That didn't work — try again.";
      setError(message);
      throw new Error(message);
    }
    setError(null);
    versionRef.current = json.version;
    setData(json);
    return json;
  }

  return { data, error, connected, dispatch, setError };
}

export async function createRoomRequest(gameSlug) {
  const res = await fetch(`/api/rooms/${gameSlug}`, { method: "POST" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Could not create a room.");
  return json;
}
