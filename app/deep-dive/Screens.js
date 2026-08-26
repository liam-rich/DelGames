"use client";

import { useEffect, useState } from "react";
import { IconTrophy, IconCheck, IconX } from "../icons";
import { formatDepth, zoneFor } from "./zones";
import { PACKS, packCount } from "./packs";

const RULES = [
  "Seven prompts. 25 seconds each. Name one thing.",
  "Rare answers sink you deeper. Obvious ones barely make a ripple.",
  "If it felt like the clever pick, everyone else picked it too.",
  "Every point is 10 metres. 700 points reaches the trench floor.",
];

export function PackPicker({ value, onChange }) {
  return (
    <div className="dd-panel" style={{ padding: "var(--s5)", display: "grid", gap: "var(--s3)" }}>
      <h2 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.75 }}>
        Pick a pack
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--s2)" }}>
        {PACKS.map((pack) => {
          const active = pack.id === value;
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => onChange(pack.id)}
              style={{
                textAlign: "left",
                cursor: "pointer",
                font: "inherit",
                border: "var(--border-w) solid var(--ink)",
                borderRadius: "var(--radius)",
                padding: "var(--s3)",
                display: "grid",
                gap: "0.15rem",
                background: active ? pack.ink : "var(--stock)",
                color: active ? "var(--stock-bright)" : "var(--ink)",
                boxShadow: active ? "3px 3px 0 var(--ink)" : "none",
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>{pack.name}</span>
              <span style={{ fontSize: "0.75rem", opacity: 0.8, lineHeight: 1.35 }}>{pack.blurb}</span>
              <span className="eyebrow" style={{ opacity: active ? 0.85 : 0.55 }}>{packCount(pack.id)} prompts</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Intro({ onStart, busy, pack, onPack }) {
  return (
    <div style={{ display: "grid", gap: "1.25rem", maxWidth: 640, margin: "0 auto", paddingTop: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(2.6rem, 9vw, 4.2rem)",
            letterSpacing: "-0.045em",
            color: "var(--ink-blue)",
            textShadow: "3px 3px 0 var(--ink-pink)",
          }}
        >
          DEEP DIVE
        </h1>
        <p className="eyebrow" style={{ marginTop: "var(--s2)", opacity: 0.75 }}>
          Rarer answers sink deeper
        </p>
      </div>

      <div className="dd-panel" style={{ padding: "1.5rem", display: "grid", gap: "0.8rem" }}>
        <h2 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.75 }}>
          How to play
        </h2>
        {RULES.map((rule) => (
          <div key={rule} style={{ display: "flex", gap: "0.6rem", lineHeight: 1.45 }}>
            <span style={{ opacity: 0.5 }}>—</span>
            <span>{rule}</span>
          </div>
        ))}
      </div>

      {onPack && <PackPicker value={pack} onChange={onPack} />}

      <button className="dd-btn" onClick={onStart} disabled={busy} style={{ fontSize: "1.15rem", padding: "1.1rem" }}>
        {busy ? "Preparing..." : "▼  BEGIN DESCENT  ▼"}
      </button>

      <Leaderboard />
    </div>
  );
}

export function Reveal({ result, onNext, onAcceptSuggestion, busy, isLast }) {
  if (!result) return null;
  const { valid, points, sharePercent, given, promptText, suggestion, matchedAs } = result;

  return (
    <div className="dd-panel dd-pop" style={{ padding: "1.5rem", display: "grid", gap: "1.1rem" }}>
      <div style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: 700 }}>{promptText}</div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap" }}>
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: "2.6rem",
            height: "2.6rem",
            borderRadius: "50%",
            border: "var(--border-w) solid var(--ink)",
            background: valid ? "var(--ink-blue)" : "var(--ink-pink)",
            color: "var(--stock-bright)",
            flexShrink: 0,
          }}
        >
          {valid ? <IconCheck size={18} strokeWidth={3} /> : <IconX size={18} strokeWidth={3} />}
        </span>
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "capitalize", wordBreak: "break-word" }}>
            {given?.trim() ? given : "(no answer)"}
          </div>
          <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>
            {valid
              ? `${sharePercent}% of answers · rarer than ${result.rarerThan}% of the category`
              : suggestion
                ? "Not quite — but that's close to something"
                : "Not in the bank for this category — no points"}
          </div>
          {valid && matchedAs && (
            <div style={{ opacity: 0.6, fontSize: "0.8rem" }}>
              counted as <span style={{ textTransform: "capitalize" }}>{matchedAs}</span>
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1 }}>+{points}</div>
          <div style={{ fontSize: "0.7rem", opacity: 0.7, fontWeight: 700 }}>{formatDepth(points * 10)}</div>
        </div>
      </div>

      {suggestion && (
        <button className="dd-btn" onClick={() => onAcceptSuggestion(suggestion)} disabled={busy}>
          {busy ? (
            "Scoring..."
          ) : (
            <>
              Did you mean <span style={{ textTransform: "capitalize" }}>{suggestion}</span>?
            </>
          )}
        </button>
      )}

      <button className={suggestion ? "dd-btn ghost" : "dd-btn"} onClick={onNext} disabled={busy}>
        {suggestion ? "No, keep my answer" : isLast ? "Surface and see your dive" : "Next prompt"}
      </button>
    </div>
  );
}

