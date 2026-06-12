import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-greatvibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Wedding of Indri & Rafi — 30.08.2026",
  description:
    "Dengan memohon rahmat Tuhan, kami mengundang Anda untuk hadir di pernikahan Indri Anjari & Muhammad Rafi Herman, Minggu 30 Agustus 2026.",
  openGraph: {
    title: "The Wedding of Indri & Rafi",
    description: "Minggu, 30 Agustus 2026 — Kelenteng HOK TEK BIO Ciamis",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${cormorant.variable} ${greatVibes.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
