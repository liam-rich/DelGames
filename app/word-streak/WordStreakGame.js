"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  IconDice,
  IconLink,
  IconUser,
  IconUsers,
  IconArrowRight,
  IconEye,
  IconTarget,
  IconLock,
  IconTrophy,
  IconRefresh,
  IconCheck,
} from "../icons";

const WORD_COUNT = 5;

const P1_THEME = { bg: "var(--blue)", text: "var(--paper)", name: "Player 1" };
const P2_THEME = { bg: "var(--pink)", text: "var(--ink)", name: "Player 2" };
const NEUTRAL_THEME = { bg: "var(--paper)", text: "var(--ink)", name: "" };

function emptyWords() {
  return Array.from({ length: WORD_COUNT }, () => "");
}

export default function WordStreakGame() {
  const [phase, setPhase] = useState("setup-p1");
  // setup-p1 -> handoff-1 -> setup-p2 -> handoff-2 -> play -> results

  const [p1Words, setP1Words] = useState(emptyWords()); // Player 1's secret chain (Player 2 guesses this)
  const [p2Words, setP2Words] = useState(emptyWords()); // Player 2's secret chain (Player 1 guesses this)
  const [setupError, setSetupError] = useState("");

  // who takes the first guess each round — alternates every round
  const [starter, setStarter] = useState("p1");
  // win tally, persists across rounds (not reset by "play again")
  const [wins, setWins] = useState({ p1: 0, p2: 0 });

  const [currentTurn, setCurrentTurn] = useState("p1");
  const [p1TargetIndex, setP1TargetIndex] = useState(1); // word in p2Words that Player 1 is chasing
  const [p2TargetIndex, setP2TargetIndex] = useState(1); // word in p1Words that Player 2 is chasing
  const [p1Revealed, setP1Revealed] = useState(1);
  const [p2Revealed, setP2Revealed] = useState(1);
  const [guessInput, setGuessInput] = useState("");
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [finishOrder, setFinishOrder] = useState([]); // e.g. ['p1'] then ['p1','p2']

  function updateWord(setter, i, value) {
    const clean = value.replace(/[^a-zA-Z]/g, "").toLowerCase();
    setter((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
  }

  function validate(words) {
    for (let i = 0; i < WORD_COUNT; i++) {
      if (!words[i] || words[i].trim().length < 1) {
        return `Word ${i + 1} needs at least one letter.`;
      }
    }
    return "";
  }

  function submitP1Setup() {
    const err = validate(p1Words);
    if (err) {
      setSetupError(err);
      return;
    }
    setSetupError("");
    setPhase("handoff-1");
  }

  function submitP2Setup() {
    const err = validate(p2Words);
    if (err) {
      setSetupError(err);
      return;
    }
    setSetupError("");
    setPhase("handoff-2");
  }

  function beginPlay() {
    setCurrentTurn(starter);
    setP1TargetIndex(1);
    setP2TargetIndex(1);
    setP1Revealed(1);
    setP2Revealed(1);
    setGuessInput("");
    setFeedback(null);
    setFinishOrder([]);
    setPhase("play");
  }

  function resetAll() {
    setP1Words(emptyWords());
    setP2Words(emptyWords());
    setSetupError("");
    setStarter((s) => (s === "p1" ? "p2" : "p1")); // alternate who starts next round
    setCurrentTurn("p1");
    setP1TargetIndex(1);
    setP2TargetIndex(1);
    setP1Revealed(1);
    setP2Revealed(1);
    setGuessInput("");
    setFeedback(null);
    setFinishOrder([]);
    setPhase("setup-p1");
  }

  // once someone finishes, hand play to whoever's left; once both finish, tally the win
  useEffect(() => {
    if (finishOrder.length === 1) {
      const other = finishOrder[0] === "p1" ? "p2" : "p1";
      setCurrentTurn(other);
    } else if (finishOrder.length === 2) {
      const roundWinner = finishOrder[0];
      setWins((prev) => ({ ...prev, [roundWinner]: prev[roundWinner] + 1 }));
      const t = setTimeout(() => setPhase("results"), 500);
      return () => clearTimeout(t);
    }
  }, [finishOrder]);

  const bothStillRacing = finishOrder.length === 0;
  const activeTargetWords = currentTurn === "p1" ? p2Words : p1Words;
  const activeTargetIndex = currentTurn === "p1" ? p1TargetIndex : p2TargetIndex;
  const activeRevealed = currentTurn === "p1" ? p1Revealed : p2Revealed;
  const currentWord = activeTargetWords[activeTargetIndex] || "";
  const canReveal = currentWord.length - activeRevealed > 1;

  function submitGuess(e) {
    e.preventDefault();
    const guess = guessInput.trim().toLowerCase();
    if (!guess) return;

    const finisher = currentTurn;
    const setTargetIndex = currentTurn === "p1" ? setP1TargetIndex : setP2TargetIndex;
    const setRevealed = currentTurn === "p1" ? setP1Revealed : setP2Revealed;

    if (guess === currentWord) {
      setGuessInput("");
      setFeedback("correct");
      if (activeTargetIndex === WORD_COUNT - 1) {
        setTimeout(() => {
          setFeedback(null);
          setFinishOrder((prev) => (prev.includes(finisher) ? prev : [...prev, finisher]));
        }, 600);
      } else {
        setTimeout(() => {
          setTargetIndex((i) => i + 1);
          setRevealed(1);
          setFeedback(null);
        }, 500);
      }
    } else {
      setFeedback("wrong");
      setGuessInput("");
      setTimeout(() => {
        setFeedback(null);
        if (bothStillRacing) {
          setCurrentTurn((t) => (t === "p1" ? "p2" : "p1"));
        }
        // if only one player is still racing, the turn simply stays with them
      }, 650);
    }
  }

  function revealLetter() {
    if (!canReveal) return;
    const setRevealed = currentTurn === "p1" ? setP1Revealed : setP2Revealed;
    setRevealed((c) => Math.min(c + 1, currentWord.length));
    setFeedback(null);
    if (bothStillRacing) {
      setTimeout(() => {
        setCurrentTurn((t) => (t === "p1" ? "p2" : "p1"));
      }, 400);
    }
  }

  const displayPattern = useMemo(() => {
    if (!currentWord) return "";
    return currentWord
      .slice(0, activeRevealed)
      .toUpperCase()
      .split("")
      .join(" ");
  }, [currentWord, activeRevealed]);

  let theme = NEUTRAL_THEME;
  if (phase === "setup-p1") theme = P1_THEME;
  else if (phase === "setup-p2") theme = P2_THEME;
  else if (phase === "play") theme = currentTurn === "p1" ? P1_THEME : P2_THEME;
  else if (phase === "results") theme = finishOrder[0] === "p1" ? P1_THEME : P2_THEME;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, transition: "background 0.25s ease" }}>
      <nav className="top-nav" style={{ color: theme.text }}>
        <Link href="/" className="brand" style={{ textDecoration: "none", color: theme.text }}>
          <span className="brand-badge">
            <IconDice size={20} strokeWidth={2.2} />
          </span>
          DelGames
        </Link>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
            <IconTrophy size={14} strokeWidth={2.4} />
            P1 {wins.p1} – {wins.p2} P2
          </span>
          <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
            <IconLink size={14} strokeWidth={2.4} />
            Word Streak
          </span>
        </div>
      </nav>

      <main className="page" style={{ maxWidth: 640, color: theme.text }}>
        {phase === "setup-p1" && (
          <SetupPhase
            playerLabel="Player 1"
            PlayerIcon={IconUser}
            words={p1Words}
            updateWord={(i, v) => updateWord(setP1Words, i, v)}
            onSubmit={submitP1Setup}
            error={setupError}
            theme={theme}
          />
        )}

        {phase === "handoff-1" && (
          <HandoffPhase
            heading="Player 1's chain is locked in"
            body="Pass the device to Player 2. Build your own secret 5-word chain — Player 1 won't see it."
            buttonLabel="I'm Player 2"
            onReady={() => setPhase("setup-p2")}
          />
        )}

        {phase === "setup-p2" && (
          <SetupPhase
            playerLabel="Player 2"
            PlayerIcon={IconUser}
            words={p2Words}
            updateWord={(i, v) => updateWord(setP2Words, i, v)}
            onSubmit={submitP2Setup}
            error={setupError}
            theme={theme}
          />
        )}

        {phase === "handoff-2" && (
          <HandoffPhase
            heading="Both chains are set"
            body={`${starter === "p1" ? "Player 1" : "Player 2"} starts this round — guess the opening word, then race down each other's chains. A wrong guess or a letter reveal passes the turn.`}
            buttonLabel="Start the race"
            onReady={beginPlay}
          />
        )}

        {phase === "play" && (
          <PlayPhase
            currentTurn={currentTurn}
            p1Words={p1Words}
            p2Words={p2Words}
            p1TargetIndex={p1TargetIndex}
            p2TargetIndex={p2TargetIndex}
            p1Revealed={p1Revealed}
            p2Revealed={p2Revealed}
            finishOrder={finishOrder}
            displayPattern={displayPattern}
            guessInput={guessInput}
            setGuessInput={setGuessInput}
            onGuess={submitGuess}
            onReveal={revealLetter}
            canReveal={canReveal}
            feedback={feedback}
          />
        )}

        {phase === "results" && (
          <ResultsPhase finishOrder={finishOrder} wins={wins} onReplay={resetAll} />
        )}
      </main>
    </div>
  );
}

