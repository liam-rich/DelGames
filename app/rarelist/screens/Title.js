"use client";

import { useEffect, useState } from "react";
import { ROUNDS_PER_DAY, TIERS, dayLabel, msUntilReset, puzzleNumber } from "../../../lib/rarelist/core";
import { PixelIcon, formatClock, useNow } from "../ui";
import { sfx } from "../sound";
import { api } from "../api";
import TopBar from "./TopBar";

const TIER_POINTS = { common: "10–15", uncommon: "15–27", rare: "27–42", legendary: "42–60" };

export default function Title({ day, game, prev, playerId, sound, onToggleSound, onStart, onUpdatePrev, onOpenFinal }) {
  const now = useNow(1000);
  const left = msUntilReset(now);

  // The day ticked over while the page sat open: start fresh.
  useEffect(() => {
    if (left < 1000) {
      const t = setTimeout(() => window.location.reload(), 1500);
      return () => clearTimeout(t);
    }
  }, [left]);

  const done = game.rounds.filter((r) => r?.done).length;
  const inRound = game.rounds.find((r) => r && !r.done && r.startedAt);
  const total = game.rounds.reduce((s, r) => s + (r?.summary?.total || 0), 0);

  let cta = "Press start";
  if (done >= ROUNDS_PER_DAY) cta = "View results";
  else if (inRound) cta = "Resume round";
  else if (done > 0) cta = `Continue · Round ${done + 1}`;

  return (
    <div className="rl-screen rl-title">
      <TopBar sound={sound} onToggleSound={onToggleSound} />

      <main className="rl-scroll">
        <div className="rl-title-hero">
          <h1 className="rl-logo" aria-label="Rarelist">
            <span className="rl-logo-row" data-text="RARE">RARE</span>
            <span className="rl-logo-row alt" data-text="LIST">LIST</span>
          </h1>
          <p className="rl-title-meta">
            <span>DAILY #{puzzleNumber(day)}</span>
            <span className="dot">◆</span>
            <span>{dayLabel(day).toUpperCase()}</span>
          </p>
          <p className="rl-title-tag">Name five. The rarer the answer, the bigger the score.</p>

          <div className="rl-progress" aria-label={`${done} of ${ROUNDS_PER_DAY} rounds played`}>
            {Array.from({ length: ROUNDS_PER_DAY }, (_, i) => (
              <span key={i} className={`rl-progress-cell${game.rounds[i]?.done ? " done" : ""}${game.rounds[i] && !game.rounds[i].done ? " live" : ""}`}>
                {game.rounds[i]?.done ? <PixelIcon name="check" size={10} /> : i + 1}
              </span>
            ))}
            {done > 0 ? <span className="rl-progress-score">{total} PTS</span> : null}
          </div>

          <button
            type="button"
            className="rl-btn rl-btn-start"
            onClick={() => {
              sfx.go();
              onStart();
            }}
          >
            <PixelIcon name="arrow" size={14} />
            {cta}
          </button>

          <p className="rl-countdown">
            NEXT PUZZLE IN <span className="mono">{formatClock(left)}</span>
          </p>
        </div>

        {prev ? <YesterdayCard prev={prev} playerId={playerId} onUpdatePrev={onUpdatePrev} onOpen={onOpenFinal} /> : null}

        <section className="rl-panel rl-howto">
          <h2 className="rl-h2">How to play</h2>
          <ol className="rl-steps">
            <li>
              <span className="rl-step-icon tone-magenta">
                <PixelIcon name="dice" size={18} />
              </span>
              <div>
                <strong>Roll two dice.</strong> One sets your clock, the other buys letter hints. You choose which is which.
              </div>
            </li>
            <li>
              <span className="rl-step-icon tone-cyan">
                <PixelIcon name="bolt" size={18} />
              </span>
              <div>
                <strong>Name five answers</strong> from the day's list before time runs out. Wrong guesses cost nothing.
              </div>
            </li>
            <li>
              <span className="rl-step-icon tone-gold">
                <PixelIcon name="legendary" size={18} />
              </span>
              <div>
                <strong>Rarer answers score more.</strong> Rarity is how few players named it today.
              </div>
            </li>
          </ol>

          <div className="rl-legend">
            {[...TIERS].reverse().map((t) => (
              <div key={t.key} className={`rl-legend-cell tier-${t.key}`}>
                <PixelIcon name={t.key} size={16} />
                <span className="rl-legend-label">{t.label}</span>
                <span className="rl-legend-pts">{TIER_POINTS[t.key]}</span>
              </div>
            ))}
          </div>

          <p className="rl-fine">
            Three lists a day, the same for everyone. Scores are provisional while the day is live and lock at
            00:00 UTC using the final pick rates. Come back tomorrow for your final score and rank.
          </p>
        </section>
      </main>
    </div>
  );
}

function YesterdayCard({ prev, playerId, onUpdatePrev, onOpen }) {
  const [state, setState] = useState(prev.final ? "ready" : "loading");
  const provisional = prev.rounds.reduce((s, r) => s + (r?.summary?.total || 0), 0);

  useEffect(() => {
    if (prev.final) return;
    let cancelled = false;
    api("final", {
      playerId,
      day: prev.day,
      keysByRound: prev.rounds.map((r) => (r?.correct || []).map((c) => c.key)),
    })
      .then((final) => {
        if (cancelled) return;
        onUpdatePrev((p) => ({ ...p, final }));
        setState("ready");
      })
      .catch(() => !cancelled && setState("error"));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prev.day]);

  const final = prev.final;
  const delta = final ? final.total - provisional : 0;

  return (
    <button type="button" className="rl-panel rl-yesterday" onClick={onOpen} disabled={!final}>
      <span className="rl-yesterday-head">
        <PixelIcon name="lock" size={12} />
        YESTERDAY · #{puzzleNumber(prev.day)} · FINAL
      </span>
      {state === "loading" ? <span className="rl-yesterday-body blink">LOCKING SCORES…</span> : null}
      {state === "error" ? <span className="rl-yesterday-body">Couldn't load final scores. Try again later.</span> : null}
      {final ? (
        <span className="rl-yesterday-body">
          <span className="rl-yesterday-score">{final.total}</span>
          <span className="rl-yesterday-side">
            <span className={`rl-delta ${delta > 0 ? "up" : delta < 0 ? "down" : ""}`}>
              {delta === 0 ? "No change" : `${delta > 0 ? "▲" : "▼"} ${Math.abs(delta)} vs provisional`}
            </span>
            {final.rank ? (
              <span className="rl-rank">
                <PixelIcon name="trophy" size={11} /> #{final.rank.rank} of {final.rank.of}
                {final.rank.of >= 10 ? ` · TOP ${Math.max(1, Math.ceil((final.rank.rank / final.rank.of) * 100))}%` : ""}
              </span>
            ) : (
              <span className="rl-rank muted">Rank unavailable</span>
            )}
          </span>
          <PixelIcon name="arrow" size={12} className="rl-yesterday-go" />
        </span>
      ) : null}
    </button>
  );
}
