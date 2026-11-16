"use client";

import { useEffect, useState } from "react";
import { ROUNDS_PER_DAY, TIER_BY_KEY } from "../../../lib/rarelist/core";
import { CountUp, PixelIcon } from "../ui";
import { sfx } from "../sound";
import TopBar from "./TopBar";
import { RoundPill } from "./DicePhase";
import { Breakdown, TileRow } from "./Tiles";

export default function RoundEnd({ round, state, sound, onToggleSound, onNext }) {
  const summary = state.summary;
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const best = state.correct.reduce((b, c) => (c.points > (b?.points || 0) ? c : b), null);
    const t = setTimeout(() => {
      if (best?.tier === "legendary") sfx.legendary();
      else if (best?.tier === "rare") sfx.rare();
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const last = round + 1 >= ROUNDS_PER_DAY;
  const headline =
    state.endedBy === "clear" ? "ROUND CLEAR!" : state.endedBy === "timeup" ? "TIME UP!" : "ROUND OVER";
  const players = summary.players;

  return (
    <div className="rl-screen rl-roundend">
      <TopBar sound={sound} onToggleSound={onToggleSound} center={<RoundPill round={round} />} onBack={null} />
      <main className="rl-scroll">
        <p className={`rl-kicker ${state.endedBy === "clear" ? "tone-ok" : "tone-warn"}`}>{headline}</p>
        <h2 className="rl-summary-title">{state.list.title}</h2>

        <div className="rl-bigscore">
          <span className="rl-bigscore-num">
            <CountUp value={summary.total} from={0} duration={1100} onStep={() => sfx.count()} />
          </span>
          <span className="rl-bigscore-label">ROUND POINTS</span>
        </div>

        <TileRow answers={state.correct} />
        <Breakdown answersByRound={[state.correct]} />

        <p className="rl-sample">
          {players < 25
            ? "You're among the first to play today, so rarity leans on our pre-game estimate. It firms up as more people play."
            : `Based on ${players.toLocaleString()} players so far today. Scores lock at 00:00 UTC.`}
        </p>

        <button type="button" className="rl-reveal-toggle" onClick={() => setShowList((s) => !s)} aria-expanded={showList}>
          <PixelIcon name={showList ? "cross" : "flag"} size={11} />
          {showList ? "HIDE THE LIST" : `SEE ALL ${summary.reveal.length} ANSWERS`}
        </button>

        {showList ? (
          <ol className="rl-fulllist">
            {summary.reveal.map((a) => (
              <li key={a.key} className={`rl-full-row tier-${a.tier}${a.mine ? " mine" : ""}`}>
                <span className="rl-full-icon">
                  <PixelIcon name={a.tier} size={11} />
                </span>
                <span className="rl-full-name">
                  {a.display}
                  {a.mine ? <small> · YOU</small> : null}
                </span>
                <span className="rl-full-bar" aria-hidden>
                  <i style={{ width: `${Math.max(2, Math.round(a.share * 100))}%` }} />
                </span>
                <span className="rl-full-pct">{formatShare(a.share)}</span>
                <span className="rl-full-tier">{TIER_BY_KEY[a.tier].short}</span>
              </li>
            ))}
          </ol>
        ) : null}
        <div className="rl-sticky-spacer" />
      </main>
      <div className="rl-sticky-cta">
        <button type="button" className="rl-btn rl-btn-start" onClick={() => { sfx.go(); onNext(); }}>
          <PixelIcon name="arrow" size={14} />
          {last ? "See results" : `Round ${round + 2}`}
        </button>
      </div>
    </div>
  );
}

export function formatShare(share) {
  const pct = share * 100;
  if (pct < 1) return "<1%";
  return `${Math.floor(pct)}%`;
}
