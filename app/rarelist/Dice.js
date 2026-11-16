"use client";

import { useEffect, useRef, useState } from "react";

// A 3D pixel die. Faces are laid out like a real die (opposites sum to 7) and
// the cube always tumbles forward several full turns before settling.

const PIPS = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

// Rotation that brings each face to the front.
const FACE_ROT = {
  1: [0, 0],
  6: [0, 180],
  3: [0, -90],
  4: [0, 90],
  2: [-90, 0],
  5: [90, 0],
};

const FACE_POS = {
  1: "rotateY(0deg)",
  6: "rotateY(180deg)",
  3: "rotateY(90deg)",
  4: "rotateY(-90deg)",
  2: "rotateX(90deg)",
  5: "rotateX(-90deg)",
};

function Face({ n }) {
  return (
    <div className="rl-die-face" style={{ transform: `${FACE_POS[n]} translateZ(var(--half))` }}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={PIPS[n].includes(i) ? "pip on" : "pip"} />
      ))}
    </div>
  );
}

export default function Die({ value, rollKey, duration = 1300, onLand, onTumble, tone = "magenta", size = 88, settled }) {
  const [rot, setRot] = useState(() => {
    const [x, y] = FACE_ROT[value] || [0, 0];
    return { x: x - 20, y: y + 25 };
  });
  const [phase, setPhase] = useState(settled ? "landed" : "idle");
  const first = useRef(true);
  const cb = useRef({ onLand, onTumble });
  cb.current = { onLand, onTumble };

  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (!rollKey) return;
    }
    if (!rollKey) return;
    const [tx, ty] = FACE_ROT[value];
    setRot((prev) => {
      const spinsX = 2 + Math.floor(Math.random() * 2);
      const spinsY = 2 + Math.floor(Math.random() * 2);
      const baseX = Math.ceil(prev.x / 360) * 360;
      const baseY = Math.ceil(prev.y / 360) * 360;
      return { x: baseX + spinsX * 360 + tx, y: baseY + spinsY * 360 + ty };
    });
    setPhase("rolling");

    // Rattle that slows down as the die loses momentum.
    let t = 0;
    let gap = 45;
    const timers = [];
    while (t < duration - 150) {
      timers.push(setTimeout(() => cb.current.onTumble?.(), t));
      t += gap;
      gap *= 1.18;
    }
    timers.push(
      setTimeout(() => {
        setPhase("landed");
        cb.current.onLand?.();
      }, duration)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollKey]);

  return (
    <div
      className={`rl-die tone-${tone} ${phase}`}
      style={{ "--size": `${size}px`, "--half": `${size / 2}px`, "--dur": `${duration}ms` }}
    >
      <div className="rl-die-hop">
        <div
          className="rl-die-cube"
          style={{
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transitionDuration: phase === "rolling" ? `${duration}ms` : "0ms",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Face key={n} n={n} />
          ))}
        </div>
      </div>
      <div className="rl-die-shadow" />
    </div>
  );
}
