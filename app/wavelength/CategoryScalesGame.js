"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconDice,
  IconRadio,
  IconUsers,
  IconArrowRight,
  IconTarget,
  IconTrophy,
  IconRefresh,
  IconBook,
} from "../icons";

const TOTAL_ROUNDS = 3;

const P1_THEME = { bg: "var(--wash-p1)", text: "var(--ink)" };
const P2_THEME = { bg: "var(--wash-p2)", text: "var(--ink)" };
const NEUTRAL_THEME = { bg: "var(--wash)", text: "var(--ink)" };

function scoreFor(diff) {
  if (diff <= 4) return { points: 5, label: "Perfect!" };
  if (diff <= 10) return { points: 3, label: "Close!" };
  if (diff <= 20) return { points: 1, label: "Decent" };
  return { points: 0, label: "Off the mark" };
}

export function playerLabel(role) {
  return role === "p1" ? "Player 1" : "Player 2";
}

export default function CategoryScalesGame() {
  const [phase, setPhase] = useState("briefing");
  // briefing -> placing -> handoff-category -> enter-category -> handoff-response ->
  // enter-response -> (loop) -> handoff-guess -> guessing -> reveal

  const [placer, setPlacer] = useState("p1"); // who secretly places the mark this round
  const guesser = placer === "p1" ? "p2" : "p1";

  const [totalScore, setTotalScore] = useState({ p1: 0, p2: 0 });

  const [secretMark, setSecretMark] = useState(50);
  const [draftMark, setDraftMark] = useState(50);
  const [rounds, setRounds] = useState([]); // [{ left, right, response }]
  const [roundIndex, setRoundIndex] = useState(0);
  const [leftLabel, setLeftLabel] = useState("");
  const [rightLabel, setRightLabel] = useState("");
  const [responseText, setResponseText] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [responseError, setResponseError] = useState("");

  const [guessMark, setGuessMark] = useState(50);
  const [result, setResult] = useState(null); // { diff, points, label }

  function startPlacing() {
    setRounds([]);
    setRoundIndex(0);
    setDraftMark(50);
    setGuessMark(50);
    setResult(null);
    setLeftLabel("");
    setRightLabel("");
    setResponseText("");
    setCategoryError("");
    setResponseError("");
    setPhase("placing");
  }

  function confirmPlacement() {
    setSecretMark(draftMark);
    setPhase("handoff-category");
  }

  function submitCategory(e) {
    e.preventDefault();
    if (!leftLabel.trim() || !rightLabel.trim()) {
      setCategoryError("Fill in both ends of the scale.");
      return;
    }
    if (leftLabel.trim().toLowerCase() === rightLabel.trim().toLowerCase()) {
      setCategoryError("The two ends should be different.");
      return;
    }
    setCategoryError("");
    setPhase("handoff-response");
  }

  function submitResponse(e) {
    e.preventDefault();
    if (!responseText.trim()) {
      setResponseError("Enter a response.");
      return;
    }
    setResponseError("");
    const newRound = { left: leftLabel.trim(), right: rightLabel.trim(), response: responseText.trim() };
    setRounds((prev) => [...prev, newRound]);
    setLeftLabel("");
    setRightLabel("");
    setResponseText("");

    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      setPhase("handoff-guess");
    } else {
      setRoundIndex((i) => i + 1);
      setPhase("handoff-category");
    }
  }

  function submitGuess() {
    const diff = Math.abs(guessMark - secretMark);
    const scored = scoreFor(diff);
    setResult({ diff, ...scored });
    setTotalScore((prev) => ({ ...prev, [guesser]: prev[guesser] + scored.points }));
    setPhase("reveal");
  }

  function playAgain() {
    setPlacer((p) => (p === "p1" ? "p2" : "p1"));
    startPlacing();
  }

  let theme = NEUTRAL_THEME;
  if (phase === "placing" || phase === "enter-response") {
    theme = placer === "p1" ? P1_THEME : P2_THEME;
  } else if (phase === "enter-category" || phase === "guessing") {
    theme = guesser === "p1" ? P1_THEME : P2_THEME;
  } else if (phase === "reveal") {
    theme = NEUTRAL_THEME;
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, transition: "background 0.25s ease" }}>
      <nav className="top-nav" style={{ color: theme.text }}>
        <Link href="/" className="brand" style={{ textDecoration: "none", color: theme.text }}>
          <span className="brand-badge">
            <IconDice size={20} strokeWidth={2.2} />
          </span>
          DelGames
        </Link>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {phase !== "briefing" && (
            <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
              <IconTrophy size={14} strokeWidth={2.4} />
              P1 {totalScore.p1} – {totalScore.p2} P2
            </span>
          )}
          <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
            <IconRadio size={14} strokeWidth={2.4} />
            Category Scales
          </span>
        </div>
      </nav>

      <main className="page" style={{ maxWidth: 640, color: theme.text }}>
        {phase === "briefing" && <BriefingPhase onStart={startPlacing} />}

        {phase === "placing" && (
          <PlacingPhase placer={placer} draftMark={draftMark} setDraftMark={setDraftMark} onConfirm={confirmPlacement} />
        )}

        {phase === "handoff-category" && (
          <HandoffPhase
            heading={`${playerLabel(guesser)}, invent a category`}
            body={`Pass the device to them. Round ${roundIndex + 1} of ${TOTAL_ROUNDS} — they'll label the two ends of a scale without knowing where ${playerLabel(placer)}'s mark is.`}
            buttonLabel="I've got the device"
            onReady={() => setPhase("enter-category")}
          />
        )}

        {phase === "enter-category" && (
          <EnterCategoryPhase
            guesser={guesser}
            roundIndex={roundIndex}
            leftLabel={leftLabel}
            setLeftLabel={setLeftLabel}
            rightLabel={rightLabel}
            setRightLabel={setRightLabel}
            error={categoryError}
            onSubmit={submitCategory}
            rounds={rounds}
          />
        )}

        {phase === "handoff-response" && (
          <HandoffPhase
            heading={`${playerLabel(placer)}, give your response`}
            body={`Pass the device back. You'll see your secret mark and ${playerLabel(guesser)}'s new scale — answer with a word that fits where your mark sits.`}
            buttonLabel="I've got the device"
            onReady={() => setPhase("enter-response")}
          />
        )}

        {phase === "enter-response" && (
          <EnterResponsePhase
            placer={placer}
            secretMark={secretMark}
            leftLabel={leftLabel}
            rightLabel={rightLabel}
            responseText={responseText}
            setResponseText={setResponseText}
            error={responseError}
            onSubmit={submitResponse}
            roundIndex={roundIndex}
          />
        )}

        {phase === "handoff-guess" && (
          <HandoffPhase
            heading={`${playerLabel(guesser)}, time to guess`}
            body={`Pass the device to them. All ${TOTAL_ROUNDS} categories are in — now they'll guess where ${playerLabel(placer)}'s mark actually is.`}
            buttonLabel="I've got the device"
            onReady={() => setPhase("guessing")}
          />
        )}

        {phase === "guessing" && (
          <GuessingPhase
            guesser={guesser}
            rounds={rounds}
            guessMark={guessMark}
            setGuessMark={setGuessMark}
            onSubmit={submitGuess}
          />
        )}

        {phase === "reveal" && (
          <RevealPhase
            placer={placer}
            guesser={guesser}
            secretMark={secretMark}
            guessMark={guessMark}
            result={result}
            rounds={rounds}
            onReplay={playAgain}
          />
        )}
      </main>
    </div>
  );
}

