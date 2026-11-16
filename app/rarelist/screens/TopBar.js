"use client";

import Link from "next/link";
import { PixelIcon } from "../ui";

export default function TopBar({ sound, onToggleSound, onBack, backLabel = "Menu", center }) {
  return (
    <header className="rl-topbar">
      {onBack ? (
        <button type="button" className="rl-iconbtn" onClick={onBack} aria-label={backLabel}>
          <PixelIcon name="back" size={14} />
          <span className="rl-iconbtn-label">{backLabel}</span>
        </button>
      ) : (
        <Link href="/" className="rl-iconbtn" aria-label="Back to DelGames">
          <PixelIcon name="back" size={14} />
          <span className="rl-iconbtn-label">DelGames</span>
        </Link>
      )}
      <div className="rl-topbar-center">{center}</div>
      <button
        type="button"
        className={`rl-iconbtn${sound ? " is-on" : ""}`}
        onClick={onToggleSound}
        aria-label={sound ? "Turn sound off" : "Turn sound on"}
        aria-pressed={sound}
      >
        <PixelIcon name={sound ? "soundOn" : "soundOff"} size={16} />
      </button>
    </header>
  );
}
