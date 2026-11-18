"use client";

import { useMemo, useRef, useState } from "react";
import RoomConnect, { WaitingBanner } from "../components/RoomConnect";
import { ChangeModeLink } from "../components/PlayModeSelect";
import { IconUser, IconTarget, IconEye, IconLock } from "../icons";
import { SetupPhase, ChainProgress, ResultsPhase } from "./WordStreakGame";

const P1_THEME = { bg: "var(--wash-p1)", text: "var(--ink)" };
const P2_THEME = { bg: "var(--wash-p2)", text: "var(--ink)" };
const NEUTRAL_THEME = { bg: "var(--wash)", text: "var(--ink)" };

export default function WordStreakOnline({ onChangeMode }) {
  return (
    <RoomConnect onBack={onChangeMode} gameSlug="word-streak">
      {({ code, seat, state, dispatch, error, leaveRoom }) => (
        <Inner code={code} seat={seat} state={state} dispatch={dispatch} error={error} leaveRoom={leaveRoom} onChangeMode={onChangeMode} />
      )}
    </RoomConnect>
  );
}

function Inner({ code, seat, state, dispatch, error, leaveRoom, onChangeMode }) {
  const [words, setWords] = useState(["", "", "", "", ""]);
  const [setupError, setSetupError] = useState("");
  const [guessInput, setGuessInput] = useState("");
  // One move in flight at a time: a double tap after a correct guess would
  // otherwise be checked against the next word and pass the turn.
  const sending = useRef(false);
  const [busy, setBusy] = useState(false);
  async function once(fn) {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    try {
      await fn();
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  if (!state) {
    return <WaitingBanner>Connecting…</WaitingBanner>;
  }

  const mySubmitted = seat === "p1" ? Boolean(state.p1Words) : Boolean(state.p2Words);
  const otherLabel = seat === "p1" ? "Player 2" : "Player 1";
  const myLabel = seat === "p1" ? "Player 1" : "Player 2";

  function updateWord(i, value) {
    const clean = value.replace(/[^a-zA-Z]/g, "").toLowerCase();
    setWords((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
  }

  async function submitWords() {
    try {
      await dispatch({ type: "SUBMIT_WORDS", seat, words });
      setSetupError("");
    } catch (err) {
      setSetupError(err.message);
    }
  }

  async function submitGuess(e) {
    e.preventDefault();
    if (!guessInput.trim()) return;
    await once(async () => {
      try {
        await dispatch({ type: "GUESS", seat, guess: guessInput });
        setGuessInput("");
      } catch {
        // rejected (not your turn, etc.) — error surfaced via room error banner
      }
    });
  }

  async function revealLetter() {
    await once(async () => {
      try {
        await dispatch({ type: "REVEAL", seat });
      } catch {
        // ignore — surfaced via error banner
      }
    });
  }

  async function playAgain() {
    try {
      await dispatch({ type: "PLAY_AGAIN" });
    } catch {
      // ignore
    }
  }

  const finishOrder = state.finishOrder || [];
  const soloMode = finishOrder.length === 1;
  const roundOver = finishOrder.length === 2;

  let theme = NEUTRAL_THEME;
  if (!state.playing) theme = seat === "p1" ? P1_THEME : P2_THEME;
  else if (state.playing && !roundOver) {
    const actingSeat = soloMode ? (finishOrder[0] === "p1" ? "p2" : "p1") : state.currentTurn;
    theme = actingSeat === "p1" ? P1_THEME : P2_THEME;
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: "calc(1.25rem + env(safe-area-inset-top)) 1rem 3rem", transition: "background 0.25s ease" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", color: theme.text }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.6rem" }}>
          <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
            <IconUser size={13} strokeWidth={2.4} />
            You are {myLabel} · room {code}
          </span>
          <ChangeModeLink onClick={onChangeMode} label="Leave / change mode" />
        </div>

        {error && (
          <p style={{ color: "var(--ink-dark)", background: "var(--yellow)", padding: "0.5rem 0.8rem", borderRadius: 0, fontWeight: 700, border: "var(--border-w) solid var(--frame)", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        {!state.playing && !mySubmitted && (
          <SetupPhase
            playerLabel={myLabel}
            PlayerIcon={IconUser}
            words={words}
            updateWord={updateWord}
            onSubmit={submitWords}
            error={setupError}
            theme={theme}
          />
        )}

        {!state.playing && mySubmitted && (
          <WaitingBanner>Waiting for {otherLabel} to build their chain…</WaitingBanner>
        )}

        {state.playing && !roundOver && (
          <OnlinePlay
            busy={busy}
            seat={seat}
            state={state}
            guessInput={guessInput}
            setGuessInput={setGuessInput}
            onGuess={submitGuess}
            onReveal={revealLetter}
          />
        )}

        {roundOver && <ResultsPhase finishOrder={finishOrder} wins={state.wins} onReplay={playAgain} />}
      </div>
    </div>
  );
}

function OnlinePlay({ seat, state, guessInput, setGuessInput, onGuess, onReveal, busy }) {
  const finishOrder = state.finishOrder || [];
  const soloMode = finishOrder.length === 1;
  const actingSeat = soloMode ? (finishOrder[0] === "p1" ? "p2" : "p1") : state.currentTurn;
  const isMyTurn = seat === actingSeat;

  const p1Done = finishOrder.includes("p1");
  const p2Done = finishOrder.includes("p2");

  const activeTargetWords = actingSeat === "p1" ? state.p2Words : state.p1Words;
  const activeTargetIndex = actingSeat === "p1" ? state.p1TargetIndex : state.p2TargetIndex;
  const activeRevealed = actingSeat === "p1" ? state.p1Revealed : state.p2Revealed;
  const currentWord = activeTargetWords[activeTargetIndex] || "";
  const canReveal = currentWord.length - activeRevealed > 1;

  const displayPattern = useMemo(() => {
    if (!currentWord) return "";
    return currentWord.slice(0, activeRevealed).toUpperCase().split("").join(" ");
  }, [currentWord, activeRevealed]);

  let bannerText;
  if (soloMode) {
    const finishedLabel = finishOrder[0] === "p1" ? "Player 1" : "Player 2";
    const stillGoingLabel = actingSeat === "p1" ? "Player 1" : "Player 2";
    bannerText = `${finishedLabel} finished! ${stillGoingLabel} is finishing their chain.`;
  } else {
    bannerText = `${actingSeat === "p1" ? "Player 1" : "Player 2"}'s turn — guessing the other chain`;
  }

  return (
    <section>
      <div className={`turn-banner ${actingSeat}`}>
        <IconTarget size={15} strokeWidth={2.4} />
        {bannerText}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "1.8rem" }}>
        <ChainProgress
          label="Player 1"
          active={actingSeat === "p1" && !soloMode}
          finished={p1Done}
          words={state.p2Words}
          targetIndex={state.p1TargetIndex}
          revealed={state.p1Revealed}
        />
        <ChainProgress
          label="Player 2"
          active={actingSeat === "p2" && !soloMode}
          finished={p2Done}
          words={state.p1Words}
          targetIndex={state.p2TargetIndex}
          revealed={state.p2Revealed}
        />
      </div>

      {isMyTurn ? (
        <div className="block" style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "1.4rem", alignItems: "center", color: "var(--ink)" }}>
          <p className="eyebrow">Word {Math.min(activeTargetIndex + 1, 5)} of 5</p>
          <div className="tile-row">
            {displayPattern.split(" ").filter(Boolean).map((ch, i) => (
              <span key={`${activeTargetIndex}-${i}`} className="tile" style={{ "--i": i }}>
                {ch}
              </span>
            ))}
            <span className="tile ghost">?</span>
          </div>
          <p className={`arcade-feedback ${state.lastEvent?.by === seat ? state.lastEvent.type : "idle"}`}>
            {state.lastEvent?.by === seat && state.lastEvent?.type === "wrong" && `Not quite${finishOrder.length === 0 ? " — turn passes" : " — try again"}`}
            {state.lastEvent?.by === seat && state.lastEvent?.type === "correct" && "Got it!"}
            {!(state.lastEvent?.by === seat && ["wrong", "correct"].includes(state.lastEvent?.type)) && "\u00a0"}
          </p>

          <form onSubmit={onGuess} style={{ width: "100%", display: "flex", gap: "0.6rem" }}>
            <input
              className="block-input"
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              placeholder="Type your guess..."
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
            />
            <button type="submit" className="block-btn blue" style={{ whiteSpace: "nowrap" }} disabled={busy || !guessInput.trim()}>
              Guess
            </button>
          </form>

          <button type="button" className="block-btn secondary" onClick={onReveal} disabled={!canReveal || busy}>
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
      ) : (
        <WaitingBanner>Waiting for the other player's move…</WaitingBanner>
      )}
    </section>
  );
}
