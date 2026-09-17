"use client";

import { useState } from "react";
import { formatZar } from "@/lib/cn";
import type { AddonId, PackageId } from "@/lib/packages";

type Props = {
  packageId: PackageId;
  addonIds: AddonId[];
  packageName: string;
  total: number;
};

export function OrderForm({ packageId, addonIds, packageName, total }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "needs_config" | "redirecting">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("packageId", packageId);
    data.set("addonIds", JSON.stringify(addonIds));
    data.set("amount", String(total));

    try {
      const response = await fetch("/api/orders", { method: "POST", body: data });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        paymentConfigured?: boolean;
        authorizationUrl?: string;
        message?: string;
      };
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "We could not submit your order. Please try again or call us.");
        return;
      }
      if (payload.authorizationUrl) {
        setStatus("redirecting");
        window.location.href = payload.authorizationUrl;
        return;
      }
      setStatus("needs_config");
      setMessage(
        payload.message ??
          "Your order details were received. Paystack is not configured on this environment, so payment has not been taken. We’ll follow up at the email you provided.",
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-surface bg-paper p-6 shadow-[0_20px_60px_rgba(6,20,40,0.08)] md:p-8">
      <p className="kicker">Place your order</p>
      <h3 className="mt-2 font-serif text-2xl">{packageName}</h3>
      <p className="mt-1 text-ink-soft">Total {formatZar(total)}</p>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm">
          Full name
          <input required name="fullName" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Email
          <input required type="email" name="email" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Phone
          <input required name="phone" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Upload your old CV (optional)
          <input name="cv" type="file" accept=".pdf,.doc,.docx" className="text-sm" />
        </label>
        <label className="grid gap-1 text-sm">
          Goals and aspirations
          <textarea
            required
            name="goals"
            rows={5}
            placeholder="Target role, industry, cover letter or LinkedIn needs…"
            className="field"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || status === "redirecting"}
        className="mt-6 w-full rounded-full bg-accent py-3 text-sm text-ink hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : status === "redirecting" ? "Redirecting to Paystack…" : "Continue to payment"}
      </button>
      {message ? <p className="mt-4 text-sm leading-relaxed text-ink-soft">{message}</p> : null}
    </form>
  );
}
