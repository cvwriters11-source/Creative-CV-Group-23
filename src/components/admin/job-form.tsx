"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { industries, provinces } from "@/lib/jobs";
import type { AdminJob } from "@/lib/admin/types";

export function AdminJobForm({ job }: { job?: AdminJob }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const editing = Boolean(job);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = {
      id: job?.id,
      title: form.get("title"),
      company: form.get("company"),
      location: form.get("location"),
      province: form.get("province"),
      industry: form.get("industry"),
      type: form.get("type"),
      salaryLabel: form.get("salaryLabel"),
      description: form.get("description"),
      requirementsText: form.get("requirementsText"),
      featured: form.get("featured") === "on",
      published: form.get("published") === "on",
    };
    const response = await fetch("/api/admin/jobs", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) {
      setMessage(data.error ?? "Could not save the job.");
      return;
    }
    router.push("/admin/jobs");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card-surface mt-8 grid gap-4 bg-paper p-6">
      <label className="grid gap-1 text-sm">
        Job title
        <input required name="title" defaultValue={job?.title} className="field" />
      </label>
      <label className="grid gap-1 text-sm">
        Company
        <input required name="company" defaultValue={job?.company} className="field" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Location
          <input required name="location" defaultValue={job?.location} className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Province
          <select name="province" defaultValue={job?.province ?? "Gauteng"} className="field">
            {provinces.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Industry
          <select name="industry" defaultValue={job?.industry} className="field">
            {industries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Type
          <select name="type" defaultValue={job?.type ?? "Full-time"} className="field">
            <option>Full-time</option>
            <option>Contract</option>
            <option>Part-time</option>
            <option>Internship</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        Salary label
        <input name="salaryLabel" defaultValue={job?.salaryLabel} placeholder="R450k – R620k" className="field" />
      </label>
      <label className="grid gap-1 text-sm">
        Description
        <textarea required name="description" rows={6} defaultValue={job?.description} className="field" />
      </label>
      <label className="grid gap-1 text-sm">
        Requirements (one per line)
        <textarea name="requirementsText" rows={4} defaultValue={job?.requirements.join("\n")} className="field" />
      </label>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={job?.published ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={job?.featured} />
          Featured
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
      >
        {saving ? "Saving…" : editing ? "Save job" : "Post job"}
      </button>
      {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
    </form>
  );
}
