"use client";

import { useState } from "react";
import RoomConnect, { WaitingBanner } from "../components/RoomConnect";
import { ChangeModeLink } from "../components/PlayModeSelect";
import { IconUser } from "../icons";
import {
  BriefingPhase,
  GiveCluePhase,
  GuessPhase,
  ResultsPhase,
} from "./CodenamesDuetGame";

const P1_THEME = { bg: "var(--blue)", text: "var(--paper)" };
const P2_THEME = { bg: "var(--pink)", text: "var(--ink)" };
const NEUTRAL_THEME = { bg: "var(--paper)", text: "var(--ink)" };
const WIN_THEME = { bg: "var(--green)", text: "var(--ink)" };
const LOSE_THEME = { bg: "var(--red)", text: "var(--paper)" };

export default function CodenamesDuetOnline({ onChangeMode }) {
  return (
    <RoomConnect gameSlug="codenames-duet">
      {({ code, seat, state, dispatch, error, leaveRoom }) => (
        <Inner code={code} seat={seat} state={state} dispatch={dispatch} error={error} leaveRoom={leaveRoom} onChangeMode={onChangeMode} />
      )}
    </RoomConnect>
  );
}

function Inner({ code, seat, state, dispatch, onChangeMode }) {
  const [clueWord, setClueWord] = useState("");
  const [clueNumber, setClueNumber] = useState(2);
  const [clueError, setClueError] = useState("");
  const [guessFeedback, setGuessFeedback] = useState(null);

  if (!state) {
    return <WaitingBanner>Connecting…</WaitingBanner>;
  }

  const myLabel = seat === "p1" ? "Player 1" : "Player 2";
  const guesserSeat = state.activeGiver === "p1" ? "p2" : "p1";

  async function dealBoard() {
    try {
      await dispatch({ type: "DEAL" });
    } catch {
      // ignore — another device likely already dealt it
    }
  }

  async function submitClue(e) {
    e.preventDefault();
    try {
      await dispatch({ type: "GIVE_CLUE", seat, word: clueWord, number: clueNumber });
      setClueError("");
      setClueWord("");
      setClueNumber(2);
    } catch (err) {
      setClueError(err.message);
    }
  }

  async function guessTile(index) {
    if (guessFeedback) return;
    try {
      const room = await dispatch({ type: "GUESS_TILE", seat, index });
      const truth = room.state.game.revealed[index];
      setGuessFeedback(truth);
      setTimeout(() => setGuessFeedback(null), 700);
    } catch {
      // ignore — not your turn / already revealed
    }
  }

  async function stopGuessing() {
    try {
      await dispatch({ type: "STOP_GUESSING", seat });
    } catch {
      // ignore
    }
  }

  async function playAgain() {
    try {
      await dispatch({ type: "PLAY_AGAIN" });
    } catch {
      // ignore
    }
  }

  let theme = NEUTRAL_THEME;
  if (state.phase === "clue") theme = state.activeGiver === "p1" ? P1_THEME : P2_THEME;
  else if (state.phase === "guess") theme = guesserSeat === "p1" ? P1_THEME : P2_THEME;
  else if (state.phase === "results") theme = state.outcome?.result === "won" ? WIN_THEME : LOSE_THEME;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, margin: "-2.5rem -1.5rem -4rem", padding: "2.5rem 1.5rem 4rem", transition: "background 0.25s ease" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", color: theme.text }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.6rem" }}>
          <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
            <IconUser size={13} strokeWidth={2.4} />
            You are {myLabel} · room {code}
          </span>
          <ChangeModeLink onClick={onChangeMode} label="Leave / change mode" />
        </div>

        {state.phase !== "lobby" && state.phase !== "results" && (
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
            <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
              {state.turnsRemaining} turns left
            </span>
            <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
              {state.agentsFound}/15 agents
            </span>
          </div>
        )}

        {state.phase === "lobby" && <BriefingPhase onStart={dealBoard} />}

        {state.phase === "clue" && seat === state.activeGiver && (
          <GiveCluePhase
            giver={state.activeGiver}
            game={state.game}
            clueWord={clueWord}
            setClueWord={setClueWord}
            clueNumber={clueNumber}
            setClueNumber={setClueNumber}
            error={clueError}
            onSubmit={submitClue}
            clueLog={state.clueLog}
          />
        )}
        {state.phase === "clue" && seat !== state.activeGiver && (
          <WaitingBanner>Waiting for {state.activeGiver === "p1" ? "Player 1" : "Player 2"} to give a clue…</WaitingBanner>
        )}

        {state.phase === "guess" && seat === guesserSeat && (
          <GuessPhase
            guesser={guesserSeat}
            game={state.game}
            activeClue={state.activeClue}
            guessesLeft={state.guessesLeft}
            guessFeedback={guessFeedback}
            onGuess={guessTile}
            onStop={stopGuessing}
            clueLog={state.clueLog}
          />
        )}
        {state.phase === "guess" && seat !== guesserSeat && (
          <WaitingBanner>Waiting for {guesserSeat === "p1" ? "Player 1" : "Player 2"} to guess…</WaitingBanner>
        )}

        {state.phase === "results" && (
          <ResultsPhase outcome={state.outcome} game={state.game} agentsFound={state.agentsFound} onReplay={playAgain} />
        )}
      </div>
    </div>
  );
}
