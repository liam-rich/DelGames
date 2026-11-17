"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { dayIndex, rollDice, ROUNDS_PER_DAY, REROLLS_PER_DAY } from "../../lib/rarelist/core";
import { api } from "./api";
import { setSoundEnabled, sfx } from "./sound";
import Title from "./screens/Title";
import DicePhase from "./screens/DicePhase";
import Play from "./screens/Play";
import RoundEnd from "./screens/RoundEnd";
import Results from "./screens/Results";
import FinalView from "./screens/FinalView";

// ---------------------------------------------------------------------------
// Local persistence. Everything is wrapped — private mode or blocked storage
// just means progress isn't remembered across reloads.
// ---------------------------------------------------------------------------

const dayKey = (d) => `rarelist:day:${d}`;

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function playerId() {
  let id = null;
  try {
    id = localStorage.getItem("rarelist:player");
  } catch {}
  if (!id || !/^[a-z0-9]{8,40}$/i.test(id)) {
    const bytes = new Uint8Array(12);
    (globalThis.crypto || window.crypto).getRandomValues(bytes);
    id = Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 20);
    try {
      localStorage.setItem("rarelist:player", id);
    } catch {}
  }
  return id;
}


function nextRoundIndex(game) {
  for (let r = 0; r < ROUNDS_PER_DAY; r++) if (!game.rounds[r]?.done) return r;
  return ROUNDS_PER_DAY;
}

// Keep the play screen pinned to the *visible* viewport, so the on-screen
// keyboard never pushes the input or timer out of view.
function useVisualViewport(ref, ready) {
  const [size, setSize] = useState("");
  useEffect(() => {
    const vv = window.visualViewport;
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const h = vv ? vv.height : window.innerHeight;
      el.style.setProperty("--vvh", `${h}px`);
      el.style.setProperty("--vvtop", `${vv ? vv.offsetTop : 0}px`);
      // Kept in React state: toggling classes directly would be wiped by the
      // next render of the shell's className.
      setSize(h < 520 ? "is-short is-tiny" : h < 640 ? "is-short" : "");
    };
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, ready]);
  return size;
}

