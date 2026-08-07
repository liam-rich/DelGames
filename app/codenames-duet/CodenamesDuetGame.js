"use client";

import { useState } from "react";
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
  IconClock,
  IconAlertTriangle,
  IconBook,
} from "../icons";
import { getRandomBoardWords } from "./wordbank";

const GRID_SIZE = 25;
const SHARED_AGENTS = 3;
const EXCLUSIVE_AGENTS_EACH = 6; // per player, on top of the shared ones
const TOTAL_AGENTS = SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH * 2; // 15
const STARTING_TURNS = 9;

const P1_THEME = { bg: "var(--blue)", text: "var(--paper)" };
const P2_THEME = { bg: "var(--pink)", text: "var(--ink)" };
const NEUTRAL_THEME = { bg: "var(--paper)", text: "var(--ink)" };
const WIN_THEME = { bg: "var(--green)", text: "var(--ink)" };
const LOSE_THEME = { bg: "var(--red)", text: "var(--paper)" };

function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Deals a fresh board: 25 words, plus two private key maps (one per player).
// Each key independently marks every position as 'agent' | 'bystander' | 'assassin'.
// 3 agent positions are shared by both keys, 6 are exclusive to each player (15 unique
// agents total). 1 assassin position is shared, 1 is exclusive to each player (3 unique
// assassins total). Everything else is a bystander on both keys.
function dealGame() {
  const words = getRandomBoardWords(GRID_SIZE);
  const order = shuffledIndices(GRID_SIZE);

  const sharedAgents = order.slice(0, SHARED_AGENTS);
  const p1OnlyAgents = order.slice(SHARED_AGENTS, SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH);
  const p2OnlyAgents = order.slice(
    SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH,
    SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH * 2
  );
  const rest = order.slice(SHARED_AGENTS + EXCLUSIVE_AGENTS_EACH * 2);
  const sharedAssassin = rest[0];
  const p1OnlyAssassin = rest[1];
  const p2OnlyAssassin = rest[2];

  const keyP1 = Array(GRID_SIZE).fill("bystander");
  const keyP2 = Array(GRID_SIZE).fill("bystander");

  [...sharedAgents, ...p1OnlyAgents].forEach((i) => (keyP1[i] = "agent"));
  [...sharedAgents, ...p2OnlyAgents].forEach((i) => (keyP2[i] = "agent"));
  [sharedAssassin, p1OnlyAssassin].forEach((i) => (keyP1[i] = "assassin"));
  [sharedAssassin, p2OnlyAssassin].forEach((i) => (keyP2[i] = "assassin"));

  return {
    words,
    keyP1,
    keyP2,
    revealed: Array(GRID_SIZE).fill(null), // null | 'agent' | 'bystander' | 'assassin'
  };
}

