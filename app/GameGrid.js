"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { dayIndex, msUntilReset, puzzleNumber } from "../lib/rarelist/core";

// 14×12 sprites. "#" is the game's colour, "+" is a white highlight.
const SPRITES = {
  streak: [
    "..............",
    "#####.........",
    "#+++#.........",
    "#+..#.........",
    "#####.........",
    "..#...........",
    "..#..#####....",
    "..####+++#....",
    ".....#+..#....",
    ".....#####....",
    "........#.....",
    "........#####.",
  ],
  spy: [
    "..............",
    "....######....",
    "...########...",
    "...##++++##...",
    ".############.",
    "..............",
    "...#......#...",
    "..#####.#####.",
    "..#+###.#+###.",
    "..#####.#####.",
    "...#......#...",
    "....######....",
  ],
  scales: [
    "..............",
    ".....####.....",
    "...##....##...",
    "..#.+..+..+#..",
    ".#..........#.",
    ".#.......#..#.",
    "#.......#....#",
    "#......#.....#",
    "#.....##.....#",
    "#....####....#",
    "##############",
    "..............",
  ],
  dive: [ // diving helmet
    "....######....",
    "...#++....#...",
    "..#+.####..#..",
    "..#.#....#.#..",
    ".##.#.++.#.##.",
    ".##.#....#.##.",
    "..#..####..#..",
    "..##......##..",
    "...########...",
    "..##########..",
    "..#.#.##.#.#..",
    "..##########..",
  ],
  crown: [
    "..............",
    "#.....##.....#",
    "##....##....##",
    "###..####..###",
    "####.####.####",
    "##############",
    "##############",
    "#+##+##+##+##+",
    "##############",
    "..............",
    "##############",
    "..............",
  ],
  lock: [
    "..............",
    "....######....",
    "...##....##...",
    "...#......#...",
    "...#......#...",
    "..##########..",
    "..##########..",
    "..####++####..",
    "..####++####..",
    "..#####+####..",
    "..##########..",
    "..............",
  ],
};

function Sprite({ name, px = 6 }) {
  const grid = SPRITES[name];
  const w = grid[0].length;
  const h = grid.length;
  const main = [];
  const hi = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      const ch = row[x];
      if (ch === "#" || ch === "+") {
        let run = 1;
        while (row[x + run] === ch) run++;
        (ch === "#" ? main : hi).push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} />);
        x += run;
      } else x++;
    }
  });
  return (
    <svg className="dg-sprite" width={w * px} height={h * px} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden>
      <g fill="var(--c)">{main}</g>
      <g fill="#fff" opacity="0.85">{hi}</g>
    </svg>
  );
}

export const GAMES = [
  { slug: "rarelist", name: "Rarelist", sub: "Daily trivia", players: "1P", color: "#ffcc33", sprite: "crown", daily: true },
  { slug: "word-streak", name: "Word Streak", sub: "Chain race", players: "2P", color: "#2ee6ff", sprite: "streak" },
  { slug: "codenames-duet", name: "Codenames Duet", sub: "Co-op spies", players: "2P", color: "#ff3ea5", sprite: "spy" },
  { slug: "wavelength", name: "Category Scales", sub: "Reverse Wavelength", players: "2P", color: "#b07cff", sprite: "scales" },
  { slug: "deep-dive", name: "Deep Dive", sub: "Rarity dive", players: "1–2P", color: "#3f9bff", sprite: "dive" },
];

function DailyLine() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now == null) return <span className="dg-tile-sub">Daily trivia</span>;
  const s = Math.floor(msUntilReset(now) / 1000);
  const clock = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0")).join(":");
  return (
    <span className="dg-tile-sub">
      Daily #{puzzleNumber(dayIndex(now))} · <span className="dg-mono">{clock}</span>
    </span>
  );
}

export default function GameGrid() {
  const gridRef = useRef(null);

  // Arrow keys move the cursor between cabinets, like a select screen.
  const onKeyDown = (e) => {
    const keys = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: "up", ArrowDown: "down" };
    if (!(e.key in keys)) return;
    const tiles = [...gridRef.current.querySelectorAll("a.dg-tile")];
    const i = tiles.indexOf(document.activeElement);
    if (i === -1) return;
    const cols = getComputedStyle(gridRef.current).gridTemplateColumns.split(" ").length;
    const step = keys[e.key] === "up" ? -cols : keys[e.key] === "down" ? cols : keys[e.key];
    const next = tiles[i + step];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  };

  return (
    <nav className="dg-grid" ref={gridRef} onKeyDown={onKeyDown} aria-label="Games">
      {GAMES.map((g, i) => (
        <Link key={g.slug} href={`/${g.slug}`} className="dg-tile" style={{ "--c": g.color, "--i": i }} aria-label={`${g.name}, ${g.sub}, ${g.players}`}>
          <span className="dg-tile-top">
            <span className="dg-slot">{String(i + 1).padStart(2, "0")}</span>
            {g.daily ? <span className="dg-live">LIVE</span> : null}
            <span className="dg-players">{g.players}</span>
          </span>
          <span className="dg-tile-art">
            <Sprite name={g.sprite} />
          </span>
          <span className="dg-tile-name">
            <span className="dg-cursor" aria-hidden>▶</span>
            {g.name}
          </span>
          {g.daily ? <DailyLine /> : <span className="dg-tile-sub">{g.sub}</span>}
        </Link>
      ))}
      <div className="dg-tile is-locked" style={{ "--c": "#4a4380", "--i": GAMES.length }} aria-label="Next game, coming soon">
        <span className="dg-tile-top">
          <span className="dg-slot">{String(GAMES.length + 1).padStart(2, "0")}</span>
          <span className="dg-players">??</span>
        </span>
        <span className="dg-tile-art">
          <Sprite name="lock" />
        </span>
        <span className="dg-tile-name">Locked</span>
        <span className="dg-tile-sub">Next game</span>
      </div>
    </nav>
  );
}
