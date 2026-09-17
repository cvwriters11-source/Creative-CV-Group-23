import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Jobs",
  description:
    "Browse job opportunities across South Africa. Create your profile, upload your CV, and apply with a single click.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
