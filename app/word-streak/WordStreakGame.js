"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const WORD_COUNT = 5;
const WORD_COLORS = ["var(--pink)", "var(--orange)", "var(--yellow)", "var(--teal)", "var(--blue)"];

function emptyWords() {
  return Array.from({ length: WORD_COUNT }, () => "");
}

function emptyStats() {
  return Array.from({ length: WORD_COUNT }, () => ({ reveals: 0, misses: 0 }));
}

export default function WordStreakGame() {
  const [phase, setPhase] = useState("setup"); // setup -> handoff -> play -> results
  const [words, setWords] = useState(emptyWords());
  const [setupError, setSetupError] = useState("");

  const [wordIndex, setWordIndex] = useState(1); // guesser starts on word 2 (index 1); word 0 is given
  const [revealedCount, setRevealedCount] = useState(1); // letters revealed for current word, starts at 1 (first letter)
  const [guessInput, setGuessInput] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: 'wrong' | 'correct' }
  const [stats, setStats] = useState(emptyStats());

  const currentWord = words[wordIndex] || "";
  const isLastLetterLeft = currentWord.length - revealedCount <= 1;

  function updateWord(i, value) {
    const clean = value.replace(/[^a-zA-Z]/g, "").toLowerCase();
    setWords((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
  }

  function startPlay() {
    for (let i = 0; i < WORD_COUNT; i++) {
      if (!words[i] || words[i].trim().length < 1) {
        setSetupError(`Word ${i + 1} needs at least one letter.`);
        return;
      }
    }
    setSetupError("");
    setPhase("handoff");
  }

  function beginGuessing() {
    setWordIndex(1);
    setRevealedCount(1);
    setGuessInput("");
    setFeedback(null);
    setStats(emptyStats());
    setPhase("play");
  }

  function submitGuess(e) {
    e.preventDefault();
    const guess = guessInput.trim().toLowerCase();
    if (!guess) return;

    if (guess === currentWord) {
      setFeedback({ type: "correct" });
      setGuessInput("");
      if (wordIndex === WORD_COUNT - 1) {
        setTimeout(() => setPhase("results"), 500);
      } else {
        setTimeout(() => {
          setWordIndex((i) => i + 1);
          setRevealedCount(1);
          setFeedback(null);
        }, 500);
      }
    } else {
      setStats((prev) => {
        const next = prev.map((s) => ({ ...s }));
        next[wordIndex].misses += 1;
        return next;
      });
      setFeedback({ type: "wrong" });
      setGuessInput("");
    }
  }

  function revealLetter() {
    if (isLastLetterLeft) return;
    setStats((prev) => {
      const next = prev.map((s) => ({ ...s }));
      next[wordIndex].reveals += 1;
      return next;
    });
    setRevealedCount((c) => Math.min(c + 1, currentWord.length));
    setFeedback(null);
  }

  function resetAll() {
    setWords(emptyWords());
    setStats(emptyStats());
    setWordIndex(1);
    setRevealedCount(1);
    setGuessInput("");
    setFeedback(null);
    setSetupError("");
    setPhase("setup");
  }

  const displayPattern = useMemo(() => {
    if (!currentWord) return "";
    return currentWord
      .split("")
      .map((ch, i) => (i < revealedCount ? ch.toUpperCase() : "_"))
      .join(" ");
  }, [currentWord, revealedCount]);

  return (
    <>
      <nav className="top-nav">
        <Link href="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="brand-badge">🎲</span>
          DelGames
        </Link>
        <span className="pill" style={{ background: "var(--teal)" }}>
          🔗 Word Streak
        </span>
      </nav>

      <main className="page" style={{ maxWidth: 640 }}>
        {phase === "setup" && (
          <SetupPhase
            words={words}
            updateWord={updateWord}
            onSubmit={startPlay}
            error={setupError}
          />
        )}

        {phase === "handoff" && (
          <HandoffPhase firstWord={words[0]} onReady={beginGuessing} />
        )}

        {phase === "play" && (
          <PlayPhase
            words={words}
            wordIndex={wordIndex}
            displayPattern={displayPattern}
            guessInput={guessInput}
            setGuessInput={setGuessInput}
            onGuess={submitGuess}
            onReveal={revealLetter}
            canReveal={!isLastLetterLeft}
            feedback={feedback}
          />
        )}

        {phase === "results" && (
          <ResultsPhase words={words} stats={stats} onReplay={resetAll} />
        )}
      </main>
    </>
  );
}

function SetupPhase({ words, updateWord, onSubmit, error }) {
  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Build your chain 🔗</h1>
      <p style={{ opacity: 0.8, marginBottom: "1.5rem", lineHeight: 1.5 }}>
        Player 1: think of 5 words where each one connects to the next (like{" "}
        <em>home → work → out → side → men</em>). Your partner will only see
        the first word and the first letters of the rest — they'll guess or
        reveal letters to work through the chain.
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
                background: WORD_COLORS[i],
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
          <p style={{ color: "var(--red)", fontWeight: 700 }}>{error}</p>
        )}

        <button type="submit" className="block-btn pink" style={{ marginTop: "0.6rem" }}>
          Lock it in →
        </button>
      </form>
    </section>
  );
}

