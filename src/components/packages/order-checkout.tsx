"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OrderForm } from "@/components/packages/order-form";
import { PageIntro } from "@/components/ui/primitives";
import { cn, formatZar } from "@/lib/cn";
import {
  addons,
  africaOnlyLabel,
  type AddonId,
  type CatalogPackage,
  type PackageId,
} from "@/lib/packages";

function parseAddons(value: string | null): AddonId[] {
  if (!value) return [];
  const allowed = new Set(addons.map((item) => item.id));
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is AddonId => allowed.has(item as AddonId));
}

const ribbonTones: Record<string, string> = {
  gold: "#2563eb",
  navy: "#0d9488",
  charcoal: "#0f172a",
  ink: "#1e6fff",
  steel: "#0369a1",
};

function IncludedMark() {
  return (
    <span className="plan-pricing-check mt-0.5" aria-hidden>
      <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
        <path d="M2.5 6.2 5 8.7 9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function OrderCheckout({
  catalog,
  services,
}: {
  catalog: CatalogPackage[];
  services: readonly { id: string; label: string }[];
}) {
  const searchParams = useSearchParams();
  const requested = searchParams.get("package");
  const pkg =
    catalog.find((item) => item.id === requested) ??
    catalog.find((item) => item.id === "professional") ??
    catalog[0];
  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>(() => parseAddons(searchParams.get("addons")));
  const paid = searchParams.get("paid");

  const includedServices = useMemo(
    () => services.filter((feature) => pkg.features.includes(feature.id)),
    [pkg.features, services],
  );
  const selectedAddonItems = useMemo(
    () => addons.filter((addon) => selectedAddons.includes(addon.id)),
    [selectedAddons],
  );

  const extrasTotal = useMemo(
    () => selectedAddonItems.reduce((sum, addon) => sum + addon.price, 0),
    [selectedAddonItems],
  );
  const total = pkg.price + extrasTotal;

  function toggleAddon(id: AddonId) {
    setSelectedAddons((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  if (paid) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 lg:px-8">
        <PageIntro
          eyebrow="Order received"
          title="Thank you — we have your details."
          lede="If payment was completed, our team will start on your CV. We’ll contact you at the email you provided."
        />
        <Link href="/packages" className="content-link mt-8 inline-block">
          Back to packages
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <PageIntro
        eyebrow="Buy now"
        title="Tell us who you are"
        lede="Fill in your details, upload your picture and CV, then continue to payment. Additional files are optional."
      />
      <article
        className="plan-pricing-card mt-10"
        style={{ ["--plan-tab" as string]: ribbonTones[pkg.tone] ?? ribbonTones.gold }}
      >
        <p className="plan-pricing-tab">{pkg.headerName}</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
          <div className="min-w-[8.5rem] shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Selected package</p>
            <p className="mt-1 font-sans text-[2.15rem] font-extrabold leading-none tracking-tight text-slate-900">
              {formatZar(pkg.price)}
            </p>
            <p className="mt-2 text-xs leading-snug text-slate-500">
              {pkg.turnaroundLabel}
              {pkg.africaOnly ? ` · ${africaOnlyLabel}` : ""}
            </p>
          </div>
          <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-x-7 gap-y-2.5">
            {includedServices.map((feature) => (
              <li key={feature.id} className="flex max-w-[16rem] items-center gap-2 text-[13px] leading-snug text-slate-600">
                <IncludedMark />
                <span>{feature.label}</span>
              </li>
            ))}
            {selectedAddonItems.map((addon) => (
              <li key={addon.id} className="flex max-w-[16rem] items-center gap-2 text-[13px] leading-snug text-slate-600">
                <IncludedMark />
                <span>
                  {addon.name} · {formatZar(addon.price)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 flex-col gap-2 self-start sm:flex-row sm:items-center lg:flex-col lg:self-center">
            <button
              type="button"
              onClick={() => document.getElementById("order-details")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="rounded-full px-6 py-2.5 text-center text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              style={{ background: ribbonTones[pkg.tone] ?? ribbonTones.gold }}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] opacity-90">Order total</span>
              <span className="block text-sm font-extrabold leading-none">{formatZar(total)}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                document.getElementById("additional-services")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="rounded-full border-2 bg-white px-6 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-[0.12em] transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              style={{
                borderColor: ribbonTones[pkg.tone] ?? ribbonTones.gold,
                color: ribbonTones[pkg.tone] ?? ribbonTones.gold,
              }}
            >
              Additional services
            </button>
          </div>
        </div>
      </article>
      <div className="mt-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div id="additional-services" className="scroll-mt-28">
          <p className="text-sm font-semibold">Additional services</p>
          <p className="mt-1 text-sm text-ink-soft">Tick what you want. Each tick is added to your order total.</p>
          <div className="mt-3 grid gap-2">
            {addons.map((addon) => {
              const active = selectedAddons.includes(addon.id);
              return (
                <label
                  key={addon.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                    active ? "border-accent bg-accent-soft/50" : "border-accent/30 bg-paper-deep hover:border-accent",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleAddon(addon.id)}
                    className="mt-1 size-4 shrink-0 accent-[#2563eb]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{addon.name}</span>
                      <span className="shrink-0 tabular-nums">{formatZar(addon.price)}</span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-soft">{addon.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-4 text-sm">
            {extrasTotal > 0 ? (
              <>
                Package {formatZar(pkg.price)} + extras {formatZar(extrasTotal)} ={" "}
                <span className="font-semibold">{formatZar(total)}</span>
              </>
            ) : (
              <span className="text-ink-soft">No extras selected. Order total stays {formatZar(pkg.price)}.</span>
            )}
          </p>
          <p className="mt-6 text-sm text-ink-soft">
            Need a different package?{" "}
            <Link href="/packages" className="content-link">
              Browse all packages
            </Link>
            .
          </p>
        </div>
        <div id="order-details" className="scroll-mt-28">
          <OrderForm
            packageId={pkg.id as PackageId}
            addonIds={selectedAddons}
            packageName={pkg.name}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
