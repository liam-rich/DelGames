import { pixel } from "./fonts";
import GameGrid from "./GameGrid";
import "./home.css";

export default function Home() {
  return (
    <div className={`dg-home ${pixel.variable}`}>
      <div className="dg-crt" aria-hidden />
      <main className="dg-wrap">
        <header className="dg-hero">
          <h1 className="dg-logo" aria-label="DelGames">
            <span className="dg-logo-del">DEL</span>
            <span className="dg-logo-games">GAMES</span>
          </h1>
          <p className="dg-select">
            <span className="dg-blink">▶</span> SELECT GAME
          </p>
        </header>
        <GameGrid />
      </main>
    </div>
  );
}