function HandoffPhase({ firstWord, onReady }) {
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
      }}
    >
      <div style={{ fontSize: "2.5rem" }}>🤫</div>
      <h1 style={{ fontSize: "1.6rem" }}>Chain locked in!</h1>
      <p style={{ opacity: 0.8, maxWidth: 420 }}>
        Pass the device to Player 2. They'll see the first word,{" "}
        <strong>{firstWord.toUpperCase()}</strong>, plus the first letter of
        every word after it — then guess or reveal their way down the chain.
      </p>
      <button className="block-btn teal" onClick={onReady}>
        I'm Player 2, let's go →
      </button>
    </section>
  );
}

function PlayPhase({
  words,
  wordIndex,
  displayPattern,
  guessInput,
  setGuessInput,
  onGuess,
  onReveal,
  canReveal,
  feedback,
}) {
  return (
    <section>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.8rem", flexWrap: "wrap" }}>
        {words.map((w, i) => {
          const solved = i < wordIndex;
          const active = i === wordIndex;
          const given = i === 0;
          return (
            <div
              key={i}
              className="pill"
              style={{
                background: solved || given ? WORD_COLORS[i] : "var(--panel)",
                borderStyle: active ? "solid" : "solid",
                fontWeight: 800,
                opacity: active ? 1 : solved || given ? 0.9 : 0.5,
                boxShadow: active ? "3px 3px 0 var(--ink)" : "none",
              }}
            >
              {solved || given ? w.toUpperCase() : `${w[0].toUpperCase()}…`}
            </div>
          );
        })}
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
        }}
      >
        <span style={{ fontWeight: 700, opacity: 0.6 }}>
          Word {wordIndex + 1} of {words.length}
        </span>

        <div
          style={{
            fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
            fontWeight: 800,
            letterSpacing: "0.12em",
          }}
        >
          {displayPattern}
        </div>

        {feedback?.type === "wrong" && (
          <p style={{ color: "var(--red)", fontWeight: 700 }}>Not quite — try again!</p>
        )}
        {feedback?.type === "correct" && (
          <p style={{ color: "var(--green)", fontWeight: 800, fontSize: "1.2rem" }}>
            Got it! 🎉
          </p>
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
          {canReveal ? "Reveal a letter 🔍" : "One letter left — take the guess!"}
        </button>
      </div>
    </section>
  );
}

function ResultsPhase({ words, stats, onReplay }) {
  const totalReveals = stats.slice(1).reduce((sum, s) => sum + s.reveals, 0);
  const totalMisses = stats.slice(1).reduce((sum, s) => sum + s.misses, 0);
  const perfectWords = stats.slice(1).filter((s) => s.reveals === 0 && s.misses === 0).length;

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
      }}
    >
      <div style={{ fontSize: "2.5rem" }}>🏁</div>
      <h1 style={{ fontSize: "1.8rem" }}>Chain complete!</h1>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        {words.map((w, i) => (
          <span key={i} className="pill" style={{ background: WORD_COLORS[i], fontWeight: 800 }}>
            {w.toUpperCase()}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.8rem",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <StatBlock label="Perfect words" value={`${perfectWords}/4`} color="var(--green)" />
        <StatBlock label="Letters revealed" value={totalReveals} color="var(--yellow)" />
        <StatBlock label="Wrong guesses" value={totalMisses} color="var(--pink)" />
      </div>

      <button className="block-btn purple" onClick={onReplay}>
        Play again ↻
      </button>
    </section>
  );
}

function StatBlock({ label, value, color }) {
  return (
    <div className="block" style={{ padding: "1rem 0.5rem", background: color }}>
      <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.75 }}>{label}</div>
    </div>
  );
}
