"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import RoomConnect, { WaitingBanner } from "../components/RoomConnect";
import { ChangeModeLink } from "../components/PlayModeSelect";
import { IconDice, IconClock, IconCheck, IconX } from "../icons";
import DepthGauge, { Bubbles } from "./DepthGauge";
import Scoreboard, { PLAYER_INK, playerName } from "./Scoreboard";
import { Results } from "./Screens";
import { descentFraction, formatDepth } from "./zones";
import { hasPack, scoreLocally } from "./localScore";

const METRES_PER_POINT = 10;

export default function DeepDiveOnline({ onChangeMode }) {
  return (
    <RoomConnect onBack={onChangeMode} gameSlug="deep-dive">
      {({ code, seat, state, dispatch }) => (
        <Inner code={code} seat={seat} state={state} dispatch={dispatch} onChangeMode={onChangeMode} />
      )}
    </RoomConnect>
  );
}

function Inner({ code, seat, state, dispatch, onChangeMode }) {
  const [guess, setGuess] = useState("");
  const [busy, setBusy] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [rejection, setRejection] = useState(null); // word tried that isn't in the bank
  const inputRef = useRef(null);
  const guessRef = useRef("");
  const sentRef = useRef(false);
  // The room's prompts with their answer lists, for instant local checks.
  const [packs, setPacks] = useState({});
  const promptIds = state?.prompts?.map((p) => p.id).join(",") || "";

  useEffect(() => {
    if (!promptIds) return;
    let cancelled = false;
    fetch("/api/deep-dive/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: promptIds.split(",") }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setPacks(Object.fromEntries((d.prompts || []).map((p) => [p.id, p])));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [promptIds]);

  const other = seat === "p1" ? "p2" : "p1";
  const index = state?.index ?? 0;
  const phase = state?.phase;
  const iAnswered = Boolean(state && state.answers[seat].length > index);

  useEffect(() => {
    guessRef.current = guess;
  }, [guess]);

  // One countdown per prompt. Running out submits whatever is half-typed.
  useEffect(() => {
    if (phase !== "playing" || iAnswered || !state) return undefined;
    setTimeLeft(state.seconds);
    sentRef.current = false;
    setRejection(null);
    const startedAt = Date.now();
    const id = setInterval(() => {
      const left = state.seconds - (Date.now() - startedAt) / 1000;
      if (left <= 0) {
        clearInterval(id);
        setTimeLeft(0);
        // Out of time — whatever is in the box goes in, valid or not.
        send(guessRef.current, { force: true });
      } else {
        setTimeLeft(left);
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, iAnswered]);

  useEffect(() => {
    if (phase === "playing" && !iAnswered) inputRef.current?.focus();
  }, [phase, index, iAnswered]);

  // A word that isn't in the bank costs seconds, not the prompt. It's checked
  // as a preview first so a rejected try neither commits nor counts toward the
  // live answer stats; the engine does the authoritative scoring on commit.
  async function send(answer, { force = false } = {}) {
    if (sentRef.current) return;
    setBusy(true);
    try {
      if (!force) {
        const pack = packs[state.prompts[index].id];
        const data = hasPack(pack)
          ? scoreLocally(pack, answer)
          : await (
              await fetch("/api/deep-dive/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promptId: state.prompts[index].id, answer, preview: true }),
              })
            ).json();
        if (!data.valid) {
          setRejection({ text: answer, suggestion: data.suggestion || null });
          inputRef.current?.select();
          return;
        }
      }
      sentRef.current = true;
      await dispatch({ type: "SUBMIT_ANSWER", seat, answer });
      setGuess("");
      setRejection(null);
    } catch {
      sentRef.current = false;
    } finally {
      setBusy(false);
    }
  }

  async function act(type) {
    setBusy(true);
    try {
      await dispatch({ type, seat });
    } catch {
      // surfaced by the room error banner
    } finally {
      setBusy(false);
    }
  }

  if (!state) return <WaitingBanner>Connecting…</WaitingBanner>;

  const myDepth = state.scores[seat] * METRES_PER_POINT;
  const deepest = Math.max(state.scores.p1, state.scores.p2) * METRES_PER_POINT;
  const fraction = descentFraction(deepest);
  const mine = state.answers[seat][index];
  const theirs = state.answers[other][index];

  return (
    <div
      className={`dd-shell pack-${state.pack || "general"}`}
      style={{
        "--dd-t": fraction.toFixed(3),
        "--dd-fg": "var(--ink)",
      }}
    >
      <Bubbles />

      <nav className="top-nav">
        <Link href="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="brand-badge">
            <IconDice size={19} strokeWidth={2.2} />
          </span>
          DelGames
        </Link>
        <div style={{ display: "flex", gap: "var(--s2)", flexWrap: "wrap" }}>
          <span className="dd-pill">Room {code} · you are {playerName(seat)}</span>
          <ChangeModeLink onClick={onChangeMode} label="Leave" />
        </div>
      </nav>

      <main className="dd-stage">
        <div className="dd-layout">
          <DepthGauge
            divers={[
              { key: "p1", depth: state.scores.p1 * METRES_PER_POINT, ink: PLAYER_INK.p1, textInk: "var(--ink-dark)", label: "1" },
              { key: "p2", depth: state.scores.p2 * METRES_PER_POINT, ink: PLAYER_INK.p2, textInk: "var(--ink-dark)", label: "2" },
            ]}
          />

          <div style={{ display: "grid", gap: "var(--s4)" }}>
            <Scoreboard scores={state.scores} seat={seat} index={index} total={state.prompts.length} />

            {phase === "playing" && !iAnswered && (
              <form
                className="dd-panel dd-pop"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!busy) send(guess);
                }}
                style={{ padding: "var(--s5)", display: "grid", gap: "var(--s4)" }}
              >
                <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "var(--s2)" }}>
                  <IconClock size={14} strokeWidth={2.4} />
                  {Math.ceil(timeLeft)}s
                </div>
                <div className="dd-timer">
                  <div
                    className={`dd-timer-fill ${timeLeft / state.seconds < 0.2 ? "danger" : timeLeft / state.seconds < 0.45 ? "warn" : ""}`}
                    style={{ width: `${(timeLeft / state.seconds) * 100}%` }}
                  />
                </div>
                <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.1rem)" }}>{state.prompts[index]?.text}</h2>
                <input
                  ref={inputRef}
                  className="dd-input"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Type one answer..."
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={40}
                />
                {rejection && (
                  <div
                    style={{
                      borderLeft: "4px solid var(--ink-pink)",
                      paddingLeft: "var(--s3)",
                      display: "grid",
                      gap: "var(--s2)",
                      justifyItems: "start",
                    }}
                  >
                    <p style={{ fontSize: "0.9rem" }}>
                      <strong style={{ textTransform: "capitalize" }}>{rejection.text}</strong>
                      {" isn't in the bank for this one. Keep going — you've still got time."}
                    </p>
                    {rejection.suggestion && (
                      <button
                        type="button"
                        className="dd-btn"
                        style={{ padding: "var(--s2) var(--s4)", fontSize: "0.85rem" }}
                        onClick={() => send(rejection.suggestion, { force: true })}
                        disabled={busy}
                      >
                        Did you mean{" "}
                        <span style={{ textTransform: "capitalize" }}>{rejection.suggestion}</span>?
                      </button>
                    )}
                  </div>
                )}

                <button type="submit" className="dd-btn" disabled={busy || !guess.trim()}>
                  Lock it in
                </button>
              </form>
            )}

            {phase === "playing" && iAnswered && (
              <div className="dd-panel" style={{ padding: "var(--s5)", display: "grid", gap: "var(--s3)" }}>
                <p className="eyebrow">{state.prompts[index]?.text}</p>
                <h2 style={{ fontSize: "1.3rem", textTransform: "capitalize" }}>{mine?.given || "No answer"}</h2>
                <p style={{ opacity: 0.75 }}>
                  Locked in. Waiting for {playerName(other)} to answer — scores stay hidden until you&apos;ve both
                  committed.
                </p>
              </div>
            )}

            {phase === "reveal" && (
              <RoundReveal
                mine={mine}
                theirs={theirs}
                seat={seat}
                other={other}
                ready={state.ready}
                busy={busy}
                onReady={() => act("READY")}
                onAcceptSuggestion={() => act("ACCEPT_SUGGESTION")}
              />
            )}

            {phase === "done" && (
              <Results
                results={state.answers[seat]}
                points={state.scores[seat]}
                depth={myDepth}
                opponent={{ name: playerName(other), points: state.scores[other] }}
                onReplay={() => act("PLAY_AGAIN")}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function RoundReveal({ mine, theirs, seat, other, ready, busy, onReady, onAcceptSuggestion }) {
  const waiting = ready[seat] && !ready[other];

  return (
    <div className="dd-panel dd-pop" style={{ padding: "var(--s5)", display: "grid", gap: "var(--s4)" }}>
      <p className="eyebrow">{mine?.promptText}</p>

      <div style={{ display: "grid", gap: "var(--s3)" }}>
        <AnswerLine entry={mine} who={`${playerName(seat)} (you)`} ink={PLAYER_INK[seat]} />
        <AnswerLine entry={theirs} who={playerName(other)} ink={PLAYER_INK[other]} />
      </div>

      {mine?.suggestion && !ready[seat] && (
        <button className="dd-btn" onClick={onAcceptSuggestion} disabled={busy}>
          Did you mean <span style={{ textTransform: "capitalize" }}>{mine.suggestion}</span>?
        </button>
      )}

      {waiting ? (
        <WaitingBanner>Waiting for {playerName(other)} to be ready…</WaitingBanner>
      ) : (
        <button className="dd-btn" onClick={onReady} disabled={busy || ready[seat]}>
          {ready[seat] ? "Ready — waiting" : "I'm ready"}
        </button>
      )}
    </div>
  );
}

function AnswerLine({ entry, who, ink }) {
  if (!entry) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--s3)" }}>
      <span
        style={{
          width: "2.1rem",
          height: "2.1rem",
          borderRadius: "50%",
          border: "var(--border-w) solid var(--frame)",
          background: entry.valid ? ink : "var(--stock)",
          color: entry.valid ? "var(--ink-dark)" : "var(--ink)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {entry.valid ? <IconCheck size={15} strokeWidth={3} /> : <IconX size={15} strokeWidth={3} />}
      </span>
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div className="eyebrow" style={{ opacity: 0.55 }}>{who}</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "capitalize" }}>
          {entry.given?.trim() || "No answer"}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div className="mono" style={{ fontSize: "1.3rem", fontWeight: 500 }}>+{entry.points}</div>
        <div className="eyebrow" style={{ opacity: 0.55 }}>{formatDepth(entry.points * METRES_PER_POINT)}</div>
      </div>
    </div>
  );
}
