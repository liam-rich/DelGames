"use client";

import { useMemo, useState } from "react";
import RoomConnect, { WaitingBanner } from "../components/RoomConnect";
import { ChangeModeLink } from "../components/PlayModeSelect";
import { IconUser, IconTarget, IconEye, IconLock } from "../icons";
import { SetupPhase, ChainProgress, ResultsPhase } from "./WordStreakGame";

const P1_THEME = { bg: "var(--blue)", text: "var(--paper)" };
const P2_THEME = { bg: "var(--pink)", text: "var(--ink)" };
const NEUTRAL_THEME = { bg: "var(--paper)", text: "var(--ink)" };

export default function WordStreakOnline({ onChangeMode }) {
  return (
    <RoomConnect gameSlug="word-streak">
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
    try {
      await dispatch({ type: "GUESS", seat, guess: guessInput });
      setGuessInput("");
    } catch {
      // rejected (not your turn, etc.) — error surfaced via room error banner
    }
  }

  async function revealLetter() {
    try {
      await dispatch({ type: "REVEAL", seat });
    } catch {
      // ignore — surfaced via error banner
    }
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
    <div style={{ minHeight: "100vh", background: theme.bg, margin: "-2.5rem -1.5rem -4rem", padding: "2.5rem 1.5rem 4rem", transition: "background 0.25s ease" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", color: theme.text }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.6rem" }}>
          <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
            <IconUser size={13} strokeWidth={2.4} />
            You are {myLabel} · room {code}
          </span>
          <ChangeModeLink onClick={onChangeMode} label="Leave / change mode" />
        </div>

        {error && (
          <p style={{ color: "var(--ink)", background: "var(--yellow)", padding: "0.5rem 0.8rem", borderRadius: 10, fontWeight: 700, border: "var(--border-w) solid var(--ink)", marginBottom: "1rem" }}>
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

function OnlinePlay({ seat, state, guessInput, setGuessInput, onGuess, onReveal }) {
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
      <div className="pill" style={{ background: "var(--panel)", color: "var(--ink)", marginBottom: "1.6rem", fontWeight: 800 }}>
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
          <div style={{ fontSize: "clamp(1.8rem, 6vw, 2.6rem)", fontWeight: 800, letterSpacing: "0.12em", minHeight: "3rem" }}>
            {displayPattern}
          </div>

          {state.lastEvent?.by === seat && state.lastEvent?.type === "wrong" && (
            <p style={{ color: "var(--red)", fontWeight: 700 }}>Not quite{finishOrder.length === 0 ? " — turn passes." : ", try again."}</p>
          )}
          {state.lastEvent?.by === seat && state.lastEvent?.type === "correct" && (
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

          <button type="button" className="block-btn secondary" onClick={onReveal} disabled={!canReveal}>
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
