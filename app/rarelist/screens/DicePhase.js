"use client";

import { useEffect, useRef, useState } from "react";
import { ROUNDS_PER_DAY, applyDice, TIME_BY_FACE, HINTS_BY_FACE, DOUBLES_BONUS_SECONDS } from "../../../lib/rarelist/core";
import Die from "../Dice";
import { PixelIcon } from "../ui";
import { sfx } from "../sound";
import { api } from "../api";
import TopBar from "./TopBar";

export default function DicePhase({ day, round, dice, roll: rollIndex = 0, rerollsLeft = 0, onReroll, sound, onToggleSound, onHome, onBegin }) {
  const [phase, setPhase] = useState("pre"); // pre → rolling → assign → loading → reveal
  const [rollKey, setRollKey] = useState(0);
  const [landed, setLanded] = useState(0);
  const [swap, setSwap] = useState(false);
  const [setup, setSetup] = useState(null);
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  const effective = applyDice(dice, swap);

  // Default to the assignment that gives more time when the dice differ — the
  // player can always swap.
  useEffect(() => {
    if (phase === "assign" && landed === 2) {
      setSwap(dice[1] > dice[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, landed]);

  // The round pack doesn't depend on the dice, so fetch it the moment the
  // player rolls: any server latency hides behind the tumbling dice.
  const startRef = useRef(null);
  const fetchStart = () => {
    startRef.current = api("start", { day, round }).catch((e) => {
      startRef.current = null;
      throw e;
    });
    startRef.current.catch(() => {});
    return startRef.current;
  };

  const roll = () => {
    if (phase !== "pre") return;
    if (!startRef.current) fetchStart();
    setPhase("rolling");
    setRollKey((k) => k + 1);
  };

  const reroll = () => {
    if (phase !== "assign" || rerollsLeft <= 0) return;
    sfx.click();
    onReroll();
    setLanded(0);
    setPhase("rolling");
    setRollKey((k) => k + 1);
  };

  const onLand = () => {
    sfx.land();
    setLanded((n) => {
      const next = n + 1;
      if (next === 2) setTimeout(() => setPhase("assign"), 250);
      return next;
    });
  };

  const start = async () => {
    setPhase("loading");
    setError(null);
    try {
      const data = await (startRef.current || fetchStart());
      const s = applyDice(dice, swap);
      setSetup({
        list: data.list,
        pack: data.pack,
        players: data.players,
        seconds: s.seconds,
        hints: data.hintOrder.slice(0, s.hints),
      });
      setPhase("reveal");
    } catch (e) {
      setError(e.message || "Couldn't start the round.");
      setPhase("assign");
    }
  };

  // 3 · 2 · 1 · GO after the category card lands.
  const begun = useRef(false);
  useEffect(() => {
    if (phase !== "reveal" || !setup) return;
    const steps = [
      [1500, 3],
      [2200, 2],
      [2900, 1],
      [3600, "GO"],
    ];
    const timers = steps.map(([t, v]) =>
      setTimeout(() => {
        setCount(v);
        if (v === "GO") sfx.go();
        else sfx.beep();
      }, t)
    );
    timers.push(
      setTimeout(() => {
        if (begun.current) return;
        begun.current = true;
        onBegin({
          swap,
          dice,
          roll: rollIndex,
          seconds: setup.seconds,
          list: setup.list,
          hints: setup.hints,
          pack: setup.pack,
          players: setup.players,
        });
      }, 4150)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, setup]);

  const rolled = phase !== "pre" && phase !== "rolling";

  if (phase === "reveal" && setup) {
    return (
      <div className="rl-screen rl-reveal">
        <TopBar sound={sound} onToggleSound={onToggleSound} onBack={onHome} center={<RoundPill round={round} />} />
        <main className="rl-reveal-stage">
          <div className="rl-reveal-card">
            <span className="rl-cat">{setup.list.category}</span>
            <h2 className="rl-reveal-title">{setup.list.title}</h2>
            {setup.list.note ? <p className="rl-reveal-note">{setup.list.note}</p> : null}
            <div className="rl-reveal-stats">
              <span>
                <PixelIcon name="flag" size={11} /> {setup.list.size} ON THE LIST
              </span>
              <span>
                <PixelIcon name="clock" size={11} /> {setup.seconds}S
              </span>
              <span>
                <PixelIcon name="bolt" size={11} /> {setup.hints.length} HINT{setup.hints.length === 1 ? "" : "S"}
              </span>
            </div>
          </div>
          <div className="rl-count" key={String(count)} aria-live="assertive">
            {count == null ? <span className="rl-count-ready blink">GET READY</span> : <span className={count === "GO" ? "go" : ""}>{count}</span>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="rl-screen rl-dice-screen">
      <TopBar sound={sound} onToggleSound={onToggleSound} onBack={onHome} center={<RoundPill round={round} />} />
      <main className="rl-dice-stage">
        <p className="rl-kicker">{rolled ? "ASSIGN YOUR DICE" : "ROLL FOR THE ROUND"}</p>

        <div className={`rl-dice-row${swap && rolled ? " swapped" : ""}`}>
          {[0, 1].map((i) => (
            <button
              type="button"
              key={i}
              className={`rl-die-slot slot-${i}`}
              onClick={phase === "pre" ? roll : rolled && !effective.doubles ? () => { sfx.click(); setSwap((s) => !s); } : undefined}
              aria-label={phase === "pre" ? "Roll the dice" : `Die showing ${dice[i]}`}
              tabIndex={phase === "pre" || rolled ? 0 : -1}
            >
              <Die
                value={dice[i]}
                rollKey={rollKey}
                duration={i === 0 ? 1250 : 1500}
                tone={i === 0 ? "magenta" : "cyan"}
                onLand={onLand}
                onTumble={sfx.rattle}
              />
            </button>
          ))}
        </div>

        {rolled ? (
          <>
            <div className="rl-assign">
              <div className="rl-assign-cell tone-time">
                <span className="rl-assign-label">
                  <PixelIcon name="clock" size={11} /> TIME
                </span>
                <span className="rl-assign-value">{effective.seconds}s</span>
                <span className="rl-assign-face">die {effective.timeFace}</span>
              </div>
              <button
                type="button"
                className="rl-swap"
                onClick={() => {
                  sfx.click();
                  setSwap((s) => !s);
                }}
                disabled={effective.doubles || phase === "loading"}
                aria-label="Swap dice"
              >
                ⇄
              </button>
              <div className="rl-assign-cell tone-hint">
                <span className="rl-assign-label">
                  <PixelIcon name="bolt" size={11} /> HINTS
                </span>
                <span className="rl-assign-value">{effective.hints}</span>
                <span className="rl-assign-face">die {effective.hintFace}</span>
              </div>
            </div>
            {effective.doubles ? (
              <p className="rl-doubles">DOUBLES! +{DOUBLES_BONUS_SECONDS}S BONUS TIME</p>
            ) : (
              <p className="rl-assign-help">Tap a die or ⇄ to swap which one sets your clock.</p>
            )}
            <button
              type="button"
              className="rl-reroll"
              onClick={reroll}
              disabled={rerollsLeft <= 0 || phase !== "assign"}
            >
              <PixelIcon name="dice" size={12} />
              {rerollsLeft > 0 ? `Reroll · ${rerollsLeft} left today` : "No rerolls left today"}
            </button>
            {error ? <p className="rl-error">{error}</p> : null}
            <button type="button" className="rl-btn rl-btn-start" onClick={start} disabled={phase === "loading"}>
              <PixelIcon name="arrow" size={14} />
              {phase === "loading" ? "Loading…" : "Start round"}
            </button>
          </>
        ) : (
          <>
            <div className="rl-odds">
              <div>
                <span className="rl-odds-head">
                  <PixelIcon name="clock" size={10} /> TIME
                </span>
                <span className="rl-odds-row">
                  {TIME_BY_FACE.slice(1).map((s, i) => (
                    <span key={i}>
                      <b>{i + 1}</b>
                      {s}s
                    </span>
                  ))}
                </span>
              </div>
              <div>
                <span className="rl-odds-head">
                  <PixelIcon name="bolt" size={10} /> HINTS
                </span>
                <span className="rl-odds-row">
                  {HINTS_BY_FACE.slice(1).map((h, i) => (
                    <span key={i}>
                      <b>{i + 1}</b>
                      {h}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <button type="button" className="rl-btn rl-btn-start" onClick={roll} disabled={phase === "rolling"}>
              <PixelIcon name="dice" size={14} />
              {phase === "rolling" ? "Rolling…" : "Roll dice"}
            </button>
          </>
        )}
      </main>
    </div>
  );
}

export function RoundPill({ round }) {
  return (
    <span className="rl-roundpill">
      ROUND {round + 1}
      <span className="of">/{ROUNDS_PER_DAY}</span>
    </span>
  );
}
