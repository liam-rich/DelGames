"use client";

import { useState } from "react";
import RoomConnect, { WaitingBanner } from "../components/RoomConnect";
import { ChangeModeLink } from "../components/PlayModeSelect";
import { IconUser, IconTrophy } from "../icons";
import {
  playerLabel,
  PlacingPhase,
  EnterCategoryPhase,
  EnterResponsePhase,
  GuessingPhase,
  RevealPhase,
} from "./CategoryScalesGame";
import { TOTAL_ROUNDS } from "../../lib/engines/categoryScales";

const P1_THEME = { bg: "var(--blue)", text: "var(--paper)" };
const P2_THEME = { bg: "var(--pink)", text: "var(--ink)" };
const NEUTRAL_THEME = { bg: "var(--paper)", text: "var(--ink)" };

export default function CategoryScalesOnline({ onChangeMode }) {
  return (
    <RoomConnect gameSlug="wavelength">
      {({ code, seat, state, dispatch, error, leaveRoom }) => (
        <Inner code={code} seat={seat} state={state} dispatch={dispatch} error={error} leaveRoom={leaveRoom} onChangeMode={onChangeMode} />
      )}
    </RoomConnect>
  );
}

function Inner({ code, seat, state, dispatch, onChangeMode }) {
  const [draftMark, setDraftMark] = useState(50);
  const [leftLabel, setLeftLabel] = useState("");
  const [rightLabel, setRightLabel] = useState("");
  const [responseText, setResponseText] = useState("");
  const [guessMark, setGuessMark] = useState(50);
  const [categoryError, setCategoryError] = useState("");
  const [responseError, setResponseError] = useState("");

  if (!state) {
    return <WaitingBanner>Connecting…</WaitingBanner>;
  }

  const guesser = state.placer === "p1" ? "p2" : "p1";
  const myLabel = playerLabel(seat);

  async function confirmPlacement() {
    try {
      await dispatch({ type: "PLACE_MARK", seat, value: draftMark });
    } catch {
      // ignore — surfaced via room error banner
    }
  }

  async function submitCategory(e) {
    e.preventDefault();
    try {
      await dispatch({ type: "SUBMIT_CATEGORY", seat, left: leftLabel, right: rightLabel });
      setCategoryError("");
      setLeftLabel("");
      setRightLabel("");
    } catch (err) {
      setCategoryError(err.message);
    }
  }

  async function submitResponse(e) {
    e.preventDefault();
    try {
      await dispatch({ type: "SUBMIT_RESPONSE", seat, text: responseText });
      setResponseError("");
      setResponseText("");
    } catch (err) {
      setResponseError(err.message);
    }
  }

  async function submitGuess() {
    try {
      await dispatch({ type: "SUBMIT_GUESS", seat, value: guessMark });
    } catch {
      // ignore
    }
  }

  async function playAgain() {
    setDraftMark(50);
    setGuessMark(50);
    try {
      await dispatch({ type: "PLAY_AGAIN" });
    } catch {
      // ignore
    }
  }

  let theme = NEUTRAL_THEME;
  if (state.phase === "placing" || state.phase === "response") {
    theme = state.placer === "p1" ? P1_THEME : P2_THEME;
  } else if (state.phase === "category" || state.phase === "guessing") {
    theme = guesser === "p1" ? P1_THEME : P2_THEME;
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, margin: "-2.5rem -1.5rem -4rem", padding: "2.5rem 1.5rem 4rem", transition: "background 0.25s ease" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", color: theme.text }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.6rem" }}>
          <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
            <IconUser size={13} strokeWidth={2.4} />
            You are {myLabel} · room {code}
          </span>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
              <IconTrophy size={13} strokeWidth={2.4} />
              P1 {state.totalScore.p1} – {state.totalScore.p2} P2
            </span>
            <ChangeModeLink onClick={onChangeMode} label="Leave / change mode" />
          </div>
        </div>

        {state.phase === "placing" && seat === state.placer && (
          <PlacingPhase placer={state.placer} draftMark={draftMark} setDraftMark={setDraftMark} onConfirm={confirmPlacement} />
        )}
        {state.phase === "placing" && seat !== state.placer && (
          <WaitingBanner>Waiting for {playerLabel(state.placer)} to place their secret mark…</WaitingBanner>
        )}

        {state.phase === "category" && seat === guesser && (
          <EnterCategoryPhase
            guesser={guesser}
            roundIndex={state.roundIndex}
            leftLabel={leftLabel}
            setLeftLabel={setLeftLabel}
            rightLabel={rightLabel}
            setRightLabel={setRightLabel}
            error={categoryError}
            onSubmit={submitCategory}
            rounds={state.rounds}
          />
        )}
        {state.phase === "category" && seat !== guesser && (
          <WaitingBanner>
            Waiting for {playerLabel(guesser)} to invent round {state.roundIndex + 1} of {TOTAL_ROUNDS}…
          </WaitingBanner>
        )}

        {state.phase === "response" && seat === state.placer && (
          <EnterResponsePhase
            placer={state.placer}
            secretMark={state.secretMark}
            leftLabel={state.pendingCategory?.left}
            rightLabel={state.pendingCategory?.right}
            responseText={responseText}
            setResponseText={setResponseText}
            error={responseError}
            onSubmit={submitResponse}
            roundIndex={state.roundIndex}
          />
        )}
        {state.phase === "response" && seat !== state.placer && (
          <WaitingBanner>Waiting for {playerLabel(state.placer)} to respond…</WaitingBanner>
        )}

        {state.phase === "guessing" && seat === guesser && (
          <GuessingPhase guesser={guesser} rounds={state.rounds} guessMark={guessMark} setGuessMark={setGuessMark} onSubmit={submitGuess} />
        )}
        {state.phase === "guessing" && seat !== guesser && (
          <WaitingBanner>Waiting for {playerLabel(guesser)} to guess where the mark was…</WaitingBanner>
        )}

        {state.phase === "reveal" && (
          <RevealPhase
            placer={state.placer}
            guesser={guesser}
            secretMark={state.secretMark}
            guessMark={state.guessMark}
            result={state.result}
            rounds={state.rounds}
            onReplay={playAgain}
          />
        )}
      </div>
    </div>
  );
}
