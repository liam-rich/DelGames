"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconDice,
  IconSpy,
  IconUsers,
  IconArrowRight,
  IconEye,
  IconTarget,
  IconTrophy,
  IconRefresh,
  IconCheck,
  IconX,
  IconSkull,
  IconAlertTriangle,
  IconBook,
} from "../icons";
import {
  applyAction,
  createInitialState,
  agentsLeft,
  guessableFor,
  keyOf,
  other,
  TOTAL_AGENTS,
  STARTING_TURNS,
} from "../../lib/engines/codenamesDuet";

const WASH = {
  p1: "var(--wash-p1)",
  p2: "var(--wash-p2)",
  neutral: "var(--wash)",
  won: "var(--wash-win)",
  lost: "var(--wash-lose)",
};

export const seatName = (s) => (s === "p1" ? "Player 1" : "Player 2");

// How long the board stays up after a turn-ending guess, so everyone sees what
// was hit before the device changes hands.
const HOLD_MS = 1100;

export default function CodenamesDuetGame() {
  const [state, setState] = useState(createInitialState);
  // Which handoff the holder has confirmed — keyed so each new turn asks again.
  const [readyFor, setReadyFor] = useState(null);
  const [hold, setHold] = useState(null); // a frozen guess view during HOLD_MS
  const [clueWord, setClueWord] = useState("");
  const [clueNumber, setClueNumber] = useState(2);
  const [clueError, setClueError] = useState("");
  const [suddenSeat, setSuddenSeat] = useState(null);
  const holdTimer = useRef(null);

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  function act(action) {
    try {
      const next = applyAction(state, action);
      setState(next);
      return next;
    } catch (err) {
      return { error: err.message };
    }
  }

  function freeze(view, then) {
    setHold(view);
    clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => {
      setHold(null);
      then?.();
    }, HOLD_MS);
  }

  const turnKey = `${state.phase}-${state.activeGiver}-${state.turnsRemaining}-${state.clueLog.length}`;

  function deal() {
    act({ type: "DEAL" });
    setReadyFor(null);
  }

  function submitClue(e) {
    e.preventDefault();
    const res = act({ type: "GIVE_CLUE", seat: state.activeGiver, word: clueWord, number: clueNumber });
    if (res.error) return setClueError(res.error);
    setClueError("");
    setClueWord("");
    setClueNumber(2);
  }

  function guessTile(index) {
    if (hold) return;
    const before = state;
    const res = act({ type: "GUESS_TILE", seat: other(before.activeGiver), index });
    if (res.error) return;
    if (res.phase !== "guess") {
      freeze({ kind: "guess", activeClue: before.activeClue, guesser: other(before.activeGiver), game: res.game, lastGuess: res.lastGuess, guessesLeft: 0 });
    }
  }

  function suddenTouch(index) {
    if (hold || !suddenSeat) return;
    const res = act({ type: "GUESS_TILE", seat: suddenSeat, index });
    if (res.error) return;
    freeze({ kind: "sudden", seat: suddenSeat, game: res.game, lastGuess: res.lastGuess }, () => setSuddenSeat(null));
  }

  function stopGuessing() {
    if (hold) return;
    act({ type: "STOP_GUESSING", seat: other(state.activeGiver) });
  }

  function playAgain() {
    setState(createInitialState());
    setReadyFor(null);
    setSuddenSeat(null);
  }

  // ---- what to show ----
  let wash = WASH.neutral;
  let body = null;
  const guesser = other(state.activeGiver);

  if (hold?.kind === "guess") {
    wash = WASH[hold.guesser];
    body = (
      <GuessPhase
        guesser={hold.guesser}
        game={hold.game}
        activeClue={hold.activeClue}
        guessesLeft={0}
        lastGuess={hold.lastGuess}
        locked
        clueLog={state.clueLog}
      />
    );
  } else if (hold?.kind === "sudden") {
    wash = WASH[hold.seat];
    body = <SuddenPhase seat={hold.seat} game={hold.game} lastGuess={hold.lastGuess} locked />;
  } else if (state.phase === "lobby") {
    body = <BriefingPhase onStart={deal} />;
  } else if (state.phase === "clue") {
    if (readyFor !== turnKey) {
      body = (
        <HandoffPhase
          seat={state.activeGiver}
          heading={`${seatName(state.activeGiver)}, you're giving the clue`}
          body={`Pass the device to ${seatName(state.activeGiver)}. Your private key will be on screen — keep it from your partner.`}
          buttonLabel={`I'm ${seatName(state.activeGiver)}`}
          onReady={() => setReadyFor(turnKey)}
        />
      );
    } else {
      wash = WASH[state.activeGiver];
      body = (
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
      );
    }
  } else if (state.phase === "guess") {
    if (readyFor !== turnKey) {
      body = (
        <HandoffPhase
          seat={guesser}
          heading="Clue locked in"
          body={`Pass the device to ${seatName(guesser)}. The clue is ${state.activeClue.word} for ${state.activeClue.number}.`}
          buttonLabel={`I'm ${seatName(guesser)}`}
          onReady={() => setReadyFor(turnKey)}
        />
      );
    } else {
      wash = WASH[guesser];
      body = (
        <GuessPhase
          guesser={guesser}
          game={state.game}
          activeClue={state.activeClue}
          guessesLeft={state.guessesLeft}
          guessesMade={state.guessesMade}
          lastGuess={state.lastGuess}
          onGuess={guessTile}
          onStop={stopGuessing}
          clueLog={state.clueLog}
        />
      );
    }
  } else if (state.phase === "sudden") {
    if (!suddenSeat) {
      body = <SuddenChooser game={state.game} onChoose={setSuddenSeat} />;
    } else {
      wash = WASH[suddenSeat];
      body = <SuddenPhase seat={suddenSeat} game={state.game} onTouch={suddenTouch} onBack={() => setSuddenSeat(null)} />;
    }
  } else if (state.phase === "results") {
    wash = state.outcome?.result === "won" ? WASH.won : WASH.lost;
    body = <ResultsPhase outcome={state.outcome} game={state.game} agentsFound={state.agentsFound} onReplay={playAgain} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: wash, transition: "background 0.25s ease" }}>
      <nav className="top-nav">
        <Link href="/" className="brand">
          <span className="brand-badge">
            <IconDice size={20} strokeWidth={2.2} />
          </span>
          DelGames
        </Link>
        <span className="pill" style={{ background: "var(--pink)", color: "var(--ink-dark)" }}>
          <IconSpy size={14} strokeWidth={2.4} />
          Codenames Duet
        </span>
      </nav>

      <main className="page" style={{ maxWidth: 780 }}>
        {state.game && state.phase !== "results" && <MissionStatus state={state} />}
        {body}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pieces shared with online play
