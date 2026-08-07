"use client";

import { useEffect, useState } from "react";
import {
  IconArrowRight,
  IconCopy,
  IconSmartphone,
  IconUser,
  IconWifi,
  IconX,
} from "../icons";
import { useRoom, createRoomRequest } from "../../lib/useRoom";

function storageKey(gameSlug) {
  return `delgames:online:${gameSlug}`;
}

function loadSaved(gameSlug) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(gameSlug));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(gameSlug, session) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      window.localStorage.setItem(storageKey(gameSlug), JSON.stringify(session));
    } else {
      window.localStorage.removeItem(storageKey(gameSlug));
    }
  } catch {
    // ignore storage errors (private browsing etc.)
  }
}

// Handles the "connect two phones to the same room" flow: create or join by
// code, pick a seat, then hands off to `children` as a render-prop once
// connected. Remembers the session in localStorage so a phone can refresh
// without losing its seat.
export default function RoomConnect({ gameSlug, children }) {
  const [stage, setStage] = useState("loading"); // loading -> choice -> create-wait -> join-form -> seat-select -> connected
  const [code, setCode] = useState(null);
  const [seat, setSeat] = useState(null);
  const [joinInput, setJoinInput] = useState("");
  const [localError, setLocalError] = useState("");
  const [busy, setBusy] = useState(false);

  const room = useRoom(gameSlug, code);

  useEffect(() => {
    const saved = loadSaved(gameSlug);
    if (saved?.code && saved?.seat) {
      setCode(saved.code);
      setSeat(saved.seat);
      setStage("connected");
    } else {
      setStage("choice");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSlug]);

  async function handleCreate() {
    setBusy(true);
    setLocalError("");
    try {
      const room = await createRoomRequest(gameSlug);
      setCode(room.code);
      setStage("seat-select");
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    const clean = joinInput.trim().toUpperCase();
    if (!clean) {
      setLocalError("Enter a room code.");
      return;
    }
    setBusy(true);
    setLocalError("");
    try {
      const res = await fetch(`/api/rooms/${gameSlug}/${clean}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Room not found.");
      }
      setCode(clean);
      setStage("seat-select");
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function chooseSeat(s) {
    setSeat(s);
    saveSession(gameSlug, { code, seat: s });
    setStage("connected");
  }

  function leaveRoom() {
    saveSession(gameSlug, null);
    setCode(null);
    setSeat(null);
    setJoinInput("");
    setLocalError("");
    setStage("choice");
  }

  if (stage === "loading") return null;

  if (stage === "choice") {
    return (
      <div className="block" style={{ padding: "1.6rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
          <IconWifi size={18} strokeWidth={2.4} />
          Play on two phones
        </div>
        <p style={{ opacity: 0.75, fontSize: "0.9rem" }}>
          One of you creates a room and shares the code; the other joins with
          it. Each phone only ever shows what that seat is meant to see.
        </p>
        {localError && <ErrorBanner>{localError}</ErrorBanner>}
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          <button className="block-btn blue" onClick={handleCreate} disabled={busy}>
            Create a room
          </button>
        </div>
        <form onSubmit={handleJoin} style={{ display: "flex", gap: "0.6rem" }}>
          <input
            className="block-input"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
            placeholder="Have a code? Enter it"
            maxLength={6}
            autoComplete="off"
          />
          <button type="submit" className="block-btn secondary" disabled={busy}>
            Join
          </button>
        </form>
      </div>
    );
  }

  if (stage === "seat-select") {
    return (
      <div className="block" style={{ padding: "1.6rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "1.1rem", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
          <IconSmartphone size={18} strokeWidth={2.4} />
          Room code
        </div>
        <RoomCodeDisplay code={code} />
        <p style={{ opacity: 0.75, fontSize: "0.9rem" }}>
          Share that code with the other player, then each of you pick who you are:
        </p>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
          <button className="block-btn blue" onClick={() => chooseSeat("p1")}>
            <IconUser size={16} strokeWidth={2.4} style={{ marginRight: "0.4rem", verticalAlign: "-3px" }} />
            I'm Player 1
          </button>
          <button className="block-btn pink" onClick={() => chooseSeat("p2")}>
            <IconUser size={16} strokeWidth={2.4} style={{ marginRight: "0.4rem", verticalAlign: "-3px" }} />
            I'm Player 2
          </button>
        </div>
        <button className="block-btn secondary" onClick={leaveRoom} style={{ fontSize: "0.85rem" }}>
          <IconX size={14} strokeWidth={2.6} style={{ marginRight: "0.3rem", verticalAlign: "-2px" }} />
          Back
        </button>
      </div>
    );
  }

  // connected
  if (!room.connected && !room.data) {
    return (
      <div className="block" style={{ padding: "1.6rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        <p>Connecting to room {code}…</p>
        {room.error && <ErrorBanner>{room.error}</ErrorBanner>}
        <button className="block-btn secondary" onClick={leaveRoom} style={{ alignSelf: "flex-start" }}>
          Leave
        </button>
      </div>
    );
  }

  return children({
    code,
    seat,
    state: room.data?.state,
    dispatch: room.dispatch,
    error: room.error,
    connected: room.connected,
    leaveRoom,
  });
}

function RoomCodeDisplay({ code }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  }
  return (
    <button
      onClick={copy}
      className="pill"
      style={{
        background: "var(--yellow)",
        fontSize: "1.6rem",
        fontWeight: 800,
        letterSpacing: "0.15em",
        padding: "0.6rem 1.2rem",
        border: "var(--border-w) solid var(--ink)",
        cursor: "pointer",
      }}
    >
      {code}
      <IconCopy size={16} strokeWidth={2.4} />
      {copied && <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>Copied!</span>}
    </button>
  );
}

export function ErrorBanner({ children }) {
  return (
    <p
      style={{
        color: "var(--ink)",
        background: "var(--yellow)",
        padding: "0.5rem 0.8rem",
        borderRadius: 10,
        fontWeight: 700,
        border: "var(--border-w) solid var(--ink)",
        fontSize: "0.85rem",
      }}
    >
      {children}
    </p>
  );
}

export function WaitingBanner({ children }) {
  return (
    <div
      className="block"
      style={{
        padding: "2rem",
        textAlign: "center",
        color: "var(--ink)",
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
        alignItems: "center",
      }}
    >
      <IconWifi size={22} strokeWidth={2.2} />
      <p style={{ fontWeight: 700 }}>{children}</p>
    </div>
  );
}
