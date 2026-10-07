"use client";

import { useState } from "react";
import { countryCallingCodes, defaultCountryDial } from "@/lib/phone-codes";
import { formatPreferredSlot, meetingTopics, type MeetingSlot } from "@/lib/meetings";

export function MeetingForm({
  selected,
  onSubmitted,
}: {
  selected: MeetingSlot | null;
  onSubmitted?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) {
      setStatus("error");
      setMessage("Please choose a date and time on the calendar.");
      return;
    }
    setStatus("submitting");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        preferredDate: selected.date,
        preferredTime: selected.time,
      }),
    });
    const payload = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "Could not send your meeting request.");
      onSubmitted?.();
      return;
    }
    setStatus("done");
    setMessage(payload.message ?? "Your request is in. Admin will approve it before the Teams link is sent.");
    form.reset();
    onSubmitted?.();
  }

  return (
    <form onSubmit={onSubmit} className="card-surface h-fit bg-paper p-6 md:sticky md:top-24 md:p-8">
      <h2 className="font-serif text-2xl">Your details</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Complete your details after choosing a slot. Admin accepts the date and time before it is marked booked.
      </p>
      <div className="mt-6 rounded-2xl border border-line bg-paper-deep px-4 py-3 text-sm">
        {selected ? (
          <p>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">Selected slot</span>
            <span className="mt-1 block text-ink">{formatPreferredSlot(selected.date, selected.time)}</span>
          </p>
        ) : (
          <p className="text-ink-soft">Choose a date and time on the calendar first.</p>
        )}
      </div>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm">
          Full name
          <input required name="fullName" autoComplete="name" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Email
          <input required type="email" name="email" autoComplete="email" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Phone number
          <span className="grid grid-cols-[9.5rem_1fr] gap-2">
            <select required name="countryCode" defaultValue={defaultCountryDial} className="field" aria-label="Country code">
              {countryCallingCodes.map((item) => (
                <option key={`${item.iso}-${item.dial}`} value={item.dial}>
                  {item.iso} {item.dial}
                </option>
              ))}
            </select>
            <input
              required
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              aria-label="Phone number"
              placeholder="74 650 2580"
              className="field"
            />
          </span>
        </label>
        <label className="grid gap-1 text-sm">
          What is the meeting about?
          <select required name="topic" defaultValue="" className="field">
            <option value="" disabled>
              Select a topic
            </option>
            {meetingTopics.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Anything we should know?
          <textarea name="notes" rows={4} className="field" placeholder="Role you are targeting, questions, or another time that could work" />
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "submitting" || !selected}
        className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-bold uppercase tracking-[0.14em] text-on-accent hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request meeting"}
      </button>
      {message ? <p className="mt-4 text-sm leading-relaxed text-ink-soft">{message}</p> : null}
    </form>
  );
}
