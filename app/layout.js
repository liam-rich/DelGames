import { Bricolage_Grotesque, Instrument_Sans, DM_Mono } from "next/font/google";
import { pixel } from "./fonts";
import "./globals.css";

// Self-hosted at build time by next/font — no CDN request, no silent fallback.
// (The old stylesheet asked for Space Grotesk but nothing ever fetched it.)
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "DelGames",
  description: "An arcade of word, trivia and party games.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${pixel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
