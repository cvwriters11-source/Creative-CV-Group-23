"use client";

import { usePathname } from "next/navigation";

export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  if (
    pathname === "/cv-generator" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/writer")
  ) {
    return null;
  }
  return <>{children}</>;
}
