"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Home,
  Package,
  PenLine,
  Settings,
  Sparkles,
  Star,
  UserRound,
  Users,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { AdminLogoutButton } from "@/components/admin/logout-button";

const links = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/customers", label: "Customers", icon: Users, aliases: ["/admin/contacts"] },
  { href: "/admin/recruiters", label: "Recruiters", icon: UserRound },
  { href: "/admin/job-seekers", label: "Job Seekers", icon: Users, aliases: ["/admin/applications", "/admin/users"] },
  { href: "/admin/jobs", label: "Job Posts", icon: Briefcase },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/generator", label: "CV Generator", icon: Sparkles },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/writers", label: "Writers", icon: PenLine },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActivePath(pathname: string, href: string, aliases?: string[]) {
  if (href === "/admin") return pathname === "/admin";
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  return Boolean(aliases?.some((alias) => pathname === alias || pathname.startsWith(`${alias}/`)));
}

export function AdminSidebar({ email, pendingCount }: { email: string; pendingCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#0b1c33] text-slate-200 lg:sticky lg:top-0 lg:h-screen lg:w-72">
      <nav className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center p-3" aria-hidden>
          <Image
            src="/logo.png"
            alt=""
            width={720}
            height={480}
            className="h-full w-full object-contain opacity-[0.16] mix-blend-screen"
          />
        </div>

        <div className="relative z-10 h-full overflow-y-auto px-3 py-3">
          <div className="rounded-xl bg-steel p-1.5 shadow-sm">
            <div className="grid grid-cols-2 gap-1 min-[520px]:grid-cols-4 lg:grid-cols-2">
              {links.map((item) => {
                const active = isActivePath(pathname, item.href, item.aliases);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={
                      item.href === "/admin" && pendingCount > 0
                        ? `Dashboard, ${pendingCount} pending orders`
                        : undefined
                    }
                    className={cn(
                      "relative flex min-h-9 items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-bold leading-tight tracking-tight whitespace-nowrap transition-colors",
                      active
                        ? "bg-white text-[#0b1c33] shadow-sm"
                        : "text-white hover:bg-white/15",
                    )}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="min-w-0">{item.label}</span>
                    {item.href === "/admin" && pendingCount > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                        {pendingCount > 99 ? "99+" : pendingCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 shrink-0 border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent">
            {email.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white" title={email}>
              {email}
            </p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
