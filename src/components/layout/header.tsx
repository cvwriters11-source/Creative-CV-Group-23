"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, Menu, X } from "lucide-react";
import { nav } from "@/lib/site";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navButtonBase =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border font-bold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

const navButtonIdle =
  "border-accent bg-white text-[#020617] hover:border-accent-hover hover:bg-accent/5 hover:text-[#020617]";

const navButtonActive = "border-accent bg-accent text-white";

const registerButton =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full bg-brand font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

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
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white [color-scheme:light]">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-5 lg:min-h-24 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/logo.jpg"
            alt="Creative-CV Group of Recruiters"
            width={720}
            height={480}
            className="h-16 w-auto object-contain object-left lg:h-[5.5rem]"
            priority
          />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-1.5 sm:flex sm:flex-wrap lg:flex-nowrap lg:gap-2">
          <nav className="flex flex-wrap items-center justify-end gap-1.5 text-sm md:gap-2 md:text-base lg:flex-1 lg:justify-center">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  navButtonBase,
                  "px-2.5 py-1.5 md:px-3 lg:px-4 lg:py-2",
                  isActive(pathname, item.href) ? navButtonActive : navButtonIdle,
                )}
              >
                {item.href === "/jobs" ? <Briefcase size={16} className="hidden lg:inline" /> : null}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            {adminLoggedIn ? (
              <Link
                href="/admin"
                className={cn(
                  navButtonBase,
                  "px-2.5 py-1.5 text-sm md:px-3 md:text-base lg:px-4 lg:py-2",
                  pathname === "/admin" || (pathname.startsWith("/admin/") && pathname !== "/admin/login")
                    ? navButtonActive
                    : navButtonIdle,
                )}
              >
                Admin
              </Link>
            ) : null}
            <Link
              href="/auth/login"
              className={cn(
                navButtonBase,
                "px-2.5 py-1.5 text-sm md:px-3 md:text-base lg:px-4 lg:py-2",
                pathname.startsWith("/auth/login") ? navButtonActive : navButtonIdle,
              )}
            >
              Sign In
            </Link>
            <Link
              href="/auth/register/job-seeker"
              className={cn(
                registerButton,
                "px-3 py-1.5 text-sm md:px-4 md:text-base lg:px-5 lg:py-2",
              )}
            >
              Register
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="relative z-10 shrink-0 rounded-full border border-accent/50 bg-white p-2 text-[#020617] hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 sm:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-slate-200 bg-white px-5 py-5 sm:hidden">
          <nav className="flex flex-col gap-2.5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  navButtonBase,
                  "w-full px-4 py-3 text-base",
                  isActive(pathname, item.href) ? navButtonActive : navButtonIdle,
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {adminLoggedIn ? (
              <Link
                href="/admin"
                className={cn(
                  navButtonBase,
                  "w-full px-4 py-3 text-base",
                  pathname.startsWith("/admin") && pathname !== "/admin/login" ? navButtonActive : navButtonIdle,
                )}
                onClick={() => setOpen(false)}
              >
                Admin
              </Link>
            ) : null}
            <Link
              href="/auth/login"
              className={cn(
                navButtonBase,
                "w-full px-4 py-3 text-base",
                pathname.startsWith("/auth/login") ? navButtonActive : navButtonIdle,
              )}
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/auth/register/job-seeker"
              className={cn(registerButton, "w-full px-4 py-3.5 text-base")}
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
