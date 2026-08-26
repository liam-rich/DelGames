"use client";

import { useMemo } from "react";
import { MARKERS, formatDepth, gaugePosition } from "./zones";

// Vertical rail showing how deep a dive has sunk, against real ocean markers.
// Takes a list so two players can race down the same printed ruler.
export default function DepthGauge({ divers = [] }) {
  const deepest = divers.length ? Math.max(...divers.map((d) => d.depth)) : 0;

  return (
    <div className="dd-gauge" aria-hidden="true">
      <div className="dd-gauge-fill" style={{ height: `${gaugePosition(deepest)}%` }} />

      {MARKERS.map((marker) => (
        <div key={marker.depth} className="dd-zone" style={{ top: `${gaugePosition(marker.depth)}%` }}>
          <span>{formatDepth(marker.depth)}</span>
        </div>
      ))}

      {divers.map((diver, i) => (
        <div
          key={diver.key ?? i}
          className="dd-diver"
          style={{
            top: `${gaugePosition(diver.depth)}%`,
            background: diver.ink || "var(--ink-ochre)",
            color: diver.textInk || "var(--ink)",
            // Two divers at similar depths would sit on top of each other.
            left: divers.length > 1 ? `${33 + i * 34}%` : "50%",
          }}
        >
          {diver.label || ""}
        </div>
      ))}
    </div>
  );
}

// Drifting bubbles. Positions are generated once so they don't jump on re-render.
export function Bubbles({ count = 14 }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 6 + ((i * 7) % 18);
        return {
          key: i,
          left: `${(i * 37) % 100}%`,
          size,
          duration: `${11 + ((i * 5) % 13)}s`,
          delay: `${-((i * 3) % 14)}s`,
        };
      }),
    [count]
  );

  return (
    <div className="dd-bubbles" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.key}
          className="dd-bubble"
          style={{
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}
