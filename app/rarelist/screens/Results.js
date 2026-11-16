"use client";

import { useEffect, useState } from "react";
import { msUntilReset, puzzleNumber, shareText, dayLabel } from "../../../lib/rarelist/core";
import { CountUp, PixelIcon, formatClock, useNow } from "../ui";
import { sfx } from "../sound";
import TopBar from "./TopBar";
import { Breakdown, TileRow } from "./Tiles";

export async function shareResult(text) {
  try {
    if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      await navigator.share({ text });
      return "shared";
    }
  } catch (e) {
    if (e?.name === "AbortError") return "cancelled";
  }
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}

export function ShareButton({ text }) {
  const [state, setState] = useState(null);
  return (
    <button
      type="button"
      className={`rl-btn rl-btn-share${state === "copied" ? " ok" : ""}`}
      onClick={async () => {
        sfx.click();
        const r = await shareResult(text);
        setState(r);
        if (r === "copied" || r === "failed") setTimeout(() => setState(null), 2200);
      }}
    >
      <PixelIcon name={state === "copied" ? "check" : "share"} size={13} />
      {state === "copied" ? "Copied!" : state === "failed" ? "Couldn't copy" : "Share"}
    </button>
  );
}

export function ResultsBody({ day, rounds, total, final, rank, stampLabel }) {
  const answersByRound = rounds.map((r) => r.answers);
  return (
    <>
      <div className="rl-gameover">
        <p className="rl-gameover-kicker">
          #{puzzleNumber(day)} · {dayLabel(day).toUpperCase()}
        </p>
        <h1 className="rl-gameover-title" data-text={final ? "FINAL" : "GAME OVER"}>
          {final ? "FINAL" : "GAME OVER"}
        </h1>
      </div>

      <div className="rl-bigscore big">
        <span className="rl-bigscore-num">
          <CountUp value={total} from={0} duration={1600} onStep={() => sfx.count()} />
        </span>
        <span className={`rl-stamp ${final ? "final" : "provisional"}`}>
          <PixelIcon name={final ? "lock" : "clock"} size={10} />
          {stampLabel}
        </span>
        {rank ? (
          <span className="rl-rankline">
            <PixelIcon name="trophy" size={12} /> RANK #{rank.rank} OF {rank.of}
          </span>
        ) : null}
      </div>

      <div className="rl-rounds">
        {rounds.map((r, i) => (
          <section key={i} className="rl-round-row" style={{ "--row": i }}>
            <div className="rl-round-row-head">
              <span className="rl-round-row-n">R{i + 1}</span>
              <span className="rl-round-row-title">{r.title}</span>
              <span className="rl-round-row-pts">{r.total}</span>
            </div>
            <TileRow answers={r.answers} size="sm" offset={i * 5} />
          </section>
        ))}
      </div>

      <Breakdown answersByRound={answersByRound} />
    </>
  );
}

export default function Results({ day, game, sound, onToggleSound, onHome }) {
  const now = useNow(1000);
  const rounds = game.rounds.map((r) => ({
    title: r.list.title,
    total: r.summary?.total || 0,
    answers: r.correct || [],
  }));
  const total = rounds.reduce((s, r) => s + r.total, 0);

  useEffect(() => {
    const t = setTimeout(() => sfx.fanfare(), 300);
    return () => clearTimeout(t);
  }, []);

  const text = shareText({
    day,
    rounds: game.rounds,
    total,
    final: false,
    url: typeof window !== "undefined" ? `${window.location.origin}/rarelist` : undefined,
  });

  return (
    <div className="rl-screen rl-results">
      <TopBar sound={sound} onToggleSound={onToggleSound} onBack={onHome} />
      <main className="rl-scroll">
        <ResultsBody day={day} rounds={rounds} total={total} final={false} stampLabel="PROVISIONAL" />

        <div className="rl-lockbox">
          <PixelIcon name="lock" size={12} />
          <span>
            Final scores and ranks lock in <b className="mono">{formatClock(msUntilReset(now))}</b>. Rarity keeps
            shifting until then as more people play.
          </span>
        </div>

        <div className="rl-actions">
          <ShareButton text={text} />
          <button type="button" className="rl-btn secondary" onClick={onHome}>
            Menu
          </button>
        </div>

        <pre className="rl-share-preview" aria-label="Share preview">{text}</pre>
      </main>
    </div>
  );
}