export function Results({ results, points, depth, opponent = null, onReplay, showBoard = true, heading = null }) {
  const zone = zoneFor(depth);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [board, setBoard] = useState(null);
  const [standing, setStanding] = useState(null); // null while we check

  // Only a score that would actually land on the board earns a name entry.
  useEffect(() => {
    let alive = true;
    fetch("/api/deep-dive/scores")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        const rows = d.board || [];
        setBoard(rows);
        setStanding({
          available: d.available,
          qualifies: Boolean(d.available && points > 0 && (rows.length < d.capacity || points > d.cutoff)),
        });
      })
      .catch(() => alive && setStanding({ available: false, qualifies: false }));
    return () => {
      alive = false;
    };
  }, [points]);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/deep-dive/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          answers: results.map((r) => ({ promptId: r.promptId, answer: r.given })),
        }),
      });
      const data = await res.json();
      setBoard(data.board || []);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="dd-panel dd-pop" style={{ padding: "1.75rem", textAlign: "center", display: "grid", gap: "0.5rem" }}>
        <div className="eyebrow">{heading ? `${heading} reached` : "You reached"}</div>
        <div style={{ fontSize: "clamp(2.8rem, 11vw, 4.5rem)", fontWeight: 800, lineHeight: 1 }}>
          {formatDepth(depth)}
        </div>
        <div style={{ fontWeight: 700 }}>
          {zone.name} · {points} points
        </div>
        <div className="dd-pill" style={{ justifySelf: "center", marginTop: "0.4rem", background: "var(--ink-ochre)", color: "var(--ink)", borderColor: "var(--ink)" }}>
          <IconTrophy size={14} strokeWidth={2.4} />
          {zone.rank}
        </div>

        {opponent && (
          <p style={{ marginTop: "var(--s3)", fontWeight: 700 }}>
            {points > opponent.points
              ? `You out-dived ${opponent.name}`
              : points < opponent.points
                ? `${opponent.name} out-dived you`
                : `Dead heat with ${opponent.name}`}
            <span style={{ opacity: 0.6, fontWeight: 400 }}>
              {" — they reached "}
              <span className="mono">{formatDepth(opponent.points * 10)}</span>
            </span>
          </p>
        )}
      </div>

      <div className="dd-panel" style={{ padding: "var(--s5)", display: "grid", gap: "var(--s4)" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Your dive, prompt by prompt</h2>
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gap: "var(--s1)",
              paddingTop: "var(--s4)",
              borderTop: "1.5px solid rgba(35, 32, 28, 0.16)",
            }}
          >
            <p className="eyebrow">{r.promptText}</p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "var(--s4)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", textTransform: "capitalize" }}>
                {r.given?.trim() || "No answer"}
              </span>
              <span className="mono" style={{ fontWeight: 500, flexShrink: 0 }}>
                {r.valid ? `${r.sharePercent}% · +${r.points}` : "+0"}
              </span>
            </div>

            {r.reveal?.deeper?.length > 0 && (
              <p style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>
                <span style={{ color: "var(--ink-blue)", fontWeight: 700 }}>Deeper: </span>
                {r.reveal.deeper.join(", ")}
              </p>
            )}
            {r.reveal?.commonest?.length > 0 && (
              <p style={{ fontSize: "0.85rem", lineHeight: 1.5, opacity: 0.68 }}>
                Most said {r.reveal.commonest.join(", ")} · {r.reveal.total} accepted
              </p>
            )}
          </div>
        ))}
      </div>

      {standing?.qualifies && !submitted ? (
        <form onSubmit={submit} className="dd-panel" style={{ padding: "var(--s5)", display: "grid", gap: "var(--s3)" }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--ink-pink)" }}>All-time top score</p>
            <h2 style={{ fontSize: "1.15rem", marginTop: "0.15rem" }}>That one goes on the board.</h2>
          </div>
          <input
            className="dd-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={16}
            autoComplete="off"
          />
          <button type="submit" className="dd-btn" disabled={busy || !name.trim()}>
            {busy ? "Saving..." : "Add to the board"}
          </button>
        </form>
      ) : showBoard ? (
        <Leaderboard initial={board} />
      ) : null}

      {onReplay && (
        <button className="dd-btn ghost" onClick={onReplay}>
          Dive again
        </button>
      )}
    </div>
  );
}

export function Leaderboard({ initial = null }) {
  const [state, setState] = useState(initial ? { available: true, board: initial } : null);

  useEffect(() => {
    if (initial) return;
    let alive = true;
    fetch("/api/deep-dive/scores")
      .then((r) => r.json())
      .then((d) => alive && setState(d))
      .catch(() => alive && setState({ available: false, board: [] }));
    return () => {
      alive = false;
    };
  }, [initial]);

  if (!state) return null;

  return (
    <div className="dd-panel" style={{ padding: "1.25rem", display: "grid", gap: "0.6rem" }}>
      <h2 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.75, display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <IconTrophy size={14} strokeWidth={2.4} />
        Deepest dives
      </h2>

      {!state.available && (
        <p style={{ fontSize: "0.85rem", opacity: 0.75, lineHeight: 1.5 }}>
          No KV store configured, so scores can&apos;t be saved yet. Add Vercel KV (or Upstash Redis) to turn the board on.
        </p>
      )}

      {state.available && state.board.length === 0 && (
        <p style={{ fontSize: "0.85rem", opacity: 0.75 }}>No dives logged yet — be the first.</p>
      )}

      {state.board.map((row, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.95rem" }}>
          <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <strong style={{ opacity: 0.6, marginRight: "0.5rem" }}>{i + 1}</strong>
            {row.name}
            {row.best && <span style={{ opacity: 0.55 }}> · {row.best}</span>}
          </span>
          <span style={{ fontWeight: 800, flexShrink: 0 }}>{formatDepth(row.points * 10)}</span>
        </div>
      ))}
    </div>
  );
}
