"use client";

import { usePathname } from "next/navigation";

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

export function AdminTopbar() {
  const pathname = usePathname();
  const title = titles.find((item) => item.match(pathname))?.title ?? "Admin";

  return (
    <header className="flex items-center border-b border-accent/20 bg-[#07111a]/80 px-4 py-3 backdrop-blur-md lg:px-8">
      <h1 className="text-base font-semibold text-white">{title}</h1>
    </header>
  );
}
