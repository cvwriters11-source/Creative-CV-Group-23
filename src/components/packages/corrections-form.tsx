"use client";

import { useState } from "react";

export function ClientCorrectionsForm() {
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setOk(false);
    const form = event.currentTarget;
    const response = await fetch("/api/orders/corrections", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) {
      setMessage(payload.error ?? "Could not send corrections.");
      return;
    }
    form.reset();
    setOk(true);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <label className="grid gap-1 text-sm">
        Order number
        <input required name="orderNumber" className="field" placeholder="Revamp001" />
      </label>
      <label className="grid gap-1 text-sm">
        Email used on the order
        <input required type="email" name="email" className="field" />
      </label>
      <label className="grid gap-1 text-sm">
        Corrections
        <textarea required name="message" rows={6} className="field" placeholder="Tell us what to change" />
      </label>
      <label className="grid gap-1 text-sm">
        Optional file
        <input name="file" type="file" />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-accent py-3 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-60"
      >
        {saving ? "Sending…" : "Send corrections"}
      </button>
      {ok ? (
        <p className="text-sm text-emerald-700">
          Corrections received. Your writer has been notified and this now appears on the admin and writer dashboards.
        </p>
      ) : null}
      {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
    </form>
  );
}
