"use client";

import { useRouter } from "next/navigation";

export function WriterLogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
      onClick={async () => {
        await fetch("/api/writer/logout", { method: "POST" });
        router.push("/writer/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
