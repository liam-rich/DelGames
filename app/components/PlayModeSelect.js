"use client";

import { IconSmartphone, IconUsers, IconWifi } from "../icons";

// The two-player games use the default pair of modes; Deep Dive passes its own
// list so it can offer a solo run alongside them.
export const DEFAULT_MODES = [
  {
    key: "pass-and-play",
    Icon: IconUsers,
    title: "Pass & play",
    body: "One device, passed back and forth between you.",
    color: "var(--ink-blue)",
  },
  {
    key: "online",
    Icon: IconWifi,
    title: "Two phones",
    body: "Each of you joins from your own phone with a room code.",
    color: "var(--ink-pink)",
  },
];

export default function PlayModeSelect({ title, description, onChoose, modes = DEFAULT_MODES, accent = "var(--ink-blue)" }) {
  return (
    <section className="mode-select" style={{ "--accent": accent }}>
      <header className="mode-hero">
        <h1 className="mode-title">{title}</h1>
        {description && <p className="mode-desc">{description}</p>}
      </header>

      <p className="mode-prompt">
        <span className="mode-blink">▶</span> Choose a mode
      </p>

      <div className="mode-grid">
        {/* `key` is pulled out of the spread — React rejects it being passed
            through props rather than set directly on the element. */}
        {modes.map(({ key, ...rest }, i) => (
          <ModeCard key={key} index={i} {...rest} onClick={() => onChoose(key)} />
        ))}
      </div>
    </section>
  );
}

function ModeCard({ Icon, title, body, color, onClick, index }) {
  return (
    <button onClick={onClick} className="mode-tile" style={{ "--c": color, "--i": index }}>
      <span className="mode-tile-icon">
        <Icon size={22} strokeWidth={2.4} />
      </span>
      <span className="mode-tile-text">
        <span className="mode-tile-title">{title}</span>
        <span className="mode-tile-body">{body}</span>
      </span>
      <span className="mode-tile-go" aria-hidden>
        ▶
      </span>
    </button>
  );
}

// A small pill shown inside a game once a mode is picked, letting the player
// bail back to the mode-select screen.
export function ChangeModeLink({ onClick, label = "Change mode" }) {
  return (
    <button
      onClick={onClick}
      className="pill"
      style={{ cursor: "pointer" }}
    >
      <IconSmartphone size={13} strokeWidth={2.4} />
      {label}
    </button>
  );
}
