"use client";

import { useState } from "react";
import { industries } from "@/lib/jobs";

export function PostJobForm({ defaultCompany }: { defaultCompany?: string }) {
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const payload = (await response.json()) as { error?: string; message?: string };
    setMessage(payload.error ?? payload.message ?? "");
  }

  return (
    <form onSubmit={onSubmit} className="card-surface mt-10 grid gap-4 bg-paper p-6">
      <h2 className="font-serif text-2xl">Post a job</h2>
      <input required name="title" placeholder="Job title" className="field" />
      <input required name="company" defaultValue={defaultCompany} placeholder="Company" className="field" />
      <input required name="location" placeholder="Location" className="field" />
      <select name="industry" className="field">
        {industries.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <select name="type" className="field">
        <option>Full-time</option>
        <option>Contract</option>
        <option>Part-time</option>
        <option>Internship</option>
      </select>
      <input name="salaryLabel" placeholder="Salary (e.g. R450k – R620k)" className="field" />
      <textarea required name="description" rows={6} placeholder="Role description" className="field" />
      <button className="rounded-full bg-accent py-3 text-sm text-ink hover:bg-accent-hover">Publish role</button>
      {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
    </form>
  );
}
