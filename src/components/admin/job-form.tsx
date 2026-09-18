"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { industries, provinces } from "@/lib/jobs";
import type { AdminJob } from "@/lib/admin/types";
import { JobLogo } from "@/components/jobs/job-logo";

export function AdminJobForm({ job }: { job?: AdminJob }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");
  const editing = Boolean(job);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/jobs", {
      method: editing ? "PATCH" : "POST",
      body: new FormData(event.currentTarget),
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
      {editing ? <input type="hidden" name="id" value={job?.id} /> : null}
      <label className="grid gap-1 text-sm">
        Job title
        <input required name="title" defaultValue={job?.title} className="field" placeholder="e.g. Financial Accountant" />
      </label>
      <label className="grid gap-1 text-sm">
        Company
        <input required name="company" defaultValue={job?.company} className="field" placeholder="Company name" />
      </label>
      <label className="grid gap-1 text-sm">
        Company logo
        <div className="flex flex-wrap items-center gap-3">
          {preview ? (
            <img src={preview} alt="" className="h-12 w-12 rounded-xl object-contain bg-white" />
          ) : job ? (
            <JobLogo job={job} />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xs text-slate-300">
              Logo
            </span>
          )}
          <input
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
            className="text-sm"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : "");
            }}
          />
        </div>
        <span className="text-xs text-ink-soft">PNG, JPG, or WEBP. Shown on the jobs board.</span>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Location
          <input
            required
            name="location"
            defaultValue={job?.location}
            className="field"
            placeholder="City or area, e.g. Sandton"
          />
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
        Salary <span className="font-normal text-ink-soft">(optional)</span>
        <input
          name="salaryLabel"
          defaultValue={job?.salaryLabel}
          placeholder="e.g. R450k – R620k"
          className="field"
        />
        <span className="text-xs text-ink-soft">Leave blank if you do not want a salary shown on the listing.</span>
      </label>
      <label className="grid gap-1 text-sm">
        Description
        <textarea required name="description" rows={6} defaultValue={job?.description} className="field" />
      </label>
      <label className="grid gap-1 text-sm">
        Requirements (one per line)
        <textarea name="requirementsText" rows={4} defaultValue={(job?.requirements ?? []).join("\n")} className="field" />
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
        className="rounded-full bg-accent py-3 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-60"
      >
        {saving ? "Saving…" : editing ? "Save job" : "Post job"}
      </button>
      {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
    </form>
  );
}
