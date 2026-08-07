"use client";

import { IconSmartphone, IconUsers, IconWifi } from "../icons";

export default function PlayModeSelect({ title, description, onChoose }) {
  return (
    <section
      className="block"
      style={{ padding: "2rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "1.3rem" }}
    >
      <div>
        <h1 style={{ fontSize: "1.7rem", marginBottom: "0.4rem" }}>{title}</h1>
        {description && <p style={{ opacity: 0.75, lineHeight: 1.5 }}>{description}</p>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <ModeCard
          Icon={IconUsers}
          title="Pass & play"
          body="One device, passed back and forth between you."
          color="var(--teal)"
          onClick={() => onChoose("pass-and-play")}
        />
        <ModeCard
          Icon={IconWifi}
          title="Two phones"
          body="Each of you joins from your own phone with a room code."
          color="var(--purple)"
          onClick={() => onChoose("online")}
        />
      </div>
    </section>
  );
}

function ModeCard({ Icon, title, body, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block"
      style={{
        padding: "1.4rem",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "0.7rem",
        background: "var(--panel)",
        color: "var(--ink)",
      }}
    >
      <span
        style={{
          width: "2.6rem",
          height: "2.6rem",
          borderRadius: "12px",
          border: "var(--border-w) solid var(--ink)",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} strokeWidth={2.2} />
      </span>
      <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>{title}</span>
      <span style={{ opacity: 0.7, fontSize: "0.85rem", lineHeight: 1.4 }}>{body}</span>
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
      style={{ background: "var(--panel)", color: "var(--ink)", cursor: "pointer", border: "var(--border-w) solid var(--ink)" }}
    >
      <IconSmartphone size={13} strokeWidth={2.4} />
      {label}
    </button>
  );
}
