"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ANSWERS_PER_ROUND, TIER_BY_KEY, AMBIGUOUS_FORM, lookupForm } from "../../../lib/rarelist/core";
import { Burst, CountUp, PixelIcon, TierBadge } from "../ui";
import { sfx } from "../sound";
import { api } from "../api";
import TopBar from "./TopBar";
import { RoundPill } from "./DicePhase";

const SEGMENTS = 24;

export default function Play({ day, round, state, playerId, sound, onToggleSound, onUpdate, onDone, onHome }) {
  const totalMs = state.seconds * 1000;
  const deadline = state.startedAt + totalMs;
  const [now, setNow] = useState(() => Date.now());
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null); // {kind, text, id}
  const [hit, setHit] = useState(null); // {key, tier, id}
  const [flashKey, setFlashKey] = useState(null);
  const [banner, setBanner] = useState(null);
  const [ending, setEnding] = useState(null); // "clear" | "timeup" | "quit"
  const [finishError, setFinishError] = useState(null);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const inputRef = useRef(null);
  const pendingRef = useRef(null);
  const finishing = useRef(false);
  const lastTick = useRef(null);
  const formRef = useRef(null);
  // Source of truth for what's been found, updated synchronously so a guess
  // landing at the buzzer is never lost to a pending React render.
  const foundRef = useRef((state.correct || []).map((c) => c.key));

  const correct = state.correct || [];
  const keys = correct.map((c) => c.key);
  const score = correct.reduce((s, c) => s + c.points, 0);
  const remaining = Math.max(0, deadline - now);
  const frac = totalMs ? remaining / totalMs : 0;

  // Clock. Five ticks a second is plenty for a 24-segment bar and a seconds
  // readout; re-rendering every animation frame made typing sluggish on phones.
  useEffect(() => {
    if (ending) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [ending]);

  // Countdown ticks for the last ten seconds.
  useEffect(() => {
    if (ending) return;
    const s = Math.ceil(remaining / 1000);
    if (s <= 10 && s > 0 && lastTick.current !== s) {
      lastTick.current = s;
      sfx.tick();
    }
  }, [remaining, ending]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
    return () => clearTimeout(t);
  }, []);

  const finish = useCallback(
    async (why) => {
      if (finishing.current) return;
      finishing.current = true;
      setEnding(why);
      setFinishError(null);
      if (why === "timeup") sfx.timeUp();
      if (why === "clear") sfx.fanfare();
      // Let an in-flight guess land first, so a last-second answer counts.
      if (pendingRef.current) {
        try {
          await pendingRef.current;
        } catch {}
      }
      const started = Date.now();
      try {
        const summary = await api("finish", { playerId, day, round, keys: foundRef.current });
        const byKey = new Map(summary.scored.map((s) => [s.key, s]));
        onUpdate((r) => ({
          ...r,
          done: true,
          endedBy: why,
          summary,
          correct: (r.correct || []).map((c) => ({ ...c, ...(byKey.get(c.key) || {}) })),
        }));
        const wait = Math.max(0, 1400 - (Date.now() - started));
        setTimeout(onDone, wait);
      } catch (e) {
        finishing.current = false;
        setFinishError(e.message || "Couldn't reach the server.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [day, round, playerId, onDone]
  );

  // Out of time (also catches reloading after the clock ran out).
  useEffect(() => {
    if (!ending && remaining <= 0) finish("timeup");
  }, [remaining, ending, finish]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 1350);
    return () => clearTimeout(t);
  }, [banner]);

  useEffect(() => {
    if (!flashKey) return;
    const t = setTimeout(() => setFlashKey(null), 700);
    return () => clearTimeout(t);
  }, [flashKey]);

  const say = (kind, msg) => setFeedback({ kind, text: msg, id: Math.random() });

  const shakeEntry = () => {
    formRef.current?.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-10px)" },
        { transform: "translateX(9px)" },
        { transform: "translateX(-7px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(-2px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 380, easing: "steps(7, end)" }
    );
    formRef.current?.classList.remove("is-wrong");
    void formRef.current?.offsetWidth;
    formRef.current?.classList.add("is-wrong");
  };

  const celebrate = (entry) => {
    if (!foundRef.current.includes(entry.key)) foundRef.current = [...foundRef.current, entry.key];
    const count = foundRef.current.length;
    onUpdate((r) => {
      if ((r.correct || []).some((c) => c.key === entry.key)) return r;
      return { ...r, correct: [...(r.correct || []), entry] };
    });
    setText("");
    setHit({ key: entry.key, tier: entry.tier, id: Math.random() });
    const t = TIER_BY_KEY[entry.tier];
    say(`hit tier-${entry.tier}`, `+${entry.points} ${t.label.toUpperCase()}!`);
    if (entry.tier === "legendary") {
      sfx.legendary();
      setBanner({ id: Math.random() });
      if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
    } else if (entry.tier === "rare") {
      sfx.rare();
      if (navigator.vibrate) navigator.vibrate(25);
    } else sfx.correct(entry.tier);
    if (count >= ANSWERS_PER_ROUND) setTimeout(() => finish("clear"), entry.tier === "legendary" ? 1300 : 700);
  };

  const miss = () => {
    sfx.wrong();
    shakeEntry();
    onUpdate((r) => ({ ...r, misses: (r.misses || 0) + 1 }));
    say("miss", "NOT ON THE LIST");
    requestAnimationFrame(() => inputRef.current?.select());
  };

  // An exact answer was graded locally; ask the server for its proper name
  // ("shaq" → "Shaquille O'Neal") without making the player wait for it.
  const confirmInBackground = (entry, guess) => {
    api("guess", { day, round, guess, have: foundRef.current.filter((k) => k !== entry.key) })
      .then((res) => {
        if (res.result === "correct" && res.key === entry.key) {
          onUpdate((r) => ({
            ...r,
            correct: (r.correct || []).map((c) => (c.key === entry.key ? { ...c, display: res.display } : c)),
          }));
        } else if (res.result !== "correct" && res.result !== "duplicate") {
          // A hash collision with a real answer — astronomically rare, but undo it.
          foundRef.current = foundRef.current.filter((k) => k !== entry.key);
          onUpdate((r) => ({ ...r, correct: (r.correct || []).filter((c) => c.key !== entry.key) }));
        }
      })
      .catch(() => {});
  };

  const submit = async (e) => {
    e?.preventDefault();
    const guess = text.trim();
    if (!guess || pending || ending) return;

    // Fast path: exact answers and aliases are checked right here.
    const local = lookupForm(state.check, guess);
    if (local === AMBIGUOUS_FORM) {
      sfx.dupe();
      shakeEntry();
      say("dupe", "WHICH ONE? BE MORE SPECIFIC");
      return;
    }
    if (local != null && local >= 0) {
      const a = state.check.answers[local];
      if (foundRef.current.includes(a.key)) {
        const got = correct.find((c) => c.key === a.key);
        sfx.dupe();
        setText("");
        setFlashKey({ key: a.key, id: Math.random() });
        say("dupe", `ALREADY GOT ${(got?.display || guess).toUpperCase()}`);
        return;
      }
      const entry = { key: a.key, display: guess, tier: a.tier, points: a.points, share: a.share };
      celebrate(entry);
      confirmInBackground(entry, guess);
      return;
    }

    // Slow path: possible typo, so the server's fuzzy matcher decides.
    setPending(true);
    const req = api("guess", { day, round, guess, have: foundRef.current });
    pendingRef.current = req;
    try {
      const res = await req;
      if (res.result === "correct") {
        celebrate({ key: res.key, display: res.display, tier: res.tier, points: res.points, share: res.share });
      } else if (res.result === "duplicate") {
        sfx.dupe();
        setText("");
        setFlashKey({ key: res.key, id: Math.random() });
        say("dupe", `ALREADY GOT ${res.display.toUpperCase()}`);
      } else if (res.result === "ambiguous") {
        sfx.dupe();
        shakeEntry();
        say("dupe", "WHICH ONE? BE MORE SPECIFIC");
      } else {
        miss();
      }
    } catch (err) {
      say("miss", err.status === 409 ? "THIS PUZZLE HAS CLOSED" : "CONNECTION HICCUP · TRY AGAIN");
    } finally {
      pendingRef.current = null;
      setPending(false);
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  const filled = Math.ceil(frac * SEGMENTS);
  const timeTone = frac > 0.5 ? "ok" : frac > 0.25 ? "warn" : "danger";
  const secs = Math.ceil(remaining / 1000);

  return (
    <div className={`rl-screen rl-play${banner ? " has-banner" : ""}`}>
      <TopBar
        sound={sound}
        onToggleSound={onToggleSound}
        center={<RoundPill round={round} />}
        onBack={ending ? null : onHome}
      />

      <div className="rl-hud">
        <div className="rl-hud-cell">
          <span className="rl-hud-label">SCORE</span>
          <span className="rl-hud-value score">
            <CountUp value={score} duration={600} pad={3} onStep={() => sfx.count()} />
          </span>
        </div>
        <div className="rl-hud-cell center">
          <span className="rl-hud-label">FOUND</span>
          <span className="rl-hud-value">
            {correct.length}
            <span className="of">/{ANSWERS_PER_ROUND}</span>
          </span>
        </div>
        <div className={`rl-hud-cell right time-${timeTone}${secs <= 5 && !ending ? " blink-fast" : ""}`}>
          <span className="rl-hud-label">TIME</span>
          <span className="rl-hud-value">{secs}s</span>
        </div>
      </div>

      <div className={`rl-timer time-${timeTone}`} role="progressbar" aria-valuemin={0} aria-valuemax={state.seconds} aria-valuenow={secs} aria-label="Time left">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span key={i} className={i < filled ? "on" : ""} />
        ))}
      </div>

      <section className="rl-question">
        <span className="rl-cat">{state.list.category}</span>
        <h2 className="rl-question-title">{state.list.title}</h2>
        {state.list.note ? <p className="rl-question-note">{state.list.note}</p> : null}
        {state.hints?.length ? (
          <div className="rl-hints" aria-label="Letter hints">
            {state.hints.map((h, i) => {
              const got = keys.includes(h.key);
              return (
                <span key={i} className={`rl-hint${got ? " got" : ""}`} title={`An answer starting with ${h.letter}`}>
                  <PixelIcon name={got ? "check" : "bolt"} size={9} />
                  <b>{h.letter}</b>
                  <span className="rl-hint-dots">{"·".repeat(Math.min(h.words, 4))}</span>
                </span>
              );
            })}
          </div>
        ) : null}
      </section>

      <ol className="rl-slots">
        {Array.from({ length: ANSWERS_PER_ROUND }, (_, i) => {
          const c = correct[i];
          if (!c) {
            return (
              <li key={`empty-${i}`} className={`rl-slot empty${i === correct.length && !ending ? " next" : ""}`}>
                <span className="rl-slot-n">{i + 1}</span>
                <span className="rl-slot-q">? ? ?</span>
              </li>
            );
          }
          const isHit = hit?.key === c.key;
          const isFlash = flashKey?.key === c.key;
          return (
            <li
              key={c.key}
              className={`rl-slot filled tier-${c.tier}${isHit ? " pop" : ""}${isFlash ? " flash" : ""}`}
              data-flash={isFlash ? flashKey.id : undefined}
            >
              <span className="rl-slot-n">
                <PixelIcon name={c.tier} size={12} />
              </span>
              <span className="rl-slot-name">{c.display}</span>
              <TierBadge tier={c.tier} compact />
              <span className="rl-slot-pts">+{c.points}</span>
              {isHit && (c.tier === "rare" || c.tier === "legendary" || c.tier === "uncommon") ? (
                <Burst tier={c.tier} seed={hit.id} key={hit.id} />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="rl-feedback" aria-live="polite">
        {feedback ? (
          <span key={feedback.id} className={`rl-feedback-msg ${feedback.kind}`}>
            {feedback.text}
          </span>
        ) : (
          <span className="rl-feedback-msg idle">{pending ? "CHECKING…" : "TYPE AN ANSWER · WRONG GUESSES ARE FREE"}</span>
        )}
      </div>

      <form ref={formRef} className={`rl-entry${pending ? " pending" : ""}`} onSubmit={submit} onAnimationEnd={(e) => e.currentTarget.classList.remove("is-wrong")}>
        <input
          ref={inputRef}
          className="rl-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Name one…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="go"
          maxLength={80}
          disabled={Boolean(ending)}
          aria-label="Your answer"
        />
        <button type="submit" className="rl-go" disabled={!text.trim() || pending || Boolean(ending)}>
          GO
        </button>
      </form>

      <div className="rl-play-foot">
        <button
          type="button"
          className={`rl-quit${confirmQuit ? " confirm" : ""}`}
          disabled={Boolean(ending)}
          onClick={() => {
            if (confirmQuit) finish("quit");
            else {
              setConfirmQuit(true);
              setTimeout(() => setConfirmQuit(false), 2500);
            }
          }}
        >
          {confirmQuit ? "TAP AGAIN TO END ROUND" : "END ROUND EARLY"}
        </button>
      </div>

      {banner ? (
        <div className="rl-legend-banner" key={banner.id} aria-hidden>
          <span>LEGENDARY!</span>
        </div>
      ) : null}

      {ending ? (
        <div className={`rl-ending ending-${ending}`}>
          <span className="rl-ending-title">
            {ending === "clear" ? "ROUND CLEAR!" : ending === "timeup" ? "TIME UP!" : "ROUND OVER"}
          </span>
          {finishError ? (
            <span className="rl-ending-error">
              {finishError}
              <button type="button" className="rl-btn small" onClick={() => finish(ending)}>
                Retry
              </button>
            </span>
          ) : (
            <span className="rl-ending-sub blink">TALLYING RARITY…</span>
          )}
        </div>
      ) : null}
    </div>
  );
}
