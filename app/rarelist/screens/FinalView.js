"use client";

import { shareText } from "../../../lib/rarelist/core";
import TopBar from "./TopBar";
import { ResultsBody, ShareButton } from "./Results";

export default function FinalView({ prev, sound, onToggleSound, onHome }) {
  const final = prev?.final;
  if (!final) {
    return (
      <div className="rl-screen rl-results">
        <TopBar sound={sound} onToggleSound={onToggleSound} onBack={onHome} />
        <main className="rl-scroll">
          <p className="rl-sample">Final scores aren't available yet.</p>
        </main>
      </div>
    );
  }

  const provisional = prev.rounds.reduce((s, r) => s + (r?.summary?.total || 0), 0);
  const rounds = final.rounds.map((r) => ({
    title: r.list.title,
    total: r.total,
    answers: r.scored,
  }));
  const delta = final.total - provisional;

  const text = shareText({
    day: final.day,
    rounds: final.rounds.map((r) => ({ correct: r.scored })),
    total: final.total,
    final: true,
    rank: final.rank,
    url: typeof window !== "undefined" ? `${window.location.origin}/rarelist` : undefined,
  });

  return (
    <div className="rl-screen rl-results">
      <TopBar sound={sound} onToggleSound={onToggleSound} onBack={onHome} />
      <main className="rl-scroll">
        <ResultsBody
          day={final.day}
          rounds={rounds}
          total={final.total}
          final
          rank={final.rank}
          stampLabel={delta === 0 ? "LOCKED" : `LOCKED · ${delta > 0 ? "+" : ""}${delta} VS PROVISIONAL`}
        />
        {!final.live ? (
          <p className="rl-sample">Live stats weren't recorded for this day, so these scores use the pre-game rarity estimate.</p>
        ) : (
          <p className="rl-sample">
            Scored against the final pick rates from {Math.max(...final.rounds.map((r) => r.players)).toLocaleString()} players.
          </p>
        )}
        <div className="rl-actions">
          <ShareButton text={text} />
          <button type="button" className="rl-btn secondary" onClick={onHome}>
            Play today
          </button>
        </div>
      </main>
    </div>
  );
}
