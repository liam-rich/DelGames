"use client";

import { ANSWERS_PER_ROUND, BASE_POINTS, TIERS } from "../../../lib/rarelist/core";
import { PixelIcon } from "../ui";

export function AnswerTile({ answer, index = 0, size = "md" }) {
  if (!answer) {
    return (
      <div className={`rl-tile miss ${size}`} style={{ "--i": index }}>
        <span className="rl-tile-icon">
          <PixelIcon name="cross" size={10} />
        </span>
        <span className="rl-tile-name">—</span>
      </div>
    );
  }
  return (
    <div className={`rl-tile tier-${answer.tier} ${size}`} style={{ "--i": index }}>
      <span className="rl-tile-icon">
        <PixelIcon name={answer.tier} size={size === "sm" ? 9 : 12} />
      </span>
      <span className="rl-tile-name">{answer.display}</span>
      <span className="rl-tile-pts">{answer.points}</span>
    </div>
  );
}

export function TileRow({ answers, size, offset = 0 }) {
  return (
    <div className={`rl-tilerow ${size || ""}`}>
      {Array.from({ length: ANSWERS_PER_ROUND }, (_, i) => (
        <AnswerTile key={i} answer={answers[i]} index={offset + i} size={size} />
      ))}
    </div>
  );
}

export function breakdown(answersByRound) {
  const counts = Object.fromEntries(TIERS.map((t) => [t.key, 0]));
  let total = 0;
  let found = 0;
  for (const answers of answersByRound) {
    for (const a of answers) {
      if (!a) continue;
      counts[a.tier] = (counts[a.tier] || 0) + 1;
      total += a.points;
      found += 1;
    }
  }
  const base = found * BASE_POINTS;
  return { counts, total, found, base, bonus: total - base };
}

export function Breakdown({ answersByRound }) {
  const b = breakdown(answersByRound);
  return (
    <div className="rl-breakdown">
      <div className="rl-breakdown-tiers">
        {[...TIERS].reverse().map((t) => (
          <span key={t.key} className={`rl-bd-tier tier-${t.key}${b.counts[t.key] ? "" : " zero"}`}>
            <PixelIcon name={t.key} size={12} />
            <b>{b.counts[t.key]}</b>
            <small>{t.short}</small>
          </span>
        ))}
      </div>
      <div className="rl-breakdown-sum">
        <span>
          BASE <b>{b.base}</b>
        </span>
        <span className="plus">+</span>
        <span className="bonus">
          RARITY BONUS <b>{b.bonus}</b>
        </span>
      </div>
    </div>
  );
}
