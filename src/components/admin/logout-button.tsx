"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/auth/login");
        router.refresh();
      }}
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}
