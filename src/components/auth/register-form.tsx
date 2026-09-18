"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@/lib/auth-types";

export function RegisterForm({ role }: { role: UserRole }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const isRecruiter = role === "recruiter";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        fullName: form.get("fullName"),
        email: form.get("email"),
        password: form.get("password"),
        company: form.get("company"),
      }),
    });
    const payload = (await response.json()) as { error?: string; redirect?: string };
    if (!response.ok) {
      setMessage(payload.error ?? "Could not create your account.");
      return;
    }
    router.push(payload.redirect ?? (isRecruiter ? "/dashboard/recruiter" : "/dashboard"));
    router.refresh();
  }

  return (
    <div className="bg-wash">
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="card-surface bg-paper p-6 md:p-8">
          <p className="kicker">Register</p>
          <h1 className="mt-3 font-serif text-4xl">{isRecruiter ? "Recruiter account" : "Job seeker account"}</h1>
          <div className="brand-rule mt-4" aria-hidden />
          <p className="mt-3 text-ink-soft">
            {isRecruiter
              ? "Post roles and review applications from Creative CV candidates."
              : "Create your profile, upload a CV, apply in one click, and set job alerts."}
          </p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <input required name="fullName" placeholder="Full name" className="field" />
            {isRecruiter ? <input required name="company" placeholder="Company" className="field" /> : null}
            <input required type="email" name="email" placeholder="Email" className="field" />
            <input required type="password" name="password" minLength={8} placeholder="Password" className="field" />
            <button type="submit" className="rounded-full bg-accent py-3 text-sm text-on-accent hover:bg-accent-hover">
              Create account
            </button>
          </form>
          {message ? <p className="mt-4 text-sm text-ink-soft">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