export default function CodenamesDuetGame() {
  const [phase, setPhase] = useState("briefing");
  // briefing -> handoff-give -> give-clue -> handoff-guess -> guess -> (loop) -> results

  const [game, setGame] = useState(null);
  const [activeGiver, setActiveGiver] = useState("p1");
  const [turnsRemaining, setTurnsRemaining] = useState(STARTING_TURNS);
  const [agentsFound, setAgentsFound] = useState(0);
  const [clueLog, setClueLog] = useState([]);

  const [clueWord, setClueWord] = useState("");
  const [clueNumber, setClueNumber] = useState(2);
  const [clueError, setClueError] = useState("");

  const [activeClue, setActiveClue] = useState(null); // { giver, word, number }
  const [guessesLeft, setGuessesLeft] = useState(0);
  const [guessFeedback, setGuessFeedback] = useState(null); // 'agent' | 'bystander' | 'assassin' | null

  const [outcome, setOutcome] = useState(null); // { result: 'won'|'lost', reason }

  function startBriefing() {
    setGame(dealGame());
    setActiveGiver("p1");
    setTurnsRemaining(STARTING_TURNS);
    setAgentsFound(0);
    setClueLog([]);
    setClueWord("");
    setClueNumber(2);
    setClueError("");
    setActiveClue(null);
    setGuessesLeft(0);
    setGuessFeedback(null);
    setOutcome(null);
    setPhase("handoff-give");
  }

  function resetAll() {
    setPhase("briefing");
    setGame(null);
  }

  function submitClue(e) {
    e.preventDefault();
    const word = clueWord.trim().toUpperCase();
    if (!word) {
      setClueError("Enter a one-word clue.");
      return;
    }
    if (!/^[A-Z]+$/.test(word)) {
      setClueError("Clues are a single word, letters only.");
      return;
    }
    if (game.words.includes(word)) {
      setClueError("That word is on the board — pick another clue.");
      return;
    }
    setClueError("");
    setActiveClue({ giver: activeGiver, word, number: clueNumber });
    setClueLog((log) => [...log, { giver: activeGiver, word, number: clueNumber }]);
    setGuessesLeft(clueNumber + 1);
    setGuessFeedback(null);
    setClueWord("");
    setClueNumber(2);
    setPhase("handoff-guess");
  }

  function endTurn() {
    setActiveClue(null);
    setGuessesLeft(0);
    setGuessFeedback(null);
    const nextTurns = turnsRemaining - 1;
    setTurnsRemaining(nextTurns);
    if (nextTurns <= 0) {
      setOutcome({ result: "lost", reason: "timeout" });
      setPhase("results");
      return;
    }
    setActiveGiver((g) => (g === "p1" ? "p2" : "p1"));
    setPhase("handoff-give");
  }

  function guessTile(index) {
    if (!game || game.revealed[index]) return;
    const key = activeClue.giver === "p1" ? game.keyP1 : game.keyP2;
    const truth = key[index];

    const nextRevealed = [...game.revealed];
    nextRevealed[index] = truth;
    setGame((g) => ({ ...g, revealed: nextRevealed }));
    setGuessFeedback(truth);

    if (truth === "assassin") {
      setTimeout(() => {
        setOutcome({ result: "lost", reason: "assassin" });
        setPhase("results");
      }, 700);
      return;
    }

    if (truth === "agent") {
      const nextFound = agentsFound + 1;
      setAgentsFound(nextFound);
      if (nextFound >= TOTAL_AGENTS) {
        setTimeout(() => {
          setOutcome({ result: "won" });
          setPhase("results");
        }, 700);
        return;
      }
      const left = guessesLeft - 1;
      setGuessesLeft(left);
      if (left <= 0) {
        setTimeout(() => endTurn(), 700);
      } else {
        setTimeout(() => setGuessFeedback(null), 700);
      }
      return;
    }

    // bystander — turn ends immediately
    setTimeout(() => endTurn(), 700);
  }

  function stopGuessing() {
    endTurn();
  }

  let theme = NEUTRAL_THEME;
  if (phase === "give-clue") theme = activeGiver === "p1" ? P1_THEME : P2_THEME;
  else if (phase === "guess") {
    const guesser = activeClue?.giver === "p1" ? "p2" : "p1";
    theme = guesser === "p1" ? P1_THEME : P2_THEME;
  } else if (phase === "results") {
    theme = outcome?.result === "won" ? WIN_THEME : LOSE_THEME;
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
          {game && phase !== "briefing" && phase !== "results" && (
            <>
              <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
                <IconClock size={14} strokeWidth={2.4} />
                {turnsRemaining} turns left
              </span>
              <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
                <IconTarget size={14} strokeWidth={2.4} />
                {agentsFound}/{TOTAL_AGENTS} agents
              </span>
            </>
          )}
          <span className="pill" style={{ background: "var(--panel)", color: "var(--ink)" }}>
            <IconSpy size={14} strokeWidth={2.4} />
            Codenames Duet
          </span>
        </div>
      </nav>

      <main className="page" style={{ maxWidth: 780, color: theme.text }}>
        {phase === "briefing" && <BriefingPhase onStart={startBriefing} />}

        {phase === "handoff-give" && (
          <HandoffPhase
            heading={`${activeGiver === "p1" ? "Player 1" : "Player 2"}, you're giving the clue`}
            body="Pass the device to them. They'll see their private key for the board — keep it away from the other player's eyes."
            buttonLabel="I've got the device"
            onReady={() => setPhase("give-clue")}
          />
        )}

        {phase === "give-clue" && game && (
          <GiveCluePhase
            giver={activeGiver}
            game={game}
            clueWord={clueWord}
            setClueWord={setClueWord}
            clueNumber={clueNumber}
            setClueNumber={setClueNumber}
            error={clueError}
            onSubmit={submitClue}
            clueLog={clueLog}
          />
        )}

        {phase === "handoff-guess" && activeClue && (
          <HandoffPhase
            heading="Clue locked in"
            body={`Pass the device to ${activeClue.giver === "p1" ? "Player 2" : "Player 1"} — they'll guess based on the clue "${activeClue.word} (${activeClue.number})".`}
            buttonLabel="I've got the device"
            onReady={() => setPhase("guess")}
          />
        )}

        {phase === "guess" && game && activeClue && (
          <GuessPhase
            guesser={activeClue.giver === "p1" ? "p2" : "p1"}
            game={game}
            activeClue={activeClue}
            guessesLeft={guessesLeft}
            guessFeedback={guessFeedback}
            onGuess={guessTile}
            onStop={stopGuessing}
            clueLog={clueLog}
          />
        )}

        {phase === "results" && game && (
          <ResultsPhase outcome={outcome} game={game} agentsFound={agentsFound} onReplay={resetAll} />
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
            borderRadius: "12px",
            border: "var(--border-w) solid var(--ink)",
            background: "var(--pink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconSpy size={20} strokeWidth={2.2} />
        </span>
        <h1 style={{ fontSize: "1.8rem" }}>Codenames Duet</h1>
      </div>

      <p style={{ lineHeight: 1.6 }}>
        A 5×5 board of words is dealt. Each of you has your own private key
        showing which words are your team's agents (green), which are
        assassins (black), and which are bystanders — and your two keys
        disagree on some words.
      </p>
      <ul style={{ lineHeight: 1.8, paddingLeft: "1.2rem" }}>
        <li>Clue-giving alternates every turn. On your turn, look at your key and give a one-word clue plus a number, pointing your partner toward your agent words.</li>
        <li>Your partner then guesses words on the board — a correct agent lets them guess again (number + 1 guesses total); a bystander ends the turn.</li>
        <li>Hit an assassin and you both lose immediately.</li>
        <li>Find all {TOTAL_AGENTS} agents between you before you run out of turns to win.</li>
      </ul>

      <button className="block-btn pink" onClick={onStart} style={{ alignSelf: "flex-start" }}>
        Deal the board
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
      <h1 style={{ fontSize: "1.5rem" }}>{heading}</h1>
      <p style={{ opacity: 0.8, maxWidth: 460 }}>{body}</p>
      <button className="block-btn teal" onClick={onReady}>
        {buttonLabel}
        <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
      </button>
    </section>
  );
}

function Legend({ variant }) {
  // variant: 'key' shows agent/bystander/assassin (for the clue-giver's private view)
  // variant: 'public' shows the same three, used for revealed-tile meaning
  return (
    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
      <LegendItem color="var(--green)" Icon={IconCheck} label="Agent" />
      <LegendItem color="var(--yellow)" Icon={IconEye} label="Bystander" />
      <LegendItem color="var(--ink)" textColor="var(--paper)" Icon={IconSkull} label="Assassin" />
    </div>
  );
}

function LegendItem({ color, textColor = "var(--ink)", Icon, label }) {
  return (
    <span
      className="pill"
      style={{ background: color, color: textColor, fontWeight: 700, fontSize: "0.8rem" }}
    >
      <Icon size={13} strokeWidth={2.6} />
      {label}
    </span>
  );
}

function BoardGrid({ words, revealed, keyView, clickable, onClickTile }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "0.5rem",
      }}
    >
      {words.map((word, i) => {
        const result = revealed[i];
        const finalStatus = result; // resolved truth, public once revealed
        const privateStatus = !result && keyView ? keyView[i] : null;

        let bg = "var(--panel)";
        let fg = "var(--ink)";
        let Icon = null;
        let border = "var(--border-w) solid var(--ink)";

        if (finalStatus === "agent") {
          bg = "var(--green)";
          Icon = IconCheck;
        } else if (finalStatus === "bystander") {
          bg = "var(--yellow)";
          Icon = IconEye;
        } else if (finalStatus === "assassin") {
          bg = "var(--ink)";
          fg = "var(--paper)";
          Icon = IconSkull;
        } else if (privateStatus === "agent") {
          bg = "#cdf7da"; // solid pastel green — your agent, not yet found
          border = "3px dashed var(--ink)";
          Icon = IconCheck;
        } else if (privateStatus === "assassin") {
          bg = "var(--ink)";
          fg = "var(--paper)";
          border = "3px dashed var(--red)";
          Icon = IconAlertTriangle;
        }

        const tile = (
          <div
            style={{
              aspectRatio: "1.3",
              borderRadius: "10px",
              border,
              background: bg,
              color: fg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
              fontWeight: 800,
              fontSize: "0.7rem",
              textAlign: "center",
              padding: "0.3rem",
              cursor: clickable && !result ? "pointer" : "default",
              opacity: result && !clickable ? 0.95 : 1,
            }}
          >
            {Icon && <Icon size={14} strokeWidth={2.6} />}
            <span style={{ wordBreak: "break-word", lineHeight: 1.1 }}>{word}</span>
          </div>
        );

        if (clickable && !result) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onClickTile(i)}
              style={{ all: "unset", cursor: "pointer" }}
            >
              {tile}
            </button>
          );
        }
        return <div key={i}>{tile}</div>;
      })}
    </div>
  );
}

