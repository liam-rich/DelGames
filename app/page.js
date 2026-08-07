import Link from "next/link";

const games = [
  {
    slug: "word-streak",
    title: "Word Streak",
    tagline: "Chain",
    description:
      "One of you builds a 5-word chain. The other guesses each word letter by letter — reveal a letter or take a shot.",
    color: "var(--teal)",
    emoji: "🔗",
    status: "play",
  },
  {
    slug: "codenames-duet",
    title: "Codenames Duet",
    tagline: "Co-op word spies",
    description:
      "Two secret grids, one shared board. Give clues, find your agents, and avoid the assassin — together.",
    color: "var(--pink)",
    emoji: "🕵️",
    status: "soon",
  },
  {
    slug: "wavelength",
    title: "Dial It In",
    tagline: "Wavelength-style",
    description:
      "One of you sets a secret spot on the dial and gives a category. The other tries to land the needle.",
    color: "var(--purple)",
    emoji: "📡",
    status: "soon",
  },
];

export default function Home() {
  return (
    <>
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-badge">🎲</span>
          DelGames
        </div>
        <span className="pill">for two 💛</span>
      </nav>

      <main className="page">
        <header style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)" }}>
            Puzzle night, all in one place.
          </h1>
          <p style={{ marginTop: "0.8rem", fontSize: "1.15rem", maxWidth: 560, opacity: 0.85 }}>
            The games we keep coming back to — bundled up, colorful, and ready
            whenever you are.
          </p>
        </header>

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

        <footer style={{ marginTop: "3.5rem", opacity: 0.6, fontSize: "0.9rem" }}>
          More games get added when we get hooked on something new.
        </footer>
      </main>
    </>
  );
}

function GameCard({ game }) {
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
          fontSize: "1.6rem",
        }}
      >
        {game.emoji}
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
        {game.status === "play" ? "▶ Play now" : "🛠 Coming soon"}
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
