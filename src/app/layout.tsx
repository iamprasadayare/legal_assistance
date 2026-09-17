import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AOR-Briefing Assistant | Pre-Consultation Legal Fact Structuring",
  description:
    "Intelligent pre-consultation legal assistant powering instant structured legal briefs, timelines, missing evidence cards, and voice narration via Google Gemini AI.",
  keywords: [
    "Legal Brief",
    "Advocate on Record",
    "Google Gemini AI",
    "Pre-consultation legal tool",
    "Legal fact intake",
    "Web Speech TTS",
  ],
  authors: [{ name: "Prasad Ayare" }],
  openGraph: {
    title: "AOR-Briefing Assistant | Pre-Consultation Legal Fact Structuring",
    description:
      "Transform raw messy case stories into structured 3-part legal briefs with interactive timelines and audio read-aloud.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}>
      <head>
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-amber-500 focus:text-slate-950 focus:font-bold focus:rounded-b-lg focus:shadow-xl focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
