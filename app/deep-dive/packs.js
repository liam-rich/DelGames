// Themed packs. Each one narrows the prompt pool and repaints the dive:
// its own ink, its own printed pattern behind the water, its own rank names.
// Client-safe — no answers here, only what the UI needs. Counts are generated
// by the build script so the picker can't drift as prompts are added.

import { PACK_COUNTS } from "../../lib/deepDive/packCounts";

export const PACKS = [
  {
    id: "general",
    name: "Mixed Bag",
    blurb: "Everything in the bank — the widest spread of prompts.",
    ink: "var(--ink-blue)",
  },
  {
    id: "geography",
    name: "Atlas",
    blurb: "Countries, cities, rivers, deserts, islands and the odd volcano.",
    ink: "var(--ink-blue)",
  },
  {
    id: "wild",
    name: "Natural World",
    blurb: "Animals, birds, trees, fungi — plus gemstones and the night sky.",
    ink: "var(--ink-ochre)",
  },
  {
    id: "food",
    name: "The Larder",
    blurb: "Fruit, cheese, curry, biscuits and what goes on your chips.",
    ink: "var(--ink-pink)",
  },
  {
    id: "culture",
    name: "Showtime",
    blurb: "Films, bands, sport, myths and the things people argue about.",
    ink: "var(--ink-violet)",
  },
  {
    id: "everyday",
    name: "Household",
    blurb: "The ordinary stuff — rooms, tools, colours, chores, feelings.",
    ink: "var(--ink-rust)",
  },
];

export function packCount(id) {
  return PACK_COUNTS[id] ?? 0;
}

export function getPack(id) {
  return PACKS.find((p) => p.id === id) || PACKS[0];
}