export function SetupPhase({ playerLabel, PlayerIcon, words, updateWord, onSubmit, error, theme }) {
  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
        <span
          style={{
            width: "2.6rem",
            height: "2.6rem",
            borderRadius: "12px",
            border: "var(--border-w) solid var(--ink)",
            background: "var(--panel)",
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlayerIcon size={20} strokeWidth={2.2} />
        </span>
        <h1 style={{ fontSize: "1.8rem" }}>{playerLabel}: build your chain</h1>
      </div>
      <p style={{ opacity: 0.9, marginBottom: "1.5rem", lineHeight: 1.5 }}>
        Think of 5 words where each one connects to the next (like{" "}
        <em>home → work → out → side → men</em>). Your opponent will race to
        guess these — keep the device away from their eyes.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
      >
        {words.map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div
              className="pill"
              style={{
                background: "var(--panel)",
                color: "var(--ink)",
                minWidth: "2.2rem",
                justifyContent: "center",
                padding: "0.3rem 0.6rem",
              }}
            >
              {i + 1}
            </div>
            <input
              className="block-input"
              value={w}
              onChange={(e) => updateWord(i, e.target.value)}
              placeholder={i === 0 ? "Starting word (fully shown)" : "Next word in the chain"}
              maxLength={20}
              autoComplete="off"
            />
          </div>
        ))}

        {error && (
          <p style={{ color: "var(--ink)", background: "var(--yellow)", padding: "0.5rem 0.8rem", borderRadius: 10, fontWeight: 700, border: "var(--border-w) solid var(--ink)" }}>
            {error}
          </p>
        )}

        <button type="submit" className="block-btn" style={{ marginTop: "0.6rem", background: "var(--panel)" }}>
          Lock it in
          <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
        </button>
      </form>
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
          borderRadius: "14px",
          border: "var(--border-w) solid var(--ink)",
          background: "var(--yellow)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconUsers size={24} strokeWidth={2.2} />
      </span>
      <h1 style={{ fontSize: "1.6rem" }}>{heading}</h1>
      <p style={{ opacity: 0.8, maxWidth: 440 }}>{body}</p>
      <button className="block-btn teal" onClick={onReady}>
        {buttonLabel}
        <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
      </button>
    </section>
  );
}

