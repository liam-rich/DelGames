"use client";

import { useState } from "react";
import Link from "next/link";
import { IconDice, IconSpy } from "../icons";
import PlayModeSelect from "../components/PlayModeSelect";
import CodenamesDuetGame from "./CodenamesDuetGame";
import CodenamesDuetOnline from "./CodenamesDuetOnline";

export default function CodenamesDuetRoot() {
  const [mode, setMode] = useState(null); // null | 'pass-and-play' | 'online'

  if (mode === "pass-and-play") return <CodenamesDuetGame />;
  if (mode === "online") return <CodenamesDuetOnline onChangeMode={() => setMode(null)} />;

  return (
    <>
      <nav className="top-nav">
        <Link href="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="brand-badge">
            <IconDice size={20} strokeWidth={2.2} />
          </span>
          DelGames
        </Link>
        <span className="pill" style={{ background: "var(--pink)", color: "var(--ink-dark)" }}>
          <IconSpy size={14} strokeWidth={2.4} />
          Codenames Duet
        </span>
      </nav>
      <main className="page" style={{ maxWidth: 780 }}>
        <PlayModeSelect
          accent="var(--ink-pink)"
          title="Codenames Duet"
          description="A shared 5x5 board with two private keys. Give clues, find your agents, and avoid the assassin — together."
          onChoose={setMode}
        />
      </main>
    </>
  );
}
