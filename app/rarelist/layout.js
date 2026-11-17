import { pixel } from "../fonts";
import "./rarelist.css";

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
