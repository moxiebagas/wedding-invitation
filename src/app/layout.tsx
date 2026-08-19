import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Great_Vibes, Playball } from "next/font/google";
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

const playball = Playball({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-playball",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Wedding of Indri & Rafi — 30.08.2026",
  description:
    "Dengan memohon rahmat Tuhan, kami mengundang Anda untuk hadir di pernikahan Indri Anjari & Muhammad Rafi Herman, Minggu 30 Agustus 2026.",
  openGraph: {
    title: "The Wedding of Indri & Rafi",
    description: "Minggu, 30 Agustus 2026 — Gedung Serba Guna HTB",
    type: "website",
    images:[
      {url: "https://www.mrafih.my.id/images/og-image.png", width: 1200, height: 630}
    ]
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
      className={`${playfair.variable} ${cormorant.variable} ${greatVibes.variable} ${playball.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