// ---------------------------------------------------------------------------

export function MissionStatus({ state }) {
  return (
    <div className="cd-status">
      <div className="cd-status-cell">
        <span className="eyebrow">Turns</span>
        <span className="cd-pips" aria-label={`${state.turnsRemaining} turns left`}>
          {Array.from({ length: STARTING_TURNS }, (_, i) => (
            <i key={i} className={i < state.turnsRemaining ? "on" : ""} />
          ))}
        </span>
      </div>
      <div className="cd-status-cell right">
        <span className="eyebrow">Agents</span>
        <span className="cd-count">
          {state.agentsFound}
          <small>/{TOTAL_AGENTS}</small>
        </span>
      </div>
      {state.phase === "sudden" && <div className="cd-sudden-flag">Sudden death</div>}
    </div>
  );
}

export function BriefingPhase({ onStart }) {
  return (
    <section className="block cd-panel">
      <h1>Briefing</h1>
      <p className="cd-lead">
        25 words, two private keys. Each key marks 9 words as that player&apos;s agents and 3 as assassins — and the two
        keys don&apos;t agree. Find all {TOTAL_AGENTS} agents together in {STARTING_TURNS} turns.
      </p>
      <ul className="cd-rules">
        <li>
          <b>Give a clue:</b> one word and a number, pointing your partner at your agents.
        </li>
        <li>
          <b>Guess:</b> touch words. An agent lets you keep going (up to number + 1). A bystander ends the turn. You
          must guess at least once.
        </li>
        <li>
          <b>Assassin:</b> touch one and you both lose.
        </li>
        <li>
          <b>Bystanders count per key:</b> a word that&apos;s a bystander for your partner might still be one of your
          agents.
        </li>
        <li>
          <b>Sudden death:</b> out of turns with agents left? No more clues. Touch your partner&apos;s agents — any
          miss loses.
        </li>
      </ul>
      <button className="block-btn pink" onClick={onStart} style={{ alignSelf: "flex-start" }}>
        Deal the board
        <IconArrowRight size={16} strokeWidth={2.4} />
      </button>
    </section>
  );
}

