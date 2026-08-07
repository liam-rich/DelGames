import "./globals.css";

export const metadata = {
  title: "DelGames",
  description: "A cozy little arcade of puzzle games for two.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
