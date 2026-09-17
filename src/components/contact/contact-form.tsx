"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "Could not send your message.");
      return;
    }
    setStatus("done");
    setMessage(payload.message ?? "Thank you. We typically respond within 24 hours.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="card-surface bg-paper p-6 md:p-8">
      <h2 className="font-serif text-2xl">Send Us a Message</h2>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm">
          Name
          <input required name="name" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Email
          <input required type="email" name="email" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Phone
          <input name="phone" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Message
          <textarea required name="message" rows={6} className="field" />
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-full bg-accent py-3 text-sm text-ink hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
      {message ? <p className="mt-4 text-sm text-ink-soft">{message}</p> : null}
    </form>
  );
}
