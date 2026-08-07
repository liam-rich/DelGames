"use client";

import { useState } from "react";
import Link from "next/link";
import { IconDice, IconRadio } from "../icons";
import PlayModeSelect from "../components/PlayModeSelect";
import CategoryScalesGame from "./CategoryScalesGame";
import CategoryScalesOnline from "./CategoryScalesOnline";

export default function CategoryScalesRoot() {
  const [mode, setMode] = useState(null); // null | 'pass-and-play' | 'online'

  if (mode === "pass-and-play") return <CategoryScalesGame />;
  if (mode === "online") return <CategoryScalesOnline onChangeMode={() => setMode(null)} />;

  return (
    <>
      <nav className="top-nav">
        <Link href="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="brand-badge">
            <IconDice size={20} strokeWidth={2.2} />
          </span>
          DelGames
        </Link>
        <span className="pill" style={{ background: "var(--purple)", color: "var(--paper)" }}>
          <IconRadio size={14} strokeWidth={2.4} />
          Category Scales
        </span>
      </nav>
      <main className="page" style={{ maxWidth: 640 }}>
        <PlayModeSelect
          title="Category Scales"
          description="One of you secretly marks a scale; the other invents categories and guesses where the mark is."
          onChoose={setMode}
        />
      </main>
    </>
  );
}
