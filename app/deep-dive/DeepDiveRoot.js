"use client";

import { useState } from "react";
import Link from "next/link";
import { IconDice, IconWaves, IconUser, IconUsers, IconWifi } from "../icons";
import PlayModeSelect from "../components/PlayModeSelect";
import DeepDiveGame from "./DeepDiveGame";
import DeepDiveOnline from "./DeepDiveOnline";

const MODES = [
  {
    key: "solo",
    Icon: IconUser,
    title: "Solo dive",
    body: "Just you against the board. Only solo runs set the all-time record.",
    color: "var(--ink-ochre)",
  },
  {
    key: "pass-and-play",
    Icon: IconUsers,
    title: "Pass & play",
    body: "Both of you on one phone, taking it in turns prompt by prompt.",
    color: "var(--ink-blue)",
  },
  {
    key: "online",
    Icon: IconWifi,
    title: "Two phones",
    body: "Same seven prompts on both phones, joined with a room code.",
    color: "var(--ink-pink)",
  },
];

export default function DeepDiveRoot() {
  const [mode, setMode] = useState(null);

  if (mode === "solo") return <DeepDiveGame mode="solo" onChangeMode={() => setMode(null)} />;
  if (mode === "pass-and-play") return <DeepDiveGame mode="pass-and-play" onChangeMode={() => setMode(null)} />;
  if (mode === "online") return <DeepDiveOnline onChangeMode={() => setMode(null)} />;

  return (
    <>
      <nav className="top-nav">
        <Link href="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="brand-badge">
            <IconDice size={19} strokeWidth={2.2} />
          </span>
          DelGames
        </Link>
        <span className="pill">
          <IconWaves size={13} strokeWidth={2.4} />
          Deep Dive
        </span>
      </nav>

      <main className="page" style={{ maxWidth: 720 }}>
        <PlayModeSelect
          title="Deep Dive"
          description="Seven prompts, 25 seconds each. Name one thing — the rarer your answer, the deeper you sink."
          modes={MODES}
          onChoose={setMode}
        />
      </main>
    </>
  );
}
