// Tiny 8-bit sound kit on the Web Audio API. Nothing is loaded from the
// network; every sound is a few square/triangle oscillators. Off by default.

let ctx = null;
let enabled = false;

export function setSoundEnabled(on) {
  enabled = Boolean(on);
  if (enabled) audio(); // unlock on the user gesture that turned it on
}

export function soundEnabled() {
  return enabled;
}

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone({ freq, to, dur = 0.08, type = "square", vol = 0.06, delay = 0 }) {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise({ dur = 0.05, vol = 0.05, delay = 0 }) {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource();
  const gain = a.createGain();
  const filter = a.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  src.buffer = buf;
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(a.destination);
  src.start(a.currentTime + delay);
}

export const sfx = {
  click() {
    tone({ freq: 660, dur: 0.04, vol: 0.04 });
  },
  rattle() {
    noise({ dur: 0.04, vol: 0.08 });
    tone({ freq: 180 + Math.random() * 120, dur: 0.03, type: "square", vol: 0.025 });
  },
  land() {
    noise({ dur: 0.08, vol: 0.1 });
    tone({ freq: 140, to: 70, dur: 0.12, type: "triangle", vol: 0.12 });
  },
  correct(tier = "common") {
    const base = { common: 523, uncommon: 587, rare: 659, legendary: 784 }[tier] || 523;
    tone({ freq: base, dur: 0.07 });
    tone({ freq: base * 1.5, dur: 0.1, delay: 0.07 });
  },
  rare() {
    [659, 831, 988, 1319].forEach((f, i) => tone({ freq: f, dur: 0.08, delay: i * 0.06, vol: 0.05 }));
  },
  legendary() {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone({ freq: f, dur: 0.1, delay: i * 0.07, vol: 0.055 }));
    tone({ freq: 2093, dur: 0.35, delay: 0.45, type: "triangle", vol: 0.06 });
  },
  wrong() {
    tone({ freq: 200, to: 110, dur: 0.18, type: "sawtooth", vol: 0.05 });
  },
  dupe() {
    tone({ freq: 330, dur: 0.06, vol: 0.04 });
    tone({ freq: 330, dur: 0.06, delay: 0.09, vol: 0.04 });
  },
  tick() {
    tone({ freq: 1200, dur: 0.025, vol: 0.03 });
  },
  count() {
    tone({ freq: 880 + Math.random() * 60, dur: 0.02, vol: 0.02 });
  },
  go() {
    tone({ freq: 392, dur: 0.1 });
    tone({ freq: 523, dur: 0.1, delay: 0.1 });
    tone({ freq: 784, dur: 0.2, delay: 0.2 });
  },
  beep() {
    tone({ freq: 440, dur: 0.12 });
  },
  timeUp() {
    [523, 415, 330, 262].forEach((f, i) => tone({ freq: f, dur: 0.14, delay: i * 0.13, vol: 0.05 }));
  },
  fanfare() {
    [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) =>
      tone({ freq: f, dur: i === 7 ? 0.4 : 0.09, delay: i * 0.1, vol: 0.05 })
    );
  },
};
