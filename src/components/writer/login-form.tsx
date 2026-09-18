"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function WriterLoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/writer/login", {
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
    router.push(payload.redirect ?? "/writer");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0b1c33]">
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Writer access</p>
          <h1 className="mt-3 font-serif text-4xl text-slate-900">Writer sign in</h1>
          <p className="mt-3 text-sm text-slate-500">
            This dashboard only shows work assigned to you. It is separate from the admin console.
          </p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-1 text-sm text-slate-600">
              Email
              <input required type="email" name="email" autoComplete="username" className="field" />
            </label>
            <label className="grid gap-1 text-sm text-slate-600">
              Password
              <input required type="password" name="password" autoComplete="current-password" className="field" />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-accent py-3 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Open writer dashboard"}
            </button>
          </form>
          {message ? <p className="mt-4 text-sm text-slate-500">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
