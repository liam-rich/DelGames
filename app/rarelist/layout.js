import { Press_Start_2P } from "next/font/google";
import "./rarelist.css";

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

export const metadata = {
  title: "Rarelist · DelGames",
  description: "Three lists a day. Name five answers from each — the rarer your picks, the bigger your score.",
};

export const viewport = {
  themeColor: "#0c0a1f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RarelistLayout({ children }) {
  return <div className={pixel.variable}>{children}</div>;
}
