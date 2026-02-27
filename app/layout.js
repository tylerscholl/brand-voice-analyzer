import { Biryani } from "next/font/google";

const biryani = Biryani({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  variable: "--font-biryani",
});

export const metadata = {
  title: "Brand Voice Analyzer — AI-Powered Brand Audit",
  description: "Paste any URL and get an instant AI audit of brand tone, voice attributes, strengths, and actionable recommendations. Built by Tyler Scholl.",
  openGraph: {
    title: "Brand Voice Analyzer",
    description: "Instant AI-powered brand voice audit. Paste any URL.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Voice Analyzer",
    description: "Instant AI-powered brand voice audit. Paste any URL.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={biryani.variable}>
      <body style={{
        margin: 0,
        padding: 0,
        background: "#0a0a0c",
        color: "white",
        fontFamily: "var(--font-biryani), -apple-system, sans-serif",
      }}>
        {children}
      </body>
    </html>
  );
}
