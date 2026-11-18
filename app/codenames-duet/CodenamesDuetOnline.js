"use client";

import { useEffect, useRef, useState } from "react";
import RoomConnect, { WaitingBanner } from "../components/RoomConnect";
import { ChangeModeLink } from "../components/PlayModeSelect";
import { IconUser } from "../icons";
import { other } from "../../lib/engines/codenamesDuet";
import {
  BriefingPhase,
  BoardGrid,
  ClueHistory,
  GiveCluePhase,
  GuessPhase,
  Legend,
  MissionStatus,
  ResultsPhase,
  SuddenPhase,
  seatName,
} from "./CodenamesDuetGame";

const WASH = { p1: "var(--wash-p1)", p2: "var(--wash-p2)", neutral: "var(--wash)", won: "var(--wash-win)", lost: "var(--wash-lose)" };

export default function CodenamesDuetOnline({ onChangeMode }) {
  return (
    <RoomConnect onBack={onChangeMode} gameSlug="codenames-duet">
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
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  // One request at a time: a double tap must not send two guesses.
  async function send(action) {
    if (sending.current) return null;
    sending.current = true;
    setBusy(true);
    try {
      return await dispatch(action);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  if (!state) return <WaitingBanner>Connecting…</WaitingBanner>;

  const guesser = other(state.activeGiver);

  async function submitClue(e) {
    e.preventDefault();
    try {
      await send({ type: "GIVE_CLUE", seat, word: clueWord, number: clueNumber });
      setClueError("");
      setClueWord("");
      setClueNumber(2);
    } catch (err) {
      setClueError(err.message);
    }
  }

  const quiet = (action) => send(action).catch(() => {});

  let wash = WASH.neutral;
  let body = null;

  if (state.phase === "lobby") {
    body = <BriefingPhase onStart={() => quiet({ type: "DEAL" })} />;
  } else if (state.phase === "clue" && seat === state.activeGiver) {
    wash = WASH[seat];
    body = (
      <GiveCluePhase
        giver={seat}
        game={state.game}
        clueWord={clueWord}
        setClueWord={setClueWord}
        clueNumber={clueNumber}
        setClueNumber={setClueNumber}
        error={clueError}
        onSubmit={submitClue}
        clueLog={state.clueLog}
      />
    );
  } else if (state.phase === "guess" && seat === guesser) {
    wash = WASH[seat];
    body = (
      <GuessPhase
        guesser={seat}
        game={state.game}
        activeClue={state.activeClue}
        guessesLeft={state.guessesLeft}
        guessesMade={state.guessesMade}
        lastGuess={state.lastGuess}
        locked={busy}
        onGuess={(index) => quiet({ type: "GUESS_TILE", seat, index })}
        onStop={() => quiet({ type: "STOP_GUESSING", seat })}
        clueLog={state.clueLog}
      />
    );
  } else if (state.phase === "sudden") {
    wash = WASH[seat];
    body = (
      <SuddenPhase
        seat={seat}
        game={state.game}
        lastGuess={state.lastGuess}
        locked={busy}
        onTouch={(index) => quiet({ type: "GUESS_TILE", seat, index })}
      />
    );
  } else if (state.phase === "results") {
    wash = state.outcome?.result === "won" ? WASH.won : WASH.lost;
    body = <ResultsPhase outcome={state.outcome} game={state.game} agentsFound={state.agentsFound} onReplay={() => quiet({ type: "PLAY_AGAIN" })} />;
  } else {
    // Waiting on your partner: keep the live board and your own key in view.
    const waitingOn = state.phase === "clue" ? state.activeGiver : guesser;
    body = (
      <section className="cd-stack">
        <WaitingBanner>
          {state.phase === "clue"
            ? `${seatName(waitingOn)} is thinking of a clue…`
            : `${seatName(waitingOn)} is guessing ${state.activeClue.word} ${state.activeClue.number}…`}
        </WaitingBanner>
        <Legend />
        <BoardGrid game={state.game} viewKey={seat} lastIndex={state.lastGuess?.index} />
        <ClueHistory clueLog={state.clueLog} />
      </section>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: wash, padding: "calc(1.25rem + env(safe-area-inset-top)) 1rem 3rem", transition: "background 0.25s ease" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.6rem" }}>
          <span className="pill">
            <IconUser size={13} strokeWidth={2.4} />
            {seatName(seat)} · room {code}
          </span>
          <ChangeModeLink onClick={onChangeMode} label="Leave" />
        </div>
        {state.game && state.phase !== "results" && <MissionStatus state={state} />}
        {body}
      </div>
    </div>
  );
}