function PlayPhase({
  currentTurn,
  p1Words,
  p2Words,
  p1TargetIndex,
  p2TargetIndex,
  p1Revealed,
  p2Revealed,
  finishOrder,
  displayPattern,
  guessInput,
  setGuessInput,
  onGuess,
  onReveal,
  canReveal,
  feedback,
}) {
  const p1Done = finishOrder.includes("p1");
  const p2Done = finishOrder.includes("p2");
  const soloMode = finishOrder.length === 1;

  let bannerText;
  if (soloMode) {
    const finishedLabel = finishOrder[0] === "p1" ? "Player 1" : "Player 2";
    const stillGoingLabel = currentTurn === "p1" ? "Player 1" : "Player 2";
    bannerText = `${finishedLabel} finished! ${stillGoingLabel} is finishing their chain.`;
  } else {
    bannerText = `${currentTurn === "p1" ? "Player 1" : "Player 2"}'s turn — guessing the other chain`;
  }

  return (
    <section>
      <div
        className="pill"
        style={{
          background: "var(--panel)",
          color: "var(--ink)",
          marginBottom: "1.6rem",
          fontWeight: 800,
        }}
      >
        <IconTarget size={15} strokeWidth={2.4} />
        {bannerText}
      </div>

      {/* Persistent progress for both players — always visible so each can keep
          thinking about their chain, even when it isn't their turn. Safe to show:
          each player already knows the chain they wrote themselves. */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "1.8rem" }}>
        <ChainProgress
          label="Player 1"
          active={currentTurn === "p1" && !soloMode}
          finished={p1Done}
          words={p2Words}
          targetIndex={p1TargetIndex}
          revealed={p1Revealed}
        />
        <ChainProgress
          label="Player 2"
          active={currentTurn === "p2" && !soloMode}
          finished={p2Done}
          words={p1Words}
          targetIndex={p2TargetIndex}
          revealed={p2Revealed}
        />
      </div>

      <div
        className="block"
        style={{
          padding: "2rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "1.4rem",
          alignItems: "center",
          color: "var(--ink)",
        }}
      >
        <div
          style={{
            fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
            fontWeight: 800,
            letterSpacing: "0.12em",
            minHeight: "3rem",
          }}
        >
          {displayPattern}
        </div>

        {feedback === "wrong" && (
          <p style={{ color: "var(--red)", fontWeight: 700 }}>
            Not quite{finishOrder.length === 0 ? " — turn passes." : ", try again."}
          </p>
        )}
        {feedback === "correct" && (
          <p style={{ color: "var(--green)", fontWeight: 800, fontSize: "1.2rem" }}>Got it!</p>
        )}

        <form onSubmit={onGuess} style={{ width: "100%", display: "flex", gap: "0.6rem" }}>
          <input
            className="block-input"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            placeholder="Type your guess..."
            autoComplete="off"
            autoFocus
          />
          <button type="submit" className="block-btn blue" style={{ whiteSpace: "nowrap" }}>
            Guess
          </button>
        </form>

        <button
          type="button"
          className="block-btn secondary"
          onClick={onReveal}
          disabled={!canReveal}
        >
          {canReveal ? (
            <>
              <IconEye size={16} strokeWidth={2.4} style={{ marginRight: "0.4rem", verticalAlign: "-3px" }} />
              Reveal a letter{finishOrder.length === 0 ? " (ends turn)" : ""}
            </>
          ) : (
            <>
              <IconLock size={16} strokeWidth={2.4} style={{ marginRight: "0.4rem", verticalAlign: "-3px" }} />
              No hints left — take the guess
            </>
          )}
        </button>
      </div>
    </section>
  );
}

