import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Packages",
  description: "Take the next step in your career with Creative CV packages, from first job to the boardroom.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
