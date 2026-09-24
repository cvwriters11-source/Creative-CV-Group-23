import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Generator",
  description: "Check your CV against ATS systems and chat with Samuel T, your Creative CV advisor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