function BriefingPhase({ onStart }) {
  return (
    <section
      className="block"
      style={{ padding: "2rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span
          style={{
            width: "2.6rem",
            height: "2.6rem",
            borderRadius: 0,
            border: "var(--border-w) solid var(--frame)",
            background: "var(--purple)",
            color: "var(--paper)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconRadio size={20} strokeWidth={2.2} />
        </span>
        <h1 style={{ fontSize: "1.8rem" }}>Category Scales</h1>
      </div>

      <p style={{ lineHeight: 1.6 }}>
        One of you secretly marks a spot on a blank 0–100 scale. Neither of
        you know what it means yet.
      </p>
      <ul style={{ lineHeight: 1.8, paddingLeft: "1.2rem" }}>
        <li>The other player invents a category — two opposite ideas for the two ends of the scale — without seeing the mark.</li>
        <li>The mark-setter answers with a short response that fits wherever their secret mark falls on that new scale.</li>
        <li>This repeats for {TOTAL_ROUNDS} different categories.</li>
        <li>Then the guesser studies all {TOTAL_ROUNDS} categories and responses and places their own mark, trying to land on the original spot.</li>
        <li>Scoring: 5 for a perfect landing, 3 for close, 1 for decent, 0 if it's way off.</li>
      </ul>

      <button className="block-btn purple" onClick={onStart} style={{ alignSelf: "flex-start" }}>
        Start
        <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
      </button>
    </section>
  );
}

function HandoffPhase({ heading, body, buttonLabel, onReady }) {
  return (
    <section
      className="block"
      style={{
        padding: "2.5rem 2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        alignItems: "center",
        color: "var(--ink)",
      }}
    >
      <span
        style={{
          width: "3.4rem",
          height: "3.4rem",
          borderRadius: 0,
          border: "var(--border-w) solid var(--frame)",
          background: "var(--yellow)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconUsers size={24} strokeWidth={2.2} />
      </span>
      <h1 style={{ fontSize: "1.5rem" }}>{heading}</h1>
      <p style={{ opacity: 0.8, maxWidth: 460 }}>{body}</p>
      <button className="block-btn teal" onClick={onReady}>
        {buttonLabel}
        <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
      </button>
    </section>
  );
}

// A plain, unlabeled 0-100 slider used while secretly placing the mark.
function BlankSlider({ value, onChange }) {
  return (
    <div style={{ padding: "0.5rem 0" }}>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="scale-slider"
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, opacity: 0.6, marginTop: "0.4rem" }}>
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}

export function PlacingPhase({ placer, draftMark, setDraftMark, onConfirm }) {
  return (
    <section
      className="block"
      style={{ padding: "2rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "1.2rem" }}
    >
      <div className="pill" style={{ background: "var(--panel)", fontWeight: 800, alignSelf: "flex-start" }}>
        <IconTarget size={15} strokeWidth={2.4} />
        {playerLabel(placer)} — place your secret mark
      </div>
      <p style={{ opacity: 0.8, lineHeight: 1.5 }}>
        Drag the slider anywhere you like. It doesn't mean anything yet — the
        categories come later. Once you lock it in, the device gets passed
        away and your mark stays hidden until the very end.
      </p>

      <BlankSlider value={draftMark} onChange={setDraftMark} />

      <button className="block-btn blue" onClick={onConfirm} style={{ alignSelf: "flex-start" }}>
        Lock in my mark
        <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
      </button>
    </section>
  );
}

export function EnterCategoryPhase({ guesser, roundIndex, leftLabel, setLeftLabel, rightLabel, setRightLabel, error, onSubmit, rounds }) {
  return (
    <section>
      <div className="pill" style={{ background: "var(--panel)", color: "var(--ink)", fontWeight: 800, marginBottom: "1rem" }}>
        <IconTarget size={15} strokeWidth={2.4} />
        {playerLabel(guesser)} — round {roundIndex + 1} of {TOTAL_ROUNDS}
      </div>

      <form
        onSubmit={onSubmit}
        className="block"
        style={{ padding: "1.6rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <p style={{ opacity: 0.8, lineHeight: 1.5 }}>
          Pick two opposite ideas for the ends of a scale — like{" "}
          <em>Terrible pizza topping ↔ Amazing pizza topping</em>. You won't
          see where the secret mark is.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <input
            className="block-input"
            value={leftLabel}
            onChange={(e) => setLeftLabel(e.target.value)}
            placeholder="Left end (0)"
            maxLength={40}
            autoComplete="off"
            autoFocus
          />
          <input
            className="block-input"
            value={rightLabel}
            onChange={(e) => setRightLabel(e.target.value)}
            placeholder="Right end (100)"
            maxLength={40}
            autoComplete="off"
          />
        </div>
        {error && (
          <p style={{ color: "var(--ink-dark)", background: "var(--yellow)", padding: "0.5rem 0.8rem", borderRadius: 0, fontWeight: 700, border: "var(--border-w) solid var(--frame)" }}>
            {error}
          </p>
        )}
        <button type="submit" className="block-btn blue" style={{ alignSelf: "flex-start" }}>
          Send the category
          <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
        </button>
      </form>

      <RoundHistory rounds={rounds} />
    </section>
  );
}

export function EnterResponsePhase({ placer, secretMark, leftLabel, rightLabel, responseText, setResponseText, error, onSubmit, roundIndex }) {
  return (
    <section>
      <div className="pill" style={{ background: "var(--panel)", color: "var(--ink)", fontWeight: 800, marginBottom: "1rem" }}>
        <IconTarget size={15} strokeWidth={2.4} />
        {playerLabel(placer)} — round {roundIndex + 1} of {TOTAL_ROUNDS}
      </div>

      <div className="block" style={{ padding: "1.6rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <p style={{ opacity: 0.8 }}>Here's your secret mark on this round's scale:</p>

        <div>
          <div style={{ position: "relative", height: "2.4rem" }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "0.9rem",
                transform: "translateY(-50%)",
                borderRadius: "999px",
                border: "var(--border-w) solid var(--frame)",
                background: "linear-gradient(90deg, var(--blue), var(--pink))",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `${secretMark}%`,
                transform: "translate(-50%, -50%)",
                width: "1.6rem",
                height: "1.6rem",
                borderRadius: "50%",
                background: "var(--yellow)",
                border: "3px solid var(--frame)",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginTop: "0.5rem" }}>
            <span>{leftLabel}</span>
            <span>{rightLabel}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <input
            className="block-input"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Your response for this spot..."
            maxLength={40}
            autoComplete="off"
            autoFocus
          />
          {error && (
            <p style={{ color: "var(--ink-dark)", background: "var(--yellow)", padding: "0.5rem 0.8rem", borderRadius: 0, fontWeight: 700, border: "var(--border-w) solid var(--frame)" }}>
              {error}
            </p>
          )}
          <button type="submit" className="block-btn blue" style={{ alignSelf: "flex-start" }}>
            Send response
            <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
          </button>
        </form>
      </div>
    </section>
  );
}

export function GuessingPhase({ guesser, rounds, guessMark, setGuessMark, onSubmit }) {
  return (
    <section>
      <div className="pill" style={{ background: "var(--panel)", color: "var(--ink)", fontWeight: 800, marginBottom: "1rem" }}>
        <IconTarget size={15} strokeWidth={2.4} />
        {playerLabel(guesser)} — place your guess
      </div>

      <RoundHistory rounds={rounds} expanded />

      <div className="block" style={{ padding: "1.6rem", color: "var(--ink)", marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <p style={{ opacity: 0.8 }}>
          Where do you think the original secret mark was, on a scale of 0 to 100?
        </p>
        <BlankSlider value={guessMark} onChange={setGuessMark} />
        <button className="block-btn blue" onClick={onSubmit} style={{ alignSelf: "flex-start" }}>
          Lock in my guess
          <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
        </button>
      </div>
    </section>
  );
}

export function RoundHistory({ rounds, expanded }) {
  if (rounds.length === 0) return null;
  return (
    <div className="block" style={{ padding: "1rem 1.2rem", color: "var(--ink)", marginTop: expanded ? 0 : "1.2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, marginBottom: "0.7rem", fontSize: "0.9rem" }}>
        <IconBook size={15} strokeWidth={2.4} />
        Categories so far
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {rounds.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.4rem",
              padding: "0.6rem 0.8rem",
              borderRadius: 0,
              border: "2px solid var(--frame)",
              background: "var(--panel)",
            }}
          >
            <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
              {r.left} <IconArrowRight size={11} strokeWidth={3} style={{ verticalAlign: "-1px" }} /> {r.right}
            </span>
            <span className="pill" style={{ background: "var(--yellow)", fontWeight: 800 }}>
              {r.response}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RevealPhase({ placer, guesser, secretMark, guessMark, result, rounds, onReplay }) {
  return (
    <section
      className="block"
      style={{ padding: "2rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "1.3rem" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: 0,
            border: "var(--border-w) solid var(--frame)",
            background: "var(--yellow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconTrophy size={22} strokeWidth={2.2} />
        </span>
        <div>
          <h1 style={{ fontSize: "1.6rem" }}>{result.label}</h1>
          <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>
            {playerLabel(guesser)} scores {result.points} point{result.points === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div>
        <div style={{ position: "relative", height: "2.6rem" }}>
          {[
            { size: 8, color: "rgba(74, 222, 128, 0.55)" },
            { size: 20, color: "rgba(255, 210, 63, 0.5)" },
            { size: 40, color: "rgba(255, 92, 92, 0.35)" },
          ].map((zone, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: `${secretMark}%`,
                transform: "translate(-50%, -50%)",
                width: `${zone.size}%`,
                height: "1.1rem",
                borderRadius: "999px",
                background: zone.color,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "0.9rem",
              transform: "translateY(-50%)",
              borderRadius: "999px",
              border: "var(--border-w) solid var(--frame)",
              background: "transparent",
            }}
          />
          <MarkPin position={secretMark} color="var(--yellow)" label={playerLabel(placer)} />
          <MarkPin position={guessMark} color="var(--teal)" label={playerLabel(guesser)} offsetDown />
        </div>
        <div style={{ marginTop: "1.6rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, opacity: 0.7 }}>
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      <p style={{ opacity: 0.75, fontSize: "0.9rem" }}>
        {playerLabel(placer)}'s mark was at {secretMark}. {playerLabel(guesser)} guessed {guessMark} — off by {result.diff}.
      </p>

      <RoundHistory rounds={rounds} expanded />

      <button className="block-btn purple" onClick={onReplay} style={{ alignSelf: "flex-start" }}>
        <IconRefresh size={16} strokeWidth={2.4} style={{ marginRight: "0.5rem", verticalAlign: "-3px" }} />
        Play again (roles swap)
      </button>
    </section>
  );
}

function MarkPin({ position, color, label, offsetDown }) {
  return (
    <div
      style={{
        position: "absolute",
        top: offsetDown ? "calc(50% + 1.1rem)" : "calc(50% - 1.1rem)",
        left: `${position}%`,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.2rem",
      }}
    >
      {!offsetDown && (
        <span style={{ fontSize: "0.65rem", fontWeight: 800, whiteSpace: "nowrap" }}>{label}</span>
      )}
      <div
        style={{
          width: "1.3rem",
          height: "1.3rem",
          borderRadius: "50%",
          background: color,
          border: "3px solid var(--frame)",
        }}
      />
      {offsetDown && (
        <span style={{ fontSize: "0.65rem", fontWeight: 800, whiteSpace: "nowrap" }}>{label}</span>
      )}
    </div>
  );
}