function ClueHistory({ clueLog }) {
  if (clueLog.length === 0) return null;
  return (
    <div className="block" style={{ padding: "0.9rem 1rem", color: "var(--ink)", marginTop: "1.2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, marginBottom: "0.5rem", fontSize: "0.85rem" }}>
        <IconBook size={15} strokeWidth={2.4} />
        Clue history
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {clueLog.map((c, i) => (
          <span
            key={i}
            className="pill"
            style={{
              background: c.giver === "p1" ? "var(--blue)" : "var(--pink)",
              color: c.giver === "p1" ? "var(--paper)" : "var(--ink)",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            {c.word} ({c.number})
          </span>
        ))}
      </div>
    </div>
  );
}

function GiveCluePhase({ giver, game, clueWord, setClueWord, clueNumber, setClueNumber, error, onSubmit, clueLog }) {
  const key = giver === "p1" ? game.keyP1 : game.keyP2;
  return (
    <section>
      <div
        className="pill"
        style={{ background: "var(--panel)", color: "var(--ink)", marginBottom: "1rem", fontWeight: 800 }}
      >
        <IconTarget size={15} strokeWidth={2.4} />
        {giver === "p1" ? "Player 1" : "Player 2"} — your private key
      </div>

      <Legend variant="key" />

      <BoardGrid words={game.words} revealed={game.revealed} keyView={key} clickable={false} />

      <form
        onSubmit={onSubmit}
        className="block"
        style={{ padding: "1.4rem", marginTop: "1.4rem", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "0.9rem" }}
      >
        <label style={{ fontWeight: 700, fontSize: "0.9rem" }}>Give a one-word clue</label>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <input
            className="block-input"
            value={clueWord}
            onChange={(e) => setClueWord(e.target.value)}
            placeholder="e.g. OCEAN"
            maxLength={20}
            autoComplete="off"
            autoFocus
          />
          <select
            className="block-input"
            style={{ maxWidth: "5.5rem" }}
            value={clueNumber}
            onChange={(e) => setClueNumber(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p style={{ color: "var(--ink)", background: "var(--yellow)", padding: "0.5rem 0.8rem", borderRadius: 10, fontWeight: 700, border: "var(--border-w) solid var(--ink)" }}>
            {error}
          </p>
        )}
        <button type="submit" className="block-btn blue">
          Give clue
          <IconArrowRight size={16} strokeWidth={2.4} style={{ marginLeft: "0.5rem", verticalAlign: "-2px" }} />
        </button>
      </form>

      <ClueHistory clueLog={clueLog} />
    </section>
  );
}

function GuessPhase({ guesser, game, activeClue, guessesLeft, guessFeedback, onGuess, onStop, clueLog }) {
  return (
    <section>
      <div
        className="pill"
        style={{ background: "var(--panel)", color: "var(--ink)", marginBottom: "1rem", fontWeight: 800 }}
      >
        <IconTarget size={15} strokeWidth={2.4} />
        {guesser === "p1" ? "Player 1" : "Player 2"} is guessing
      </div>

      <div
        className="block"
        style={{
          padding: "1.2rem",
          marginBottom: "1.2rem",
          color: "var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.8rem",
        }}
      >
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.6, textTransform: "uppercase" }}>Clue</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>
            {activeClue.word} <span style={{ opacity: 0.6 }}>({activeClue.number})</span>
          </div>
        </div>
        <div className="pill" style={{ background: "var(--yellow)", fontWeight: 800 }}>
          {guessesLeft} guess{guessesLeft === 1 ? "" : "es"} left
        </div>
      </div>

      {guessFeedback === "agent" && (
        <p style={{ color: "var(--green)", fontWeight: 800, marginBottom: "0.8rem" }}>
          Agent found! Keep guessing or stop.
        </p>
      )}
      {guessFeedback === "bystander" && (
        <p style={{ color: "var(--ink)", fontWeight: 800, marginBottom: "0.8rem" }}>
          Bystander — turn over.
        </p>
      )}
      {guessFeedback === "assassin" && (
        <p style={{ color: "var(--red)", fontWeight: 800, marginBottom: "0.8rem" }}>
          Assassin revealed!
        </p>
      )}

      <BoardGrid words={game.words} revealed={game.revealed} keyView={null} clickable={!guessFeedback} onClickTile={onGuess} />

      <button
        type="button"
        className="block-btn secondary"
        style={{ marginTop: "1.2rem" }}
        onClick={onStop}
        disabled={!!guessFeedback}
      >
        <IconX size={16} strokeWidth={2.4} style={{ marginRight: "0.4rem", verticalAlign: "-3px" }} />
        Stop guessing
      </button>

      <ClueHistory clueLog={clueLog} />
    </section>
  );
}

function ResultsPhase({ outcome, game, agentsFound, onReplay }) {
  const won = outcome?.result === "won";
  const reasonText =
    outcome?.reason === "assassin"
      ? "An assassin was revealed."
      : outcome?.reason === "timeout"
      ? "You ran out of turns."
      : "";

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
          width: "3.6rem",
          height: "3.6rem",
          borderRadius: "14px",
          border: "var(--border-w) solid var(--ink)",
          background: won ? "var(--yellow)" : "var(--ink)",
          color: won ? "var(--ink)" : "var(--paper)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {won ? <IconTrophy size={26} strokeWidth={2.2} /> : <IconSkull size={26} strokeWidth={2.2} />}
      </span>
      <h1 style={{ fontSize: "1.8rem" }}>{won ? "You found all the agents!" : "Mission failed"}</h1>
      <p style={{ opacity: 0.8 }}>
        {won
          ? `Both of you worked together to find all ${TOTAL_AGENTS} agents.`
          : reasonText}
      </p>
      <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
        {agentsFound}/{TOTAL_AGENTS} agents found
      </p>

      <details style={{ width: "100%", textAlign: "left" }}>
        <summary style={{ cursor: "pointer", fontWeight: 700, marginBottom: "0.6rem" }}>
          Reveal the full board
        </summary>
        <BoardGrid
          words={game.words}
          revealed={game.words.map((_, i) => {
            if (game.revealed[i]) return game.revealed[i];
            if (game.keyP1[i] === "agent" || game.keyP2[i] === "agent") return "agent";
            if (game.keyP1[i] === "assassin" || game.keyP2[i] === "assassin") return "assassin";
            return "bystander";
          })}
          keyView={null}
          clickable={false}
        />
      </details>

      <button className="block-btn purple" onClick={onReplay}>
        <IconRefresh size={16} strokeWidth={2.4} style={{ marginRight: "0.5rem", verticalAlign: "-3px" }} />
        Play again
      </button>
    </section>
  );
}