export default function RarelistApp() {
  const shellRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [pid, setPid] = useState(null);
  const [day, setDay] = useState(null);
  const [game, setGame] = useState(null);
  const [prev, setPrev] = useState(null);
  const [screen, setScreen] = useState("title");
  // The round on screen. Pinned separately from "next unplayed round" so the
  // play and summary screens don't jump ahead the moment a round is saved.
  const [active, setActive] = useState(0);
  const [sound, setSound] = useState(false);

  const vpClass = useVisualViewport(shellRef, ready);

  useEffect(() => {
    const d = dayIndex();
    const id = playerId();
    const g = load(dayKey(d)) || { day: d, rounds: [] };
    const p = load(dayKey(d - 1));
    let soundOn = false;
    try {
      soundOn = localStorage.getItem("rarelist:sound") === "on";
    } catch {}
    setSoundEnabled(soundOn);
    setSound(soundOn);
    setPid(id);
    setDay(d);
    setGame(g);
    setPrev(p && p.rounds?.some((r) => r?.done) ? p : null);

    // Mid-round on reload: the clock kept running, so drop straight back in.
    const r = nextRoundIndex(g);
    setActive(Math.min(r, ROUNDS_PER_DAY - 1));
    if (r < ROUNDS_PER_DAY && g.rounds[r]?.startedAt) setScreen("play");
    setReady(true);
  }, []);

  const updateGame = useCallback(
    (fn) => {
      setGame((g) => {
        const next = fn(structuredClone(g));
        save(dayKey(next.day), next);
        return next;
      });
    },
    []
  );

  const updatePrev = useCallback((fn) => {
    setPrev((p) => {
      const next = fn(structuredClone(p));
      save(dayKey(next.day), next);
      return next;
    });
  }, []);

  // Rounds are graded on the device; the result is posted afterwards so the
  // player never waits on it. Retries with backoff, and again on next load.
  const submitRound = useCallback(
    async (d, round, keys, attempt = 0) => {
      try {
        const res = await api("finish", { playerId: playerId(), day: d, round, keys });
        updateGame((g) => {
          const r = g.day === d && g.rounds[round];
          if (r) {
            r.submitted = true;
            if (r.summary) r.summary.players = res.players;
          }
          return g;
        });
      } catch (e) {
        if (e.status && e.status < 500) return; // e.g. the day has closed
        if (attempt < 5) setTimeout(() => submitRound(d, round, keys, attempt + 1), 2000 * 2 ** attempt);
      }
    },
    [updateGame]
  );

  useEffect(() => {
    if (!ready) return;
    game.rounds.forEach((r, i) => {
      if (r?.done && r.submitted === false) submitRound(game.day, i, (r.correct || []).map((c) => c.key));
    });
    // Also wake the API now, so a cold server start never lands mid-game.
    api("today").catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const toggleSound = useCallback(() => {
    setSound((s) => {
      const on = !s;
      setSoundEnabled(on);
      try {
        localStorage.setItem("rarelist:sound", on ? "on" : "off");
      } catch {}
      if (on) sfx.click();
      return on;
    });
  }, []);

  useEffect(() => {
    if (shellRef.current) shellRef.current.scrollTop = 0;
    window.scrollTo?.(0, 0);
  }, [screen]);

  if (!ready) {
    return <div className="rl-shell" ref={shellRef} />;
  }

  const r = nextRoundIndex(game);
  const common = { sound, onToggleSound: toggleSound, day, game };

  let body = null;
  if (screen === "title") {
    body = (
      <Title
        {...common}
        prev={prev}
        playerId={pid}
        onUpdatePrev={updatePrev}
        onOpenFinal={() => setScreen("final")}
        onStart={() => {
          if (r >= ROUNDS_PER_DAY) return setScreen("results");
          setActive(r);
          setScreen(game.rounds[r]?.startedAt ? "play" : "dice");
        }}
      />
    );
  } else if (screen === "dice") {
    body = (
      <DicePhase
        key={`dice-${r}`}
        {...common}
        round={r}
        roll={game.rolls?.[r] || 0}
        dice={rollDice(pid, day, r, game.rolls?.[r] || 0)}
        rerollsLeft={Math.max(0, REROLLS_PER_DAY - Object.values(game.rolls || {}).reduce((a, b) => a + b, 0))}
        onReroll={() =>
          updateGame((g) => {
            g.rolls = { ...(g.rolls || {}), [r]: (g.rolls?.[r] || 0) + 1 };
            return g;
          })
        }
        playerId={pid}
        onHome={() => setScreen("title")}
        onBegin={(setup) => {
          updateGame((g) => {
            g.rounds[r] = { ...setup, startedAt: Date.now(), correct: [], misses: 0, done: false };
            return g;
          });
          setActive(r);
          setScreen("play");
        }}
      />
    );
  } else if (screen === "play") {
    body = (
      <Play
        key={`play-${active}`}
        {...common}
        round={active}
        state={game.rounds[active]}
        playerId={pid}
        onUpdate={(fn) =>
          updateGame((g) => {
            g.rounds[active] = fn(g.rounds[active]);
            return g;
          })
        }
        onDone={() => setScreen("roundEnd")}
        onHome={() => setScreen("title")}
        onSubmit={(round, keys) => submitRound(day, round, keys)}
      />
    );
  } else if (screen === "roundEnd") {
    body = (
      <RoundEnd
        {...common}
        round={active}
        state={game.rounds[active]}
        onNext={() => setScreen(r >= ROUNDS_PER_DAY ? "results" : "dice")}
      />
    );
  } else if (screen === "results") {
    body = <Results {...common} onHome={() => setScreen("title")} />;
  } else if (screen === "final") {
    body = <FinalView {...common} prev={prev} onHome={() => setScreen("title")} />;
  }

  return (
    <div className={`rl-shell screen-${screen} ${vpClass}`} ref={shellRef}>
      <div className="rl-crt" aria-hidden />
      {body}
    </div>
  );
}
