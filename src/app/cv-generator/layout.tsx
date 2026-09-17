import type { Metadata } from "next";
import { Caladea, Carlito } from "next/font/google";

const carlito = Carlito({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cv-sans",
  display: "swap",
});

const caladea = Caladea({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cv-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CV Generator",
  description:
    "Answer a few questions and get a polished, ATS-optimized CV. Preview with a watermark, then pay once to download.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${carlito.variable} ${caladea.variable}`}>{children}</div>;
}
