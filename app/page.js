import Link from "next/link";
import { IconDice, IconLink, IconSpy, IconRadio, IconWaves, IconArrowRight, IconUsers, IconUser } from "./icons";

const games = [
  {
    slug: "word-streak",
    title: "Word Streak",
    tagline: "Chain",
    description: "Guess your opponent's five-word chain before they guess yours.",
    ink: "var(--ink-blue)",
    players: "2 players",
    Icon: IconLink,
  },
  {
    slug: "codenames-duet",
    title: "Codenames Duet",
    tagline: "Co-op word spies",
    description: "Two clue-givers, one board, fifteen agents and no room for error.",
    ink: "var(--ink-pink)",
    players: "2 players",
    Icon: IconSpy,
  },
  {
    slug: "wavelength",
    title: "Category Scales",
    tagline: "Wavelength, reversed",
    description: "One of you marks a scale in secret; the other invents the category.",
    ink: "var(--ink-violet)",
    players: "2 players",
    Icon: IconRadio,
  },
  {
    slug: "deep-dive",
    title: "Deep Dive",
    tagline: "Rarity chase",
    description: "Seven prompts, 25 seconds each. The rarer your answer, the deeper you sink.",
    ink: "var(--ink-ochre)",
    players: "Solo",
    Icon: IconWaves,
  },
  {
    slug: "rarelist",
    title: "Rarelist",
    tagline: "Daily trivia",
    description: "Three lists a day, the same for everyone. Name five from each — rarer answers score more.",
    ink: "var(--ink-rust)",
    players: "Solo",
    Icon: IconDice,
  },
];

export default function Home() {
  return (
    <>
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-badge">
            <IconDice size={19} strokeWidth={2.2} />
          </span>
          DelGames
        </div>
        <span className="pill">{games.length} games</span>
      </nav>

      <main className="page">
        <header style={{ margin: "var(--s6) 0 var(--s7)" }}>
          <p className="eyebrow" style={{ marginBottom: "var(--s2)" }}>Printed for games night</p>
          <h1 style={{ maxWidth: "15ch" }}>The games we keep coming back to.</h1>
          <p style={{ marginTop: "var(--s4)", fontSize: "1.05rem", opacity: 0.75, maxWidth: "44ch" }}>
            Five of them. Three you play with someone else, two you play alone
            when nobody's around.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
            gap: "var(--s5)",
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
  const Players = game.players === "Solo" ? IconUser : IconUsers;

  return (
    <Link href={`/${game.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        className="block tint"
        style={{
          "--tint-ink": game.ink,
          padding: "var(--s5)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "var(--s3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--s3)" }}>
          <span
            style={{
              width: "2.9rem",
              height: "2.9rem",
              borderRadius: "50%",
              border: "var(--border-w) solid var(--ink)",
              background: game.ink,
              color: "var(--stock-bright)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={22} strokeWidth={2.2} />
          </span>
          <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "var(--s1)", opacity: 0.55 }}>
            <Players size={13} strokeWidth={2.4} />
            {game.players}
          </span>
        </div>

        <div>
          <p className="eyebrow" style={{ marginBottom: "0.1rem" }}>{game.tagline}</p>
          <h2 style={{ fontSize: "1.45rem" }}>{game.title}</h2>
        </div>

        <p style={{ opacity: 0.78, lineHeight: 1.5, flexGrow: 1, fontSize: "0.95rem" }}>{game.description}</p>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--s2)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.9rem",
            borderBottom: "2.5px solid var(--ink-pink)",
            alignSelf: "flex-start",
            paddingBottom: "1px",
          }}
        >
          Play
          <IconArrowRight size={15} strokeWidth={2.6} />
        </span>
      </article>
    </Link>
  );
}
