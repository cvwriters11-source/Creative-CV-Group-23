"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { nav } from "@/lib/site";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navButtonBase =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border text-sm font-extrabold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:text-[15px] lg:text-base";

const navButtonIdle =
  "border-transparent bg-steel text-white hover:bg-steel-hover";

const navButtonActive = "border-transparent bg-accent text-on-accent ring-1 ring-on-accent/20";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { authenticated?: boolean }) => {
        if (!cancelled) setAdminLoggedIn(Boolean(payload.authenticated));
      })
      .catch(() => {
        if (!cancelled) setAdminLoggedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfca] bg-white">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-5 lg:min-h-24 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <BrandLogo className="h-12 w-auto object-contain object-left sm:h-14 lg:h-16" />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-1 lg:flex lg:flex-nowrap lg:justify-center lg:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                navButtonBase,
                "shrink-0 px-2.5 py-1.5 md:px-3 lg:px-4 lg:py-2",
                isActive(pathname, item.href) ? navButtonActive : navButtonIdle,
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={adminLoggedIn ? "/admin" : "/auth/login"}
            className={cn(
              navButtonBase,
              "shrink-0 px-2.5 py-1.5 md:px-3 lg:px-4 lg:py-2",
              pathname.startsWith("/auth/login") ||
                (adminLoggedIn && pathname.startsWith("/admin") && pathname !== "/admin/login")
                ? navButtonActive
                : navButtonIdle,
            )}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register/job-seeker"
            className={cn(
              navButtonBase,
              "shrink-0 px-3 py-1.5 md:px-4 lg:px-5 lg:py-2",
              pathname.startsWith("/auth/register")
                ? navButtonActive
                : "border-transparent bg-accent text-on-accent hover:bg-accent-hover",
            )}
          >
            Register
          </Link>
        </nav>

        <button
          type="button"
          className="relative z-10 shrink-0 rounded-full border border-accent/50 bg-white p-2 text-[#020617] hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-2.5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  navButtonBase,
                  "w-full px-4 py-3 text-base font-extrabold",
                  isActive(pathname, item.href) ? navButtonActive : navButtonIdle,
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={adminLoggedIn ? "/admin" : "/auth/login"}
              className={cn(
                navButtonBase,
                "w-full px-4 py-3 text-base",
                pathname.startsWith("/auth/login") ||
                  (adminLoggedIn && pathname.startsWith("/admin") && pathname !== "/admin/login")
                  ? navButtonActive
                  : navButtonIdle,
              )}
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/auth/register/job-seeker"
              className={cn(
                navButtonBase,
                "w-full px-4 py-3.5 text-base",
                pathname.startsWith("/auth/register")
                  ? navButtonActive
                  : "border-transparent bg-accent text-on-accent hover:bg-accent-hover",
              )}
              onClick={() => setOpen(false)}
            >
              Register
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
