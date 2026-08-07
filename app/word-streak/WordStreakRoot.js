"use client";

import { useState } from "react";
import Link from "next/link";
import { IconDice, IconLink } from "../icons";
import PlayModeSelect from "../components/PlayModeSelect";
import WordStreakGame from "./WordStreakGame";
import WordStreakOnline from "./WordStreakOnline";

export default function WordStreakRoot() {
  const [mode, setMode] = useState(null); // null | 'pass-and-play' | 'online'

  if (mode === "pass-and-play") return <WordStreakGame />;
  if (mode === "online") return <WordStreakOnline onChangeMode={() => setMode(null)} />;

  return (
    <>
      <nav className="top-nav">
        <Link href="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="brand-badge">
            <IconDice size={20} strokeWidth={2.2} />
          </span>
          DelGames
        </Link>
        <span className="pill" style={{ background: "var(--teal)" }}>
          <IconLink size={14} strokeWidth={2.4} />
          Word Streak
        </span>
      </nav>
      <main className="page" style={{ maxWidth: 640 }}>
        <PlayModeSelect
          title="Word Streak"
          description="Both of you build a secret 5-word chain. Race to guess each other's words first."
          onChoose={setMode}
        />
      </main>
    </>
  );
}
