"use client";

// Scores a Deep Dive answer on the device, in the same shape as
// /api/deep-dive/answer, from a prompt pack sent at the start of the run.

import { scoreAnswer, revealFor } from "../../lib/deepDive/score-core";

export function hasPack(prompt) {
  return Array.isArray(prompt?.answers) && prompt.answers.length > 0;
}

export function scoreLocally(prompt, answer) {
  const observed = prompt.observed || null;
  const result = scoreAnswer(prompt, answer, observed);
  return {
    ...result,
    sharePercent: result.share == null ? null : Number((result.share * 100).toFixed(1)),
    reveal: revealFor(prompt, result.share, observed),
  };
}

// Feed a committed answer into the live answer stats without making anyone wait.
export function recordInBackground(promptId, answer) {
  fetch("/api/deep-dive/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promptId, answer }),
    keepalive: true,
  }).catch(() => {});
}
