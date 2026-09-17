"use client";

import { useState } from "react";

export function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const body = {
      jobId,
      jobTitle,
      fullName: String(new FormData(form).get("fullName") ?? ""),
      email: String(new FormData(form).get("email") ?? ""),
      coverNote: String(new FormData(form).get("coverNote") ?? ""),
    };
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "Could not submit application.");
      return;
    }
    setStatus("done");
    setMessage(payload.message ?? "Application submitted.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3">
      <input required name="fullName" placeholder="Full name" className="field" />
      <input required type="email" name="email" placeholder="Email" className="field" />
      <textarea name="coverNote" rows={4} placeholder="Cover note (optional)" className="field" />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-accent py-3 text-sm text-ink hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Apply"}
      </button>
      {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
    </form>
  );
}
