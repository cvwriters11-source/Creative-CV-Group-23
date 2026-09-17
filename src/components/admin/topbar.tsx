"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const titles: Array<{ match: (path: string) => boolean; title: string }> = [
  { match: (path) => path === "/admin", title: "Dashboard" },
  { match: (path) => path.startsWith("/admin/orders"), title: "Orders" },
  { match: (path) => path.startsWith("/admin/customers") || path.startsWith("/admin/contacts"), title: "Customers" },
  { match: (path) => path.startsWith("/admin/recruiters"), title: "Recruiters" },
  { match: (path) => path.startsWith("/admin/job-seekers") || path.startsWith("/admin/applications") || path.startsWith("/admin/users"), title: "Job Seekers" },
  { match: (path) => path.startsWith("/admin/jobs"), title: "Job Posts" },
  { match: (path) => path.startsWith("/admin/packages"), title: "Packages" },
  { match: (path) => path.startsWith("/admin/generator"), title: "CV Generator" },
  { match: (path) => path.startsWith("/admin/reviews"), title: "Reviews" },
  { match: (path) => path.startsWith("/admin/writers"), title: "Writers" },
  { match: (path) => path.startsWith("/admin/settings"), title: "Settings" },
];

export function AdminTopbar({ pendingCount }: { pendingCount: number }) {
  const pathname = usePathname();
  const title = titles.find((item) => item.match(pathname))?.title ?? "Admin";

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
      <h1 className="text-base font-semibold text-slate-800">{title}</h1>
      <Link
        href="/admin/orders"
        className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        aria-label={pendingCount ? `${pendingCount} pending orders` : "Orders"}
      >
        <Bell size={18} />
        {pendingCount > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {pendingCount > 99 ? "99+" : pendingCount}
          </span>
        ) : null}
      </Link>
    </header>
  );
}
