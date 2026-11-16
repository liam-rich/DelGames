"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TIER_BY_KEY } from "../../lib/rarelist/core";

// ---------------------------------------------------------------------------
// Pixel icons — drawn from little ASCII grids so they stay razor sharp.
// ---------------------------------------------------------------------------

const GRIDS = {
  common: ["..###..", ".#####.", "##...##", "##...##", "##...##", ".#####.", "..###.."],
  uncommon: ["...#...", "..###..", ".##.##.", "##...##", ".##.##.", "..###..", "...#..."],
  rare: ["...#...", "...#...", "#######", ".#####.", "..###..", ".##.##.", "##...##"],
  legendary: ["#..#..#", "##.#.##", "#######", "##.#.##", "#######", ".......", "#######"],
  clock: [".#####.", "#..#..#", "#..#..#", "#..##.#", "#.....#", "#.....#", ".#####."],
  check: ["......#", ".....##", "#...##.", "##.##..", ".###...", "..#....", "......."],
  cross: ["#.....#", ".#...#.", "..#.#..", "...#...", "..#.#..", ".#...#.", "#.....#"],
  share: ["...#...", "..###..", ".#.#.#.", "...#...", "#..#..#", "#.....#", "#######"],
  trophy: ["#######", "#.###.#", "#.###.#", ".#####.", "..###..", "...#...", ".#####."],
  lock: ["..###..", ".#...#.", ".#...#.", "#######", "###.###", "###.###", "#######"],
  arrow: ["...#...", "...##..", "######.", "#######", "######.", "...##..", "...#..."],
  back: ["...#...", "..##...", ".######", "#######", ".######", "..##...", "...#..."],
  help: [".#####.", "##...##", ".....##", "...###.", "...##..", ".......", "...##.."],
  bolt: ["....##.", "...##..", "..##...", ".#####.", "...##..", "..##...", ".##...."],
  soundOn: ["...#....", "..##..#.", "####.#..", "####.#.#", "####.#.#", "####.#..", "..##..#.", "...#...."],
  soundOff: ["...#....", "..##....", "####.#.#", "####..#.", "####..#.", "####.#.#", "..##....", "...#...."],
  dice: ["#######", "#.....#", "#.#.#.#", "#.....#", "#.#.#.#", "#.....#", "#######"],
  flag: ["##.....", "#####..", "#######", "#####..", "##.....", "#......", "#......"],
  skull: [".#####.", "#######", "#..#..#", "#######", ".#####.", ".#.#.#.", "......."],
};

export function PixelIcon({ name, size = 14, color = "currentColor", title, style, className }) {
  const grid = GRIDS[name];
  if (!grid) return null;
  const w = grid[0].length;
  const h = grid.length;
  const rects = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] === "#") {
        let run = 1;
        while (row[x + run] === "#") run++;
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} />);
        x += run;
      } else x++;
    }
  });
  return (
    <svg
      width={size}
      height={(size * h) / w}
      viewBox={`0 0 ${w} ${h}`}
      fill={color}
      shapeRendering="crispEdges"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      style={style}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      {rects}
    </svg>
  );
}

export function TierBadge({ tier, compact = false }) {
  const t = TIER_BY_KEY[tier] || TIER_BY_KEY.common;
  return (
    <span className={`rl-badge tier-${t.key}${compact ? " compact" : ""}`}>
      <PixelIcon name={t.key} size={compact ? 9 : 11} />
      {compact ? t.short : t.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Arcade counter: eases toward its target, optionally blipping as it goes.
// ---------------------------------------------------------------------------

export function useCountUp(target, { duration = 700, onStep, from } = {}) {
  const [value, setValue] = useState(from ?? target);
  const valueRef = useRef(from ?? target);
  const stepRef = useRef(onStep);
  stepRef.current = onStep;

  useEffect(() => {
    const start = valueRef.current;
    if (start === target) return;
    let raf;
    const t0 = performance.now();
    let lastShown = start;
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + (target - start) * eased);
      valueRef.current = v;
      setValue(v);
      if (v !== lastShown && stepRef.current) {
        // Blip on roughly every few points, not every frame.
        if (Math.abs(v - lastShown) >= 3 || p === 1) {
          stepRef.current(v);
          lastShown = v;
        }
      }
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export function CountUp({ value, duration, onStep, from, pad = 0 }) {
  const v = useCountUp(value, { duration, onStep, from });
  return <>{pad ? String(v).padStart(pad, "0") : v}</>;
}

// ---------------------------------------------------------------------------
// Pixel burst — a ring of square sparks flung out from the parent's centre.
// ---------------------------------------------------------------------------

export function Burst({ tier, seed }) {
  const sparks = useMemo(() => {
    const count = tier === "legendary" ? 22 : tier === "rare" ? 14 : 8;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = (tier === "legendary" ? 90 : 60) + Math.random() * 50;
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist * 0.7,
        size: 4 + Math.floor(Math.random() * 3) * 2,
        delay: Math.random() * 80,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, tier]);

  return (
    <span className={`rl-burst tier-${tier}`} aria-hidden>
      {sparks.map((s, i) => (
        <i
          key={i}
          style={{
            "--dx": `${s.dx}px`,
            "--dy": `${s.dy}px`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}ms`,
          }}
        />
      ))}
    </span>
  );
}

export function formatClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}