export function ChainProgress({ label, active, finished, words, targetIndex, revealed }) {
  return (
    <div
      className="pill"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.5rem",
        background: active ? "var(--panel)" : "rgba(255,255,255,0.3)",
        color: "var(--ink)",
        boxShadow: active ? "3px 3px 0 var(--ink)" : "none",
        padding: "0.6rem 0.9rem",
        width: "100%",
        justifyContent: "flex-start",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 800, marginRight: "0.3rem" }}>
        <IconUser size={14} strokeWidth={2.4} />
        {label}
        {finished && <IconCheck size={14} strokeWidth={3} style={{ color: "var(--green)" }} />}
      </span>
      {words.map((w, i) => {
        const solved = i < targetIndex;
        const isCurrent = i === targetIndex;
        const given = i === 0;
        let text;
        if (solved || given) {
          text = w.toUpperCase();
        } else if (isCurrent) {
          text = `${w.slice(0, revealed).toUpperCase()}…`;
        } else {
          text = `${w[0].toUpperCase()}…`;
        }
        return (
          <span
            key={i}
            style={{
              fontWeight: 700,
              fontSize: "0.85rem",
              padding: "0.15rem 0.5rem",
              borderRadius: 8,
              border: "2px solid var(--ink)",
              background: solved || given ? "var(--yellow)" : "var(--panel)",
              opacity: isCurrent ? 1 : 0.85,
            }}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
}

export function ResultsPhase({ finishOrder, wins, onReplay }) {
  const winnerLabel = finishOrder[0] === "p1" ? "Player 1" : "Player 2";
  const runnerUpLabel = finishOrder[1] === "p1" ? "Player 1" : "Player 2";
  return (
    <section
      className="block"
      style={{
        padding: "2.5rem 2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "1.4rem",
        alignItems: "center",
        color: "var(--ink)",
      }}
    >
      <span
        style={{
          width: "3.6rem",
          height: "3.6rem",
          borderRadius: "14px",
          border: "var(--border-w) solid var(--ink)",
          background: "var(--yellow)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconTrophy size={26} strokeWidth={2.2} />
      </span>
      <h1 style={{ fontSize: "1.8rem" }}>{winnerLabel} wins the round!</h1>
      <p style={{ opacity: 0.75 }}>
        {winnerLabel} finished first. {runnerUpLabel} completed their chain too.
      </p>

      <div
        className="pill"
        style={{ background: "var(--yellow)", color: "var(--ink)", fontWeight: 800 }}
      >
        <IconTrophy size={14} strokeWidth={2.4} />
        Total wins — P1 {wins.p1} – {wins.p2} P2
      </div>

      <button className="block-btn purple" onClick={onReplay}>
        <IconRefresh size={16} strokeWidth={2.4} style={{ marginRight: "0.5rem", verticalAlign: "-3px" }} />
        Play again
      </button>
    </section>
  );
}
