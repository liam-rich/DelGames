"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconDice, IconClock, IconUser } from "../icons";
import { ChangeModeLink } from "../components/PlayModeSelect";
import DepthGauge, { Bubbles } from "./DepthGauge";
import Scoreboard, { PLAYER_INK, playerName } from "./Scoreboard";
import { Intro, Reveal, Results } from "./Screens";
import { descentFraction, formatDepth } from "./zones";
import { hasPack, scoreLocally, recordInBackground } from "./localScore";

const METRES_PER_POINT = 10;

// Handles both the solo run and two-player pass-and-play on one device. In
// pass-and-play each prompt goes round the players in turn, behind a hand-off
// screen so nobody sees the other's answer before committing their own.
export default function DeepDiveGame({ mode = "solo", onChangeMode }) {
  const seats = mode === "pass-and-play" ? ["p1", "p2"] : ["p1"];
  const twoPlayer = seats.length > 1;

  const [phase, setPhase] = useState("intro"); // intro | handoff | playing | reveal | done
  const [prompts, setPrompts] = useState([]);
  const [seconds, setSeconds] = useState(25);
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState(0);
  const [results, setResults] = useState({ p1: [], p2: [] });
  const [guess, setGuess] = useState("");
  const [timeLeft, setTimeLeft] = useState(25);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [rejection, setRejection] = useState(null); // word tried that isn't in the bank
  const [pack, setPack] = useState("general");

  const inputRef = useRef(null);
  const guessRef = useRef("");
  const sentRef = useRef(false);

  const seat = seats[turn];
  const scores = {
    p1: results.p1.reduce((sum, r) => sum + r.points, 0),
    p2: results.p2.reduce((sum, r) => sum + r.points, 0),
  };
  const deepest = Math.max(...seats.map((s) => scores[s]));
  const fraction = descentFraction(deepest * METRES_PER_POINT);

  useEffect(() => {
    guessRef.current = guess;
  }, [guess]);

  const startRun = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/deep-dive/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack }),
      });
      if (!res.ok) throw new Error("Could not start a dive.");
      const data = await res.json();
      setPrompts(data.prompts);
      setSeconds(data.seconds);
      setTimeLeft(data.seconds);
      setIndex(0);
      setTurn(0);
      setResults({ p1: [], p2: [] });
      setGuess("");
      sentRef.current = false;
      setPhase(twoPlayer ? "handoff" : "playing");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }, [twoPlayer, pack]);

  // Scored on the device from the run's prompt pack; the server is only a
  // fallback (e.g. a run started before packs existed).
  const score = useCallback(
    async (promptId, answer) => {
      const prompt = prompts.find((p) => p.id === promptId);
      if (hasPack(prompt)) return scoreLocally(prompt, answer);
      const res = await fetch("/api/deep-dive/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId, answer }),
      });
      if (!res.ok) throw new Error("Could not score that answer.");
      return res.json();
    },
    [prompts]
  );

  // A word that isn't in the bank doesn't cost the prompt — only the seconds
  // spent on it. The answer is committed on the first valid word, or on the
  // timer running out (`force`), whichever comes first.
  const submitGuess = useCallback(
    async (answer, { force = false } = {}) => {
      if (sentRef.current) return;
      const prompt = prompts[index];
      if (!prompt) return;
      setBusy(true);
      try {
        const data = await score(prompt.id, answer);

        if (!force && !data.valid) {
          setRejection({ text: answer, suggestion: data.suggestion || null });
          inputRef.current?.select();
          return;
        }

        sentRef.current = true;
        if (data.valid && hasPack(prompt)) recordInBackground(prompt.id, answer);
        const entry = { ...data, promptId: prompt.id, promptText: prompt.text, given: answer };
        setResults((prev) => ({ ...prev, [seat]: [...prev[seat], entry] }));
        setGuess("");
        setRejection(null);
        if (turn + 1 < seats.length) {
          setTurn(turn + 1);
          setPhase("handoff");
        } else {
          setPhase("reveal");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
        sentRef.current = false;
      } finally {
        setBusy(false);
      }
    },
    [prompts, index, seat, turn, seats.length, score]
  );

  // Countdown. Running out submits whatever is half-typed rather than nothing.
  useEffect(() => {
    if (phase !== "playing") return undefined;
    setTimeLeft(seconds);
    sentRef.current = false;
    setRejection(null);
    const startedAt = Date.now();
    const id = setInterval(() => {
      const left = seconds - (Date.now() - startedAt) / 1000;
      if (left <= 0) {
        clearInterval(id);
        setTimeLeft(0);
        // Out of time — whatever is in the box goes in, valid or not.
        submitGuess(guessRef.current, { force: true });
      } else {
        setTimeLeft(left);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase, index, turn, seconds, submitGuess]);

  useEffect(() => {
    if (phase === "playing") inputRef.current?.focus();
  }, [phase, index, turn]);

  async function acceptSuggestion(which, key) {
    setBusy(true);
    try {
      const list = results[which];
      const current = list[list.length - 1];
      const data = await score(current.promptId, key);
      if (data.valid && hasPack(prompts.find((p) => p.id === current.promptId))) recordInBackground(current.promptId, key);
      const entry = { ...data, promptId: current.promptId, promptText: current.promptText, given: key };
      setResults((prev) => ({ ...prev, [which]: [...prev[which].slice(0, -1), entry] }));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function nextPrompt() {
    if (index + 1 >= prompts.length) {
      setPhase("done");
      return;
    }
    setIndex(index + 1);
    setTurn(0);
    setGuess("");
    setPhase(twoPlayer ? "handoff" : "playing");
  }

  const timerPct = (timeLeft / seconds) * 100;
  const timerClass = timerPct < 20 ? "danger" : timerPct < 45 ? "warn" : "";

  return (
    <div
      className={`dd-shell pack-${pack}`}
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
          <span className="dd-pill">{twoPlayer ? "Pass & play" : "Solo dive"}</span>
          {onChangeMode && <ChangeModeLink onClick={onChangeMode} label="Change mode" />}
        </div>
      </nav>

      <main className="dd-stage">
        {error && (
          <div className="dd-panel" style={{ padding: "var(--s4)", marginBottom: "var(--s4)", borderColor: "var(--ink-pink)" }}>
            {error}
          </div>
        )}

        {phase === "intro" && <Intro onStart={startRun} busy={busy} pack={pack} onPack={setPack} />}

        {phase !== "intro" && (
          <div className="dd-layout">
            <DepthGauge
              divers={seats.map((s, i) => ({
                key: s,
                depth: scores[s] * METRES_PER_POINT,
                ink: twoPlayer ? PLAYER_INK[s] : "var(--ink-ochre)",
                textInk: "var(--ink-dark)",
                label: twoPlayer ? String(i + 1) : "",
              }))}
            />

            <div style={{ display: "grid", gap: "var(--s4)" }}>
              {twoPlayer ? (
                <Scoreboard scores={scores} seat={phase === "playing" ? seat : null} index={index} total={prompts.length} />
              ) : (
                <SoloBar index={index} total={prompts.length} points={scores.p1} />
              )}

              {phase === "handoff" && (
                <Handoff seat={seat} onReady={() => setPhase("playing")} />
              )}

              {phase === "playing" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!busy) submitGuess(guess);
                  }}
                  className="dd-panel dd-pop"
                  style={{ padding: "var(--s5)", display: "grid", gap: "var(--s4)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--s3)" }}>
                    <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "var(--s2)" }}>
                      <IconClock size={14} strokeWidth={2.4} />
                      {Math.ceil(timeLeft)}s
                    </span>
                    {twoPlayer && (
                      <span className="eyebrow" style={{ color: PLAYER_INK[seat] }}>{playerName(seat)}&apos;s turn</span>
                    )}
                  </div>
                  <div className="dd-timer">
                    <div className={`dd-timer-fill ${timerClass}`} style={{ width: `${timerPct}%` }} />
                  </div>

                  <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.1rem)" }}>{prompts[index]?.text}</h2>

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
                          onClick={() => submitGuess(rejection.suggestion, { force: true })}
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

              {phase === "reveal" &&
                (twoPlayer ? (
                  <TwoPlayerReveal
                    results={results}
                    busy={busy}
                    onAccept={acceptSuggestion}
                    onNext={nextPrompt}
                    isLast={index + 1 >= prompts.length}
                  />
                ) : (
                  <Reveal
                    result={results.p1[results.p1.length - 1]}
                    onNext={nextPrompt}
                    onAcceptSuggestion={(key) => acceptSuggestion("p1", key)}
                    busy={busy}
                    isLast={index + 1 >= prompts.length}
                  />
                ))}

              {phase === "done" &&
                (twoPlayer ? (
                  <div style={{ display: "grid", gap: "var(--s5)" }}>
                    {seats.map((s, i) => (
                      <Results
                        key={s}
                        heading={playerName(s)}
                        results={results[s]}
                        points={scores[s]}
                        depth={scores[s] * METRES_PER_POINT}
                        opponent={{ name: playerName(s === "p1" ? "p2" : "p1"), points: scores[s === "p1" ? "p2" : "p1"] }}
                        showBoard={i === seats.length - 1}
                        onReplay={i === seats.length - 1 ? startRun : null}
                      />
                    ))}
                  </div>
                ) : (
                  <Results
                    results={results.p1}
                    points={scores.p1}
                    depth={scores.p1 * METRES_PER_POINT}
                    onReplay={startRun}
                  />
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SoloBar({ index, total, points }) {
  return (
    <div className="dd-panel" style={{ padding: "var(--s4)", display: "flex", justifyContent: "space-between", gap: "var(--s4)", flexWrap: "wrap" }}>
      <Stat label="Prompt" value={`${Math.min(index + 1, total)} / ${total}`} />
      <Stat label="Score" value={points} />
      <Stat label="Depth" value={formatDepth(points * METRES_PER_POINT)} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="mono" style={{ fontSize: "1.3rem", fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function Handoff({ seat, onReady }) {
  return (
    <div className="dd-panel dd-pop" style={{ padding: "var(--s6)", display: "grid", gap: "var(--s4)", textAlign: "center", justifyItems: "center" }}>
      <span
        style={{
          width: "3.4rem",
          height: "3.4rem",
          borderRadius: "50%",
          border: "var(--border-w) solid var(--frame)",
          background: PLAYER_INK[seat],
          color: "var(--ink-dark)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <IconUser size={22} strokeWidth={2.3} />
      </span>
      <div>
        <p className="eyebrow">Pass the phone</p>
        <h2 style={{ fontSize: "1.6rem", marginTop: "0.2rem" }}>{playerName(seat)}&apos;s turn</h2>
      </div>
      <p style={{ opacity: 0.75, maxWidth: "34ch" }}>
        Don&apos;t peek — the timer starts as soon as you tap.
      </p>
      <button className="dd-btn" onClick={onReady}>
        I&apos;m {playerName(seat)}, start my 25 seconds
      </button>
    </div>
  );
}

function TwoPlayerReveal({ results, busy, onAccept, onNext, isLast }) {
  const rows = ["p1", "p2"].map((s) => ({ seat: s, entry: results[s][results[s].length - 1] }));

  return (
    <div className="dd-panel dd-pop" style={{ padding: "var(--s5)", display: "grid", gap: "var(--s4)" }}>
      <p className="eyebrow">{rows[0].entry?.promptText}</p>

      <div style={{ display: "grid", gap: "var(--s3)" }}>
        {rows.map(({ seat, entry }) => (
          <div key={seat} style={{ display: "flex", alignItems: "center", gap: "var(--s3)", borderLeft: `4px solid ${PLAYER_INK[seat]}`, paddingLeft: "var(--s3)" }}>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <div className="eyebrow" style={{ opacity: 0.6 }}>{playerName(seat)}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", textTransform: "capitalize" }}>
                {entry?.given?.trim() || "No answer"}
              </div>
              {entry?.valid && (
                <div style={{ fontSize: "0.82rem", opacity: 0.7 }}>{entry.sharePercent}% of answers</div>
              )}
            </div>
            <div className="mono" style={{ fontSize: "1.3rem", fontWeight: 500 }}>+{entry?.points ?? 0}</div>
          </div>
        ))}
      </div>

      {rows.map(({ seat, entry }) =>
        entry?.suggestion ? (
          <button key={seat} className="dd-btn" onClick={() => onAccept(seat, entry.suggestion)} disabled={busy}>
            {playerName(seat)} — did you mean <span style={{ textTransform: "capitalize" }}>{entry.suggestion}</span>?
          </button>
        ) : null
      )}

      <button className="dd-btn ghost" onClick={onNext} disabled={busy}>
        {isLast ? "Surface and see your dives" : "Next prompt"}
      </button>
    </div>
  );
}
