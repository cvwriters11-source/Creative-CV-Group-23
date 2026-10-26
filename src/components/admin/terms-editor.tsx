"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TermsDocument } from "@/components/legal/terms-document";
import { formatTermsDate, type TermsContent, type TermsSection } from "@/lib/legal/terms";

function newSection(index: number): TermsSection {
  return {
    id: crypto.randomUUID(),
    heading: `${index}. New section`,
    body: "",
  };
}

export function TermsEditor({ initial }: { initial: TermsContent }) {
  const [title, setTitle] = useState(initial.title);
  const [lastUpdated, setLastUpdated] = useState(initial.lastUpdated);
  const [dateTouched, setDateTouched] = useState(false);
  const [sections, setSections] = useState(initial.sections);
  const [saved, setSaved] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const draft: TermsContent = useMemo(
    () => ({ title, lastUpdated, sections }),
    [title, lastUpdated, sections],
  );
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  function patchSection(id: string, patch: Partial<TermsSection>) {
    setSections((current) => current.map((section) => (section.id === id ? { ...section, ...patch } : section)));
    if (!dateTouched) setLastUpdated(formatTermsDate());
  }

  function moveSection(id: string, direction: -1 | 1) {
    setSections((current) => {
      const index = current.findIndex((section) => section.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      if (!item) return current;
      next.splice(nextIndex, 0, item);
      return next;
    });
    if (!dateTouched) setLastUpdated(formatTermsDate());
  }

  function removeSection(id: string) {
    setSections((current) => (current.length <= 1 ? current : current.filter((section) => section.id !== id)));
    if (!dateTouched) setLastUpdated(formatTermsDate());
  }

  function addSection() {
    setSections((current) => [...current, newSection(current.length + 1)]);
    if (!dateTouched) setLastUpdated(formatTermsDate());
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const payload: TermsContent = {
      title: title.trim() || saved.title,
      lastUpdated: (dateTouched ? lastUpdated : formatTermsDate()).trim() || formatTermsDate(),
      sections,
    };
    const response = await fetch("/api/admin/terms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { error?: string; terms?: TermsContent };
    setSaving(false);
    if (!response.ok || !data.terms) {
      setMessage(data.error ?? "Could not save the Terms and Conditions.");
      return;
    }
    setTitle(data.terms.title);
    setLastUpdated(data.terms.lastUpdated);
    setSections(data.terms.sections);
    setSaved(data.terms);
    setDateTouched(false);
    setMessage("Saved. The public Terms page now shows this copy.");
  }

  return (
    <div className="grid gap-6">
      <div className="card-surface p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
          <label className="grid gap-1 text-sm">
            Page title
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="field" />
          </label>
          <label className="grid gap-1 text-sm">
            Last updated
            <div className="flex gap-2">
              <input
                value={lastUpdated}
                onChange={(event) => {
                  setLastUpdated(event.target.value);
                  setDateTouched(true);
                }}
                className="field min-w-0 flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  setLastUpdated(formatTermsDate());
                  setDateTouched(true);
                }}
                className="shrink-0 rounded-xl border border-accent/30 px-3 text-xs font-semibold text-slate-200 hover:bg-white/5"
              >
                Today
              </button>
            </div>
          </label>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Blank line starts a new paragraph. Lines starting with <code>- </code> become bullets.{" "}
          <code>**bold**</code> for emphasis, <code>!!teal line!!</code> for highlighted policy lines,{" "}
          <code>= Label:</code> for a heading-style line, and <code>{"{email}"}</code> / <code>{"{phone}"}</code> for
          contact details.
        </p>
      </div>

      <div className="grid gap-4">
        {sections.map((section, index) => (
          <article key={section.id} className="card-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Section {index + 1}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moveSection(section.id, -1)}
                  disabled={index === 0}
                  className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-40"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(section.id, 1)}
                  disabled={index === sections.length - 1}
                  className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-40"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  disabled={sections.length <= 1}
                  className="rounded-lg bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/25 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>
            <label className="mt-3 grid gap-1 text-sm">
              Heading
              <input
                value={section.heading}
                onChange={(event) => patchSection(section.id, { heading: event.target.value })}
                className="field"
              />
            </label>
            <label className="mt-3 grid gap-1 text-sm">
              Body
              <textarea
                value={section.body}
                onChange={(event) => patchSection(section.id, { body: event.target.value })}
                rows={Math.min(14, Math.max(5, section.body.split("\n").length + 1))}
                className="field w-full resize-y text-sm font-normal leading-relaxed"
              />
            </label>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addSection}
          className="rounded-xl border border-accent/30 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/5"
        >
          Add section
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving || !dirty}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Terms"}
        </button>
        {dirty ? <p className="text-sm text-amber-300">Unsaved changes</p> : null}
        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
        <Link href="/terms" target="_blank" className="text-sm font-semibold text-teal-300 hover:text-teal-200">
          View public page
        </Link>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowPreview((value) => !value)}
          className="text-sm font-semibold text-slate-300 hover:text-white"
        >
          {showPreview ? "Hide preview" : "Show preview"}
        </button>
        {showPreview ? (
          <div className="mt-4 overflow-hidden rounded-2xl bg-paper text-ink-soft">
            <article className="px-5 py-10 lg:px-8">
              <TermsDocument terms={draft} />
            </article>
          </div>
        ) : null}
      </div>
    </div>
  );
}
