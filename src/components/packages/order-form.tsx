"use client";

import { useCallback, useMemo, useState } from "react";
import { OrderSuccessPhone } from "@/components/packages/order-success-phone";
import { formatZar } from "@/lib/cn";
import { countryCallingCodes, defaultCountryDial } from "@/lib/phone-codes";
import type { AddonId, PackageId } from "@/lib/packages";

type Props = {
  packageId: PackageId;
  addonIds: AddonId[];
  packageName: string;
  total: number;
};

function FileField({
  name,
  label,
  hint,
  accept,
  required,
}: {
  name: string;
  label: string;
  hint: string;
  accept: string;
  required?: boolean;
}) {
  const [fileName, setFileName] = useState("");

  return (
    <label className="grid gap-1 text-sm">
      <span>
        {label}
        {required ? <span className="text-accent"> *</span> : <span className="text-ink-soft"> (optional)</span>}
      </span>
      <span className="text-xs text-ink-soft">{hint}</span>
      <input
        required={required}
        name={name}
        type="file"
        accept={accept}
        className="field cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-steel file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-white"
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
      />
      {fileName ? <span className="text-xs text-accent">Selected: {fileName}</span> : null}
    </label>
  );
}

export function OrderForm({ packageId, addonIds, packageName, total }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success" | "redirecting">("idle");
  const [message, setMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const addonPayload = useMemo(() => JSON.stringify(addonIds), [addonIds]);
  const closeSuccess = useCallback(() => setStatus("idle"), []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("packageId", packageId);
    data.set("addonIds", addonPayload);
    data.set("amount", String(total));
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const submittedName = [firstName, lastName].filter(Boolean).join(" ");

    try {
      const response = await fetch("/api/orders", { method: "POST", body: data });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        authorizationUrl?: string;
        orderNumber?: string;
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
      setOrderNumber(payload.orderNumber ?? "Revamp001");
      setCustomerName(submittedName);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-surface bg-paper p-6 shadow-[0_20px_60px_rgba(6,20,40,0.08)] md:p-8">
      <p className="kicker">Your details</p>
      <h3 className="mt-2 font-serif text-2xl">{packageName}</h3>
      <p className="mt-1 text-ink-soft">Total {formatZar(total)}</p>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Name
            <input required name="firstName" autoComplete="given-name" className="field" />
          </label>
          <label className="grid gap-1 text-sm">
            Surname
            <input required name="lastName" autoComplete="family-name" className="field" />
          </label>
        </div>

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
          Email address
          <input required type="email" name="email" autoComplete="email" className="field" />
        </label>

        <FileField
          name="photo"
          label="Upload your picture"
          hint="JPG, PNG or WebP · max 8MB"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          required
        />
        <FileField
          name="cv"
          label="Upload CV"
          hint="PDF, DOC or DOCX · max 8MB"
          accept=".pdf,.doc,.docx,application/pdf"
          required
        />
        <FileField
          name="extra"
          label="Upload any additional file"
          hint="Optional supporting document"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || status === "redirecting"}
        className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-bold uppercase tracking-[0.14em] text-on-accent hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : status === "redirecting" ? "Redirecting to Paystack…" : "Continue to payment"}
      </button>
      {message ? <p className="mt-4 text-sm leading-relaxed text-ink-soft">{message}</p> : null}
      {status === "success" && orderNumber ? (
        <OrderSuccessPhone orderNumber={orderNumber} customerName={customerName} onClose={closeSuccess} />
      ) : null}
    </form>
  );
}
