"use client";

import { formatDepth } from "./zones";

const METRES_PER_POINT = 10;

export const PLAYER_INK = {
  p1: "var(--ink-blue)",
  p2: "var(--ink-pink)",
};

export function playerName(seat) {
  return seat === "p1" ? "Player 1" : "Player 2";
}

// Both depths, side by side, visible for the whole run. The leader is marked
// so a glance tells you where you stand without reading the numbers.
export default function Scoreboard({ scores, seat, index, total }) {
  const leader = scores.p1 === scores.p2 ? null : scores.p1 > scores.p2 ? "p1" : "p2";

  return (
    <div className="dd-panel" style={{ padding: "var(--s4)", display: "grid", gap: "var(--s3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="eyebrow">Prompt {Math.min(index + 1, total)} / {total}</span>
        {leader && <span className="eyebrow">{playerName(leader)} leads</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s3)" }}>
        {["p1", "p2"].map((p) => (
          <div
            key={p}
            style={{
              borderLeft: `4px solid ${PLAYER_INK[p]}`,
              paddingLeft: "var(--s3)",
              opacity: leader && leader !== p ? 0.72 : 1,
            }}
          >
            <div className="eyebrow" style={{ opacity: 0.6 }}>
              {playerName(p)}
              {seat === p ? " · you" : ""}
            </div>
            <div className="mono" style={{ fontSize: "1.35rem", fontWeight: 500, lineHeight: 1.15 }}>
              {formatDepth(scores[p] * METRES_PER_POINT)}
            </div>
            <div className="eyebrow" style={{ opacity: 0.55 }}>{scores[p]} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}