function HandoffPhase({ seat, heading, body, buttonLabel, onReady }) {
  return (
    <section className={`block cd-panel cd-handoff ${seat}`}>
      <span className="cd-handoff-icon">
        <IconUsers size={26} strokeWidth={2.2} />
      </span>
      <h1>{heading}</h1>
      <p className="cd-lead">{body}</p>
      <button className={`block-btn ${seat === "p1" ? "teal" : "pink"}`} onClick={onReady}>
        {buttonLabel}
        <IconArrowRight size={16} strokeWidth={2.4} />
      </button>
    </section>
  );
}

export function Legend({ showKey = true }) {
  return (
    <div className="cd-legend">
      <span className="cd-legend-item agent">
        <IconCheck size={12} strokeWidth={3} /> Agent found
      </span>
      {showKey && (
        <>
          <span className="cd-legend-item mine">Your agent</span>
          <span className="cd-legend-item danger">
            <IconAlertTriangle size={12} strokeWidth={2.6} /> Your assassin
          </span>
        </>
      )}
      <span className="cd-legend-item by">
        <IconEye size={12} strokeWidth={2.6} /> Ruled out
      </span>
    </div>
  );
}

// viewKey: whose private key to overlay (a seat) or null for the public board.
// guessFor: whose key a touch is checked against, or null when nothing's clickable.
// showAll: reveal both keys (end of game).
export function BoardGrid({ game, viewKey = null, guessFor = null, onClickTile, lastIndex = null, showAll = false }) {
  const own = viewKey ? keyOf(game, viewKey) : null;
  return (
    <div className="cd-board">
      {game.words.map((word, i) => {
        const found = game.revealed[i];
        let cls = "cd-tile";
        let Icon = null;
        if (found === "agent") {
          cls += " found";
          Icon = IconCheck;
        } else if (found === "assassin") {
          cls += " assassin";
          Icon = IconSkull;
        } else if (showAll) {
          const a = game.keyP1[i];
          const b = game.keyP2[i];
          if (a === "assassin" || b === "assassin") {
            cls += " assassin dim";
            Icon = IconSkull;
          } else if (a === "agent" || b === "agent") {
            cls += " missed";
            Icon = IconTarget;
          }
        } else if (own) {
          if (own[i] === "agent") cls += " mine";
          if (own[i] === "assassin") {
            cls += " danger";
            Icon = IconAlertTriangle;
          }
        }
        const by1 = game.bystander?.p1?.[i];
        const by2 = game.bystander?.p2?.[i];
        if (!found && by1 && by2) cls += " dead";
        const clickable = guessFor && guessableFor(game, guessFor, i);
        if (clickable) cls += " live";
        if (i === lastIndex) cls += " last";

        const inner = (
          <>
            {Icon && <Icon size={14} strokeWidth={2.6} />}
            <span className="cd-word">{word}</span>
            {!found && (by1 || by2) && (
              <span className="cd-marks">
                {by1 && <i className="p1">P1</i>}
                {by2 && <i className="p2">P2</i>}
              </span>
            )}
          </>
        );

        return clickable ? (
          <button key={i} type="button" className={cls} onClick={() => onClickTile(i)} aria-label={`Guess ${word}`}>
            {inner}
          </button>
        ) : (
          <div key={i} className={cls}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export function ClueHistory({ clueLog }) {
  if (!clueLog?.length) return null;
  return (
    <div className="cd-history">
      <span className="eyebrow">
        <IconBook size={12} strokeWidth={2.4} /> Clues so far
      </span>
      <div className="cd-history-chips">
        {clueLog.map((c, i) => (
          <span key={i} className={`chip solved ${c.giver}`}>
            {c.word} {c.number}
          </span>
        ))}
      </div>
    </div>
  );
}

export function GiveCluePhase({ giver, game, clueWord, setClueWord, clueNumber, setClueNumber, error, onSubmit, clueLog }) {
  const left = agentsLeft(game, giver);
  return (
    <section className="cd-stack">
      <div className={`turn-banner ${giver}`}>
        <IconTarget size={15} strokeWidth={2.4} />
        {seatName(giver)} — your key · {left} agent{left === 1 ? "" : "s"} left on it
      </div>
      <Legend />
      <BoardGrid game={game} viewKey={giver} />

      <form onSubmit={onSubmit} className="block cd-clue-form">
        <label className="eyebrow" htmlFor="cd-clue">
          One-word clue + number
        </label>
        <div className="cd-clue-row">
          <input
            id="cd-clue"
            className="block-input"
            value={clueWord}
            onChange={(e) => setClueWord(e.target.value.replace(/\s/g, ""))}
            placeholder="e.g. OCEAN"
            maxLength={20}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="cd-number" role="group" aria-label="Number of words">
            <button type="button" onClick={() => setClueNumber((n) => Math.max(0, n - 1))} aria-label="Fewer">
              −
            </button>
            <span>{clueNumber}</span>
            <button type="button" onClick={() => setClueNumber((n) => Math.min(9, n + 1))} aria-label="More">
              +
            </button>
          </div>
        </div>
        {error && <p className="cd-error">{error}</p>}
        <button type="submit" className="block-btn blue" disabled={!clueWord.trim()}>
          Give clue
          <IconArrowRight size={16} strokeWidth={2.4} />
        </button>
      </form>

      <ClueHistory clueLog={clueLog} />
    </section>
  );
}

function feedbackFor(lastGuess, guesser) {
  if (!lastGuess || lastGuess.seat !== guesser) return null;
  if (lastGuess.truth === "agent") return { cls: "correct", text: "Agent found!" };
  if (lastGuess.truth === "bystander") return { cls: "reveal", text: "Bystander — turn over" };
  return { cls: "wrong", text: "Assassin!" };
}

export function GuessPhase({ guesser, game, activeClue, guessesLeft, guessesMade, lastGuess, onGuess, onStop, clueLog, locked }) {
  const fb = feedbackFor(lastGuess, guesser);
  return (
    <section className="cd-stack">
      <div className={`turn-banner ${guesser}`}>
        <IconTarget size={15} strokeWidth={2.4} />
        {seatName(guesser)} is guessing
      </div>

      <div className="block cd-clue-card">
        <div>
          <span className="eyebrow">Clue from {seatName(activeClue.giver)}</span>
          <div className="cd-clue-word">
            {activeClue.word} <span>{activeClue.number}</span>
          </div>
        </div>
        <span className="cd-guesses">
          {guessesLeft}
          <small>guess{guessesLeft === 1 ? "" : "es"} left</small>
        </span>
      </div>

      <p className={`arcade-feedback ${fb?.cls || "idle"}`} aria-live="polite">
        {fb?.text || "Your agents are outlined — touch a word for your partner"}
      </p>

      <BoardGrid
        game={game}
        viewKey={guesser}
        guessFor={locked ? null : activeClue.giver}
        onClickTile={onGuess}
        lastIndex={lastGuess?.index}
      />

      {!locked && (
        <button type="button" className="block-btn secondary" onClick={onStop} disabled={!guessesMade}>
          <IconX size={16} strokeWidth={2.4} />
          {guessesMade ? "Stop guessing" : "Guess at least once"}
        </button>
      )}

      <ClueHistory clueLog={clueLog} />
    </section>
  );
}

export function SuddenChooser({ game, onChoose, seats = ["p1", "p2"] }) {
  return (
    <section className="block cd-panel cd-handoff">
      <span className="cd-handoff-icon danger">
        <IconSkull size={26} strokeWidth={2.2} />
      </span>
      <h1>Sudden death</h1>
      <p className="cd-lead">
        Out of turns. No more clues: touch a word you think is one of your partner&apos;s agents. Any miss and the
        mission fails.
      </p>
      <div className="cd-choose">
        {seats.map((seat) => {
          const partnerLeft = agentsLeft(game, other(seat));
          return (
            <button
              key={seat}
              className={`block-btn ${seat === "p1" ? "teal" : "pink"}`}
              disabled={partnerLeft === 0}
              onClick={() => onChoose(seat)}
            >
              {seatName(seat)} touches
              <small style={{ opacity: 0.7 }}> ({partnerLeft} left)</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function SuddenPhase({ seat, game, onTouch, onBack, lastGuess, locked }) {
  const fb = lastGuess && lastGuess.seat === seat ? (lastGuess.truth === "agent" ? { cls: "correct", text: "Agent found!" } : { cls: "wrong", text: "Missed — mission failed" }) : null;
  return (
    <section className="cd-stack">
      <div className={`turn-banner ${seat}`}>
        <IconSkull size={15} strokeWidth={2.4} />
        Sudden death · {seatName(seat)} touches one of {seatName(other(seat))}&apos;s agents
      </div>
      <p className={`arcade-feedback ${fb?.cls || "idle"}`}>{fb?.text || "Choose carefully"}</p>
      <BoardGrid game={game} viewKey={seat} guessFor={locked ? null : other(seat)} onClickTile={onTouch} lastIndex={lastGuess?.index} />
      {!locked && onBack && (
        <button type="button" className="block-btn secondary" onClick={onBack}>
          Back
        </button>
      )}
    </section>
  );
}

export function ResultsPhase({ outcome, game, agentsFound, onReplay }) {
  const won = outcome?.result === "won";
  const reason =
    outcome?.reason === "assassin"
      ? "An assassin was touched."
      : outcome?.reason === "sudden"
      ? "Sudden death — that word wasn't an agent."
      : "";
  return (
    <section className={`block cd-panel cd-results ${won ? "won" : "lost"}`}>
      <span className="cd-handoff-icon">{won ? <IconTrophy size={28} strokeWidth={2.2} /> : <IconSkull size={28} strokeWidth={2.2} />}</span>
      <h1>{won ? "Mission complete" : "Mission failed"}</h1>
      <p className="cd-lead">{won ? `All ${TOTAL_AGENTS} agents found.` : reason}</p>
      <p className="eyebrow">
        {agentsFound}/{TOTAL_AGENTS} agents found
      </p>
      <div style={{ width: "100%", textAlign: "left" }}>
        <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>
          Both keys
        </p>
        <BoardGrid game={game} showAll />
      </div>
      <button className="block-btn purple" onClick={onReplay}>
        <IconRefresh size={16} strokeWidth={2.4} />
        Play again
      </button>
    </section>
  );
}
