"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DRAFT_STORAGE_KEY,
  emptyDraft,
  emptyEmployment,
  hydrateDraft,
  steps,
  type GeneratorDraft,
} from "@/lib/generator";
import { formatZar } from "@/lib/cn";
import { generatorPrice } from "@/lib/packages";
import { CvPreview } from "@/components/generator/cv-preview";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      {children}
    </label>
  );
}

const input = "field";
const UNLOCKED_KEY = "creative-cv-generator-unlocked";

export function GeneratorWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<GeneratorDraft>(() => emptyDraft());
  const [status, setStatus] = useState<"idle" | "paying" | "error">("idle");
  const [message, setMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const draftReported = useRef(false);
  const complete = Math.round(((step + 1) / steps.length) * 100);
  const previewReady = useMemo(() => Boolean(draft.fullName && draft.email), [draft.fullName, draft.email]);

  function update<K extends keyof GeneratorDraft>(key: K, value: GeneratorDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) setDraft(hydrateDraft(JSON.parse(saved)));
      if (sessionStorage.getItem(UNLOCKED_KEY)) setDownloadUnlocked(true);
    } catch {
      /* ignore malformed local drafts */
    }
    const enablePersist = window.setTimeout(() => setHydrated(true), 0);
    return () => window.clearTimeout(enablePersist);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  useEffect(() => {
    if (step !== steps.length - 1) return;
    if (!draft.fullName || !draft.email || draftReported.current) return;
    draftReported.current = true;
    void fetch("/api/generator/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: draft.fullName,
        email: draft.email,
        headline: draft.headline,
        targetRole: draft.targetRole,
      }),
    });
  }, [step, draft.fullName, draft.email, draft.headline, draft.targetRole]);

  useEffect(() => {
    if (!hydrated) return;
    const reference = new URLSearchParams(window.location.search).get("paid");
    if (!reference) return;

    let cancelled = false;
    (async () => {
      const response = await fetch("/api/generator/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          email: draftRef.current.email,
          fullName: draftRef.current.fullName,
        }),
      });
      const payload = (await response.json()) as { paid?: boolean; message?: string };
      if (cancelled) return;
      if (!payload.paid) {
        setMessage(payload.message ?? "Payment is not confirmed yet.");
        return;
      }
      sessionStorage.setItem(UNLOCKED_KEY, reference);
      setDownloadUnlocked(true);
      const { downloadCvPdf } = await import("@/lib/cv-pdf");
      downloadCvPdf(draftRef.current);
      setMessage("Payment confirmed. Your unwatermarked CV PDF has been downloaded.");
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  async function payToDownload() {
    setStatus("paying");
    setMessage("");
    try {
      const response = await fetch("/api/generator/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, amount: generatorPrice }),
      });
      const payload = (await response.json()) as {
        authorizationUrl?: string;
        message?: string;
        error?: string;
      };
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Could not start checkout.");
        return;
      }
      if (payload.authorizationUrl) {
        window.location.href = payload.authorizationUrl;
        return;
      }
      setStatus("idle");
      setMessage(
        payload.message ??
          "Your CV draft was saved. Paystack is not configured, so payment has not been taken and the unwatermarked PDF cannot be released.",
      );
    } catch {
      setStatus("error");
      setMessage("Could not start checkout. Please try again.");
    }
  }

  async function downloadPaidPdf() {
    const { downloadCvPdf } = await import("@/lib/cv-pdf");
    downloadCvPdf(draft);
  }

  return (
    <div className="bg-wash">
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <p className="kicker">
        Section {step + 1} of 7: {steps[step]} · {complete}% complete
      </p>
      <h1 className="mt-3 font-serif text-4xl">Create Your CV</h1>
      <div className="brand-rule mt-4" aria-hidden />
      <p className="mt-2 text-ink-soft">Complete all sections to generate your professional CV</p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-paper-deep">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${complete}%` }} />
      </div>

      <ol className="mt-8 flex gap-2 overflow-x-auto pb-2 text-xs">
        {steps.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={`whitespace-nowrap rounded-full px-3 py-1 ${index === step ? "bg-accent text-on-accent" : "bg-paper text-ink-soft ring-1 ring-line-brand"}`}
            >
              {index + 1} {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_0.95fr]">
        <form
          className="card-surface grid content-start gap-4 bg-paper p-5 md:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            setStep((current) => Math.min(current + 1, steps.length - 1));
          }}
        >
          {step === 0 ? (
            <>
              <Field label="Full name">
                <input className={input} value={draft.fullName} onChange={(e) => update("fullName", e.target.value)} required />
              </Field>
              <Field label="Headline">
                <input className={input} value={draft.headline} onChange={(e) => update("headline", e.target.value)} placeholder="Regional Branch Administrator" />
              </Field>
              <Field label="Email">
                <input className={input} type="email" value={draft.email} onChange={(e) => update("email", e.target.value)} required />
              </Field>
              <Field label="Phone">
                <input className={input} value={draft.phone} onChange={(e) => update("phone", e.target.value)} />
              </Field>
              <Field label="City">
                <input className={input} value={draft.city} onChange={(e) => update("city", e.target.value)} placeholder="Cape Town, South Africa" />
              </Field>
              <Field label="LinkedIn">
                <input className={input} value={draft.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
              </Field>
              <Field label="Languages">
                <input className={input} value={draft.languages} onChange={(e) => update("languages", e.target.value)} placeholder="English | Afrikaans | Zulu" />
              </Field>
              <Field label="Professional summary">
                <textarea className={input} rows={5} value={draft.summary} onChange={(e) => update("summary", e.target.value)} />
              </Field>
            </>
          ) : null}

          {step === 1 ? (
            <>
              {draft.employment.map((role, index) => (
                <fieldset key={index} className="grid gap-3 rounded-2xl border border-line-brand p-4">
                  <legend className="px-1 text-sm">Role {index + 1}</legend>
                  <input className={input} placeholder="Title" value={role.title} onChange={(e) => {
                    const next = [...draft.employment];
                    next[index] = { ...role, title: e.target.value };
                    update("employment", next);
                  }} />
                  <input className={input} placeholder="Company" value={role.company} onChange={(e) => {
                    const next = [...draft.employment];
                    next[index] = { ...role, company: e.target.value };
                    update("employment", next);
                  }} />
                  <input className={input} placeholder="Location" value={role.location} onChange={(e) => {
                    const next = [...draft.employment];
                    next[index] = { ...role, location: e.target.value };
                    update("employment", next);
                  }} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className={input} placeholder="Start" value={role.start} onChange={(e) => {
                      const next = [...draft.employment];
                      next[index] = { ...role, start: e.target.value };
                      update("employment", next);
                    }} />
                    <input className={input} placeholder="End" value={role.end} onChange={(e) => {
                      const next = [...draft.employment];
                      next[index] = { ...role, end: e.target.value };
                      update("employment", next);
                    }} />
                  </div>
                  <textarea className={input} rows={4} placeholder="Intro paragraph (optional) then achievements, one per line" value={role.bullets} onChange={(e) => {
                    const next = [...draft.employment];
                    next[index] = { ...role, bullets: e.target.value };
                    update("employment", next);
                  }} />
                </fieldset>
              ))}
              <button
                type="button"
                className="text-left text-sm text-accent"
                onClick={() => update("employment", [...draft.employment, emptyEmployment()])}
              >
                + Add another role
              </button>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Field label="Awards and accomplishments">
                <textarea className={input} rows={6} value={draft.achievements} onChange={(e) => update("achievements", e.target.value)} placeholder="One per line, e.g. Graduate Pace Setter Award | Botswana Accountancy College | 2019" />
              </Field>
              <Field label="Professional affiliations (optional)">
                <textarea className={input} rows={3} value={draft.affiliations} onChange={(e) => update("affiliations", e.target.value)} placeholder="One per line, e.g. Member | Institute Name | Current" />
              </Field>
            </>
          ) : null}

          {step === 3 ? (
            <>
              {draft.education.map((item, index) => (
                <fieldset key={index} className="grid gap-3 rounded-2xl border border-line-brand p-4">
                  <input className={input} placeholder="Qualification" value={item.qualification} onChange={(e) => {
                    const next = [...draft.education];
                    next[index] = { ...item, qualification: e.target.value };
                    update("education", next);
                  }} />
                  <input className={input} placeholder="Institution" value={item.institution} onChange={(e) => {
                    const next = [...draft.education];
                    next[index] = { ...item, institution: e.target.value };
                    update("education", next);
                  }} />
                  <input className={input} placeholder="Year" value={item.year} onChange={(e) => {
                    const next = [...draft.education];
                    next[index] = { ...item, year: e.target.value };
                    update("education", next);
                  }} />
                </fieldset>
              ))}
              <button
                type="button"
                className="text-left text-sm text-accent"
                onClick={() => update("education", [...draft.education, { qualification: "", institution: "", year: "" }])}
              >
                + Add education
              </button>
              <Field label="Professional development (optional)">
                <textarea className={input} rows={4} value={draft.development} onChange={(e) => update("development", e.target.value)} placeholder="One per line, e.g. Microsoft Excel 2019 / 365 | Earn and Excel | 2023" />
              </Field>
            </>
          ) : null}

          {step === 4 ? (
            <Field label="Skills">
              <textarea className={input} rows={6} value={draft.skills} onChange={(e) => update("skills", e.target.value)} placeholder="Comma-separated, e.g. Financial Coordination, Business Analysis, SQL" />
            </Field>
          ) : null}

          {step === 5 ? (
            <>
              <Field label="Target role">
                <input className={input} value={draft.targetRole} onChange={(e) => update("targetRole", e.target.value)} />
              </Field>
              <Field label="Industry keywords for ATS">
                <textarea className={input} rows={5} value={draft.keywords} onChange={(e) => update("keywords", e.target.value)} />
              </Field>
              <p className="text-sm text-ink-soft">
                Keywords are merged into Key Skills on the CV so Applicant Tracking Systems can read them as real text.
                They are not added as a separate heading.
              </p>
            </>
          ) : null}

          {step === 6 ? (
            <>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.includeReferences}
                  onChange={(e) => update("includeReferences", e.target.checked)}
                />
                Include named references on the CV (not recommended for ATS)
              </label>
              {draft.includeReferences
                ? draft.references.map((item, index) => (
                    <fieldset key={index} className="grid gap-3 rounded-2xl border border-line-brand p-4">
                      <input className={input} placeholder="Name" value={item.name} onChange={(e) => {
                        const next = [...draft.references];
                        next[index] = { ...item, name: e.target.value };
                        update("references", next);
                      }} />
                      <input className={input} placeholder="Relationship" value={item.relationship} onChange={(e) => {
                        const next = [...draft.references];
                        next[index] = { ...item, relationship: e.target.value };
                        update("references", next);
                      }} />
                      <input className={input} placeholder="Contact" value={item.contact} onChange={(e) => {
                        const next = [...draft.references];
                        next[index] = { ...item, contact: e.target.value };
                        update("references", next);
                      }} />
                    </fieldset>
                  ))
                : (
                  <p className="text-sm text-ink-soft">
                    The template prints <strong>REFERENCES</strong> as “Available on Request”, which is what most ATS
                    parsers and recruiters expect.
                  </p>
                )}
            </>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {step > 0 ? (
              <button type="button" className="rounded-full border border-accent/30 px-4 py-2 text-sm hover:border-accent hover:bg-accent-soft" onClick={() => setStep((n) => n - 1)}>
                Back
              </button>
            ) : null}
            {step < steps.length - 1 ? (
              <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm text-on-accent hover:bg-accent-hover">
                Continue
              </button>
            ) : downloadUnlocked ? (
              <button type="button" className="rounded-full bg-accent px-4 py-2 text-sm text-on-accent" onClick={downloadPaidPdf}>
                Download CV PDF
              </button>
            ) : (
              <button type="button" className="rounded-full bg-accent px-4 py-2 text-sm text-on-accent" onClick={payToDownload} disabled={status === "paying"}>
                {status === "paying" ? "Starting checkout…" : `Pay ${formatZar(generatorPrice)} to download PDF`}
              </button>
            )}
          </div>
          {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
        </form>

        <div>
          <p className="mb-3 kicker">Watermarked preview</p>
          {previewReady ? <CvPreview draft={draft} watermark /> : <p className="text-sm text-ink-soft">Add your name and email to see a preview.</p>}
        </div>
      </div>
    </div>
    </div>
  );
}
