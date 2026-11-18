"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconArrowRight,
  IconDice,
  IconCopy,
  IconSmartphone,
  IconUser,
  IconWifi,
  IconX,
} from "../icons";
import { useRoom, createRoomRequest } from "../../lib/useRoom";

function deviceId() {
  try {
    let id = window.localStorage.getItem("delgames:device");
    if (!id || !/^[a-z0-9]{8,40}$/i.test(id)) {
      const bytes = new Uint8Array(12);
      window.crypto.getRandomValues(bytes);
      id = Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 20);
      window.localStorage.setItem("delgames:device", id);
    }
    return id;
  } catch {
    return "anon" + Math.random().toString(36).slice(2, 12);
  }
}

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
export default function RoomConnect({ gameSlug, children, onBack }) {
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

  const [taken, setTaken] = useState(null); // seat someone else holds

  async function chooseSeat(s, force = false) {
    setBusy(true);
    setLocalError("");
    try {
      const res = await fetch(`/api/rooms/${gameSlug}/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "CLAIM_SEAT", seat: s, device: deviceId(), force }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setTaken(s);
        setLocalError(json.error || "That seat is taken.");
        return;
      }
      if (!res.ok) throw new Error(json.error || "Couldn't take that seat.");
      setTaken(null);
      setSeat(s);
      saveSession(gameSlug, { code, seat: s });
      setStage("connected");
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setBusy(false);
    }
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

  // Before a room is joined there's no game screen yet, so give these steps
  // the standard header and a way back to the mode list.
  const shell = (content) => (
    <>
      <nav className="top-nav">
        <Link href="/" className="brand">
          <span className="brand-badge">
            <IconDice size={20} strokeWidth={2.2} />
          </span>
          DelGames
        </Link>
        {onBack && (
          <button className="pill" onClick={onBack} style={{ cursor: "pointer" }}>
            <IconSmartphone size={13} strokeWidth={2.4} />
            Change mode
          </button>
        )}
      </nav>
      <main className="page" style={{ maxWidth: 560 }}>
        {content}
      </main>
    </>
  );

  if (stage === "choice") {
    return shell(
      <div className="block room-card">
        <div className="room-head">
          <IconWifi size={18} strokeWidth={2.4} />
          Two phones
        </div>
        <p className="room-lead">
          One of you creates a room and shares the code. Each phone only shows what that player is meant to see.
        </p>
        {localError && <ErrorBanner>{localError}</ErrorBanner>}
        <button className="block-btn blue" onClick={handleCreate} disabled={busy}>
          {busy ? "Creating…" : "Create a room"}
          <IconArrowRight size={16} strokeWidth={2.4} />
        </button>
        <div className="room-or">or join one</div>
        <form onSubmit={handleJoin} className="room-join">
          <input
            className="block-input room-code-input"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
            placeholder="CODE"
            maxLength={6}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Room code"
          />
          <button type="submit" className="block-btn secondary" disabled={busy || joinInput.length < 4}>
            Join
          </button>
        </form>
      </div>
    );
  }

  if (stage === "seat-select") {
    const seats = room.data?.seats || {};
    return shell(
      <div className="block room-card">
        <div className="room-head">
          <IconSmartphone size={18} strokeWidth={2.4} />
          Room code
        </div>
        <RoomCodeDisplay code={code} />
        <p className="room-lead">Share the code, then each of you picks who you are.</p>
        {localError && <ErrorBanner>{localError}</ErrorBanner>}
        <div className="room-seats">
          {["p1", "p2"].map((s) => (
            <button
              key={s}
              className={`block-btn ${s === "p1" ? "blue" : "pink"}`}
              onClick={() => chooseSeat(s)}
              disabled={busy}
            >
              <IconUser size={16} strokeWidth={2.4} />
              {s === "p1" ? "Player 1" : "Player 2"}
              {seats[s] && <small className="room-taken">taken</small>}
            </button>
          ))}
        </div>
        {taken && (
          <button className="block-btn secondary" onClick={() => chooseSeat(taken, true)} disabled={busy}>
            It&apos;s me on a new phone — take over {taken === "p1" ? "Player 1" : "Player 2"}
          </button>
        )}
        <button className="block-btn secondary" onClick={leaveRoom}>
          <IconX size={14} strokeWidth={2.6} />
          Back
        </button>
      </div>
    );
  }

  // connected
  if (!room.connected && !room.data) {
    return shell(
      <div className="block room-card">
        <p className="room-head">Connecting to room {code}…</p>
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
    <button onClick={copy} className="room-code" aria-label={`Room code ${code}, tap to copy`}>
      <span className="tile-row">
        {code.split("").map((ch, i) => (
          <span key={i} className="tile" style={{ "--i": i, background: "var(--ink-ochre)" }}>
            {ch}
          </span>
        ))}
      </span>
      <span className="room-copy">
        <IconCopy size={13} strokeWidth={2.4} /> {copied ? "Copied!" : "Tap to copy"}
      </span>
    </button>
  );
}

export function ErrorBanner({ children }) {
  return (
    <p
      style={{
        color: "var(--ink-dark)",
        background: "var(--yellow)",
        padding: "0.5rem 0.8rem",
        borderRadius: 0,
        fontWeight: 700,
        border: "var(--border-w) solid var(--frame)",
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
      <span className="room-wait-icon">
        <IconWifi size={22} strokeWidth={2.2} />
      </span>
      <p className="room-wait-text">{children}</p>
    </div>
  );
}
