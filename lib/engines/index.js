import * as wordStreak from "./wordStreak";
import * as codenamesDuet from "./codenamesDuet";
import * as categoryScales from "./categoryScales";

export const ENGINES = {
  "word-streak": wordStreak,
  "codenames-duet": codenamesDuet,
  wavelength: categoryScales,
};

export function getEngine(gameSlug) {
  const engine = ENGINES[gameSlug];
  if (!engine) throw new Error(`Unknown game: ${gameSlug}`);
  return engine;
}
