"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@/lib/auth-types";

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("job_seeker");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        role,
      }),
    });
    const payload = (await response.json()) as { error?: string; redirect?: string };
    if (!response.ok) {
      setMessage(payload.error ?? "Could not sign in.");
      return;
    }
    router.push(payload.redirect ?? (role === "recruiter" ? "/dashboard/recruiter" : "/dashboard"));
    router.refresh();
  }

  return (
    <div className="bg-wash">
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="card-surface bg-paper p-6 md:p-8">
          <p className="kicker">Sign In</p>
          <h1 className="mt-3 font-serif text-4xl">Welcome back</h1>
          <div className="brand-rule mt-4" aria-hidden />
          <div className="mt-6 grid grid-cols-2 rounded-full border border-accent/25 bg-gold-soft/50 p-1">
            <button
              type="button"
              onClick={() => setRole("job_seeker")}
              className={`rounded-full py-2 text-sm ${role === "job_seeker" ? "bg-accent text-ink" : "text-ink-soft"}`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`rounded-full py-2 text-sm ${role === "recruiter" ? "bg-accent text-ink" : "text-ink-soft"}`}
            >
              Recruiter
            </button>
          </div>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <input required type="email" name="email" placeholder="Email" className="field" />
            <input required type="password" name="password" placeholder="Password" className="field" />
            <button type="submit" className="rounded-full bg-accent py-3 text-sm text-ink hover:bg-accent-hover">
              Sign In
            </button>
          </form>
          {message ? <p className="mt-4 text-sm text-ink-soft">{message}</p> : null}
          <p className="mt-6 text-sm text-ink-soft">
            New here?{" "}
            <Link
              href={role === "recruiter" ? "/auth/register/recruiter" : "/auth/register/job-seeker"}
              className="content-link"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
