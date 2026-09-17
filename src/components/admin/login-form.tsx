"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const payload = (await response.json()) as { error?: string; redirect?: string };
    if (!response.ok) {
      setSubmitting(false);
      setMessage(payload.error ?? "Could not sign in.");
      return;
    }
    router.push(payload.redirect ?? "/admin");
    router.refresh();
  }

  return (
    <div className="bg-wash">
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="card-surface bg-paper p-6 md:p-8">
          <p className="kicker">Staff access</p>
          <h1 className="mt-3 font-serif text-4xl">Admin sign in</h1>
          <div className="brand-rule mt-4" aria-hidden />
          <p className="mt-3 text-sm text-ink-soft">
            This area is separate from job-seeker and recruiter accounts. Use the local admin credentials from
            <code className="mx-1 text-accent">.env.example</code>.
          </p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-1 text-sm">
              Email
              <input required type="email" name="email" autoComplete="username" className="field" />
            </label>
            <label className="grid gap-1 text-sm">
              Password
              <input required type="password" name="password" autoComplete="current-password" className="field" />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </form>
          {message ? <p className="mt-4 text-sm text-ink-soft">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
