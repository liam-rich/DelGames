// Real depth markers, used for the gauge and the end-of-run rank.
// A perfect run (700 points x 10m) reaches 7000m, deep in the hadal zone.

export const MAX_DEPTH = 7000;

export const MARKERS = [
  { depth: 200, label: "Sunlight runs out" },
  { depth: 332, label: "Deepest scuba dive on record" },
  { depth: 560, label: "Emperor penguins turn back" },
  { depth: 1000, label: "Midnight zone — no daylight at all" },
  { depth: 2992, label: "Deepest whale dive ever measured" },
  { depth: 3800, label: "The Titanic" },
  // 4,000m (the abyssal plain) sits too close to the Titanic to label
  // separately — the ZONES band below already names it.
  { depth: 6000, label: "Hadal zone" },
];

// Named bands, deepest last. `rank` is what the player is told they reached.
export const ZONES = [
  { from: 0, name: "Sunlit Zone", rank: "Paddler", tint: "#7fd4ff" },
  { from: 200, name: "Twilight Zone", rank: "Free Diver", tint: "#2b9fe0" },
  { from: 1000, name: "Midnight Zone", rank: "Deep Diver", tint: "#12639f" },
  { from: 3000, name: "Wreck Depth", rank: "Wreck Hunter", tint: "#0d3f6b" },
  { from: 4000, name: "Abyssal Zone", rank: "Abyssonaut", tint: "#0a2b4a" },
  { from: 6000, name: "Hadal Zone", rank: "Trench Diver", tint: "#04101f" },
];

export function zoneFor(depth) {
  let current = ZONES[0];
  for (const zone of ZONES) if (depth >= zone.from) current = zone;
  return current;
}

// 0 at the surface, 1 at the trench floor — drives the background darkening.
export function descentFraction(depth) {
  return Math.max(0, Math.min(1, depth / MAX_DEPTH));
}

// Where a depth sits on the gauge, as a percentage. Deliberately non-linear:
// most dives finish in the top 2000m, and on a linear scale the shallow
// markers collapse into each other at the very top of the rail.
export function gaugePosition(depth) {
  return Math.pow(descentFraction(depth), 0.55) * 100;
}

export function formatDepth(depth) {
  return `${Math.round(depth).toLocaleString()}m`;
}
