import Link from "next/link";
import { IconDice, IconLink, IconSpy, IconRadio, IconWrench, IconArrowRight } from "./icons";

const games = [
  {
    slug: "word-streak",
    title: "Word Streak",
    tagline: "Chain",
    description: "Guess your opponent's 5-word chain before they guess yours.",
    color: "var(--teal)",
    Icon: IconLink,
    status: "play",
  },
  {
    slug: "codenames-duet",
    title: "Codenames Duet",
    tagline: "Co-op word spies",
    description: "Two-player co-op version of Codenames.",
    color: "var(--pink)",
    Icon: IconSpy,
    status: "play",
  },
  {
    slug: "wavelength",
    title: "Dial It In",
    tagline: "Wavelength-style",
    description: "Wavelength-style dial guessing game.",
    color: "var(--purple)",
    Icon: IconRadio,
    status: "soon",
  },
];

export default function Home() {
  return (
    <>
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-badge">
            <IconDice size={20} strokeWidth={2.2} />
          </span>
          DelGames
        </div>
      </nav>

      <main className="page">
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </section>
      </main>
    </>
  );
}

function GameCard({ game }) {
  const { Icon } = game;
  const content = (
    <div
      className="block"
      style={{
        padding: "1.6rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
        position: "relative",
        opacity: game.status === "soon" ? 0.75 : 1,
      }}
    >
      <div
        style={{
          width: "3.2rem",
          height: "3.2rem",
          borderRadius: "12px",
          border: "var(--border-w) solid var(--ink)",
          background: game.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={24} strokeWidth={2.2} />
      </div>

      <div>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {game.tagline}
        </div>
        <h2 style={{ fontSize: "1.4rem", marginTop: "0.15rem" }}>{game.title}</h2>
      </div>

      <p style={{ opacity: 0.8, lineHeight: 1.45, flexGrow: 1 }}>{game.description}</p>

      <span
        className="pill"
        style={{
          alignSelf: "flex-start",
          background: game.status === "play" ? "var(--green)" : "var(--panel)",
        }}
      >
        {game.status === "play" ? (
          <>
            <IconArrowRight size={14} strokeWidth={2.5} />
            Play now
          </>
        ) : (
          <>
            <IconWrench size={14} strokeWidth={2.5} />
            Coming soon
          </>
        )}
      </span>
    </div>
  );

  if (game.status !== "play") {
    return <div style={{ cursor: "not-allowed" }}>{content}</div>;
  }

  return (
    <Link href={`/${game.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      {content}
    </Link>
  );
}
