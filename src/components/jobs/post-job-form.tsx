"use client";

import { useState } from "react";
import { industries, provinces } from "@/lib/jobs";

export function PostJobForm({ defaultCompany }: { defaultCompany?: string }) {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch("/api/jobs", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = (await response.json()) as { error?: string; message?: string };
    setMessage(payload.error ?? payload.message ?? "");
    if (response.ok) {
      form.reset();
      setPreview("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-surface mt-10 grid gap-4 bg-paper p-6">
      <h2 className="font-serif text-2xl">Post a job</h2>
      <input required name="title" placeholder="Job title" className="field" />
      <input required name="company" defaultValue={defaultCompany} placeholder="Company" className="field" />
      <label className="grid gap-1 text-sm">
        Company logo
        <div className="flex items-center gap-3">
          {preview ? <img src={preview} alt="" className="h-12 w-12 rounded-xl object-contain bg-white" /> : null}
          <input
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : "");
            }}
          />
        </div>
      </label>
      <input required name="location" placeholder="Location, e.g. Sandton" className="field" />
      <select name="province" className="field" defaultValue="Gauteng">
        {provinces.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
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
      <label className="grid gap-1 text-sm">
        Salary <span className="font-normal text-ink-soft">(optional)</span>
        <input name="salaryLabel" placeholder="e.g. R450k – R620k" className="field" />
      </label>
      <textarea required name="description" rows={6} placeholder="Role description" className="field" />
      <button className="rounded-full bg-accent py-3 text-sm text-on-accent hover:bg-accent-hover">Publish role</button>
      {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
    </form>
  );
}
