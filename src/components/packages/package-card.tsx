"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  africaOnlyHeaderLabel,
  comparisonFeatures,
  packageHasFeature,
  packageOrderHref,
  type CatalogPackage,
  type PackageId,
  type PackageTone,
} from "@/lib/packages";

const tones: Record<
  PackageTone,
  { header: string; button: string; check: string; ring: string; title: string; muted: string; badge: string }
> = {
  gold: {
    header: "bg-accent",
    button: "bg-accent text-ink hover:bg-accent-hover",
    check: "bg-accent text-ink",
    ring: "ring-accent",
    title: "text-ink",
    muted: "text-ink/80",
    badge: "border-white/40 bg-white/15 text-white",
  },
  navy: {
    header: "bg-steel",
    button: "bg-steel text-white hover:bg-steel-hover",
    check: "bg-steel text-white",
    ring: "ring-steel",
    title: "text-white",
    muted: "text-white/90",
    badge: "border-white/40 bg-white/15 text-white",
  },
  charcoal: {
    header: "bg-charcoal",
    button: "bg-charcoal text-white hover:bg-charcoal-hover",
    check: "bg-charcoal text-white",
    ring: "ring-charcoal",
    title: "text-white",
    muted: "text-white/90",
    badge: "border-white/40 bg-white/15 text-white",
  },
  ink: {
    header: "bg-brand",
    button: "bg-brand text-ink hover:bg-brand-hover",
    check: "bg-brand text-ink",
    ring: "ring-brand",
    title: "text-ink",
    muted: "text-ink/90",
    badge: "border-white/40 bg-white/15 text-white",
  },
  steel: {
    header: "bg-accent-soft",
    button: "bg-accent-soft text-ink hover:bg-steel-hover",
    check: "bg-accent-soft text-ink",
    ring: "ring-accent",
    title: "text-ink",
    muted: "text-ink/90",
    badge: "border-white/40 bg-white/15 text-white",
  },
};

function FeatureMark({ included, checkClass }: { included: boolean; checkClass: string }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
        included ? checkClass : "bg-line text-white",
      )}
      aria-hidden
    >
      {included ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
    </span>
  );
}

export function PackageCard({
  pkg,
  selected = false,
  onSelect,
  services = comparisonFeatures,
}: {
  pkg: CatalogPackage;
  selected?: boolean;
  onSelect?: (id: PackageId) => void;
  services?: readonly { id: string; label: string }[];
}) {
  const theme = tones[pkg.tone] ?? tones.navy;
  const featured = Boolean(pkg.popular);

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-[1.35rem] border border-accent/35 bg-paper-deep shadow-[0_14px_40px_rgba(2,6,23,0.45)] transition-[transform,box-shadow] duration-200",
        featured && "lg:shadow-[0_22px_50px_rgba(37,99,235,0.32)]",
        selected && cn("ring-2 ring-offset-2 ring-offset-paper", theme.ring),
        onSelect && "cursor-pointer",
      )}
      onClick={onSelect ? () => onSelect(pkg.id) : undefined}
    >
      <header className={cn("relative", pkg.regionLabel ? "h-[14.25rem]" : featured ? "h-[11.75rem]" : "h-[10.5rem]")}>
        <div
          className={cn(
            "absolute inset-0",
            pkg.regionLabel ? "package-header-slant-tall" : "package-header-slant",
            theme.header,
          )}
        />
        <div className="relative z-10 flex h-full flex-col px-5 pt-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 pr-1 pt-0.5">
              <h3 className={cn("font-sans text-xl font-bold uppercase leading-tight tracking-[0.03em]", theme.title)}>
                {pkg.headerName}
              </h3>
              {featured ? (
                <p className={cn("mt-1 text-[11px] font-semibold uppercase tracking-[0.16em]", theme.muted)}>Most popular</p>
              ) : null}
              <p className={cn("mt-1.5 text-[13.5px] font-medium leading-snug", theme.muted)}>{pkg.turnaroundLabel}</p>
              {pkg.africaOnly ? (
                <span className={cn("mt-1.5 inline-flex whitespace-nowrap rounded-full border px-2 py-1 text-[11px] font-semibold uppercase leading-none tracking-[0.08em]", theme.badge)}>
                  {africaOnlyHeaderLabel}
                </span>
              ) : null}
            </div>
            <div
              className={cn(
                "flex size-[5.15rem] shrink-0 items-center justify-center rounded-full ring-2",
                "bg-white/20 text-white ring-white/75",
              )}
              aria-label={`${pkg.name} price R${pkg.price}`}
            >
              <span className="flex items-center font-bold leading-none tracking-tight">
                <span className="text-2xl">R</span>
                <span className="text-2xl">{pkg.price}</span>
              </span>
            </div>
          </div>
          {pkg.regionLabel ? (
            <p className={cn("mt-2 text-[13px] font-medium leading-snug", theme.muted)}>{pkg.regionLabel}</p>
          ) : null}
        </div>
      </header>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-1">
        <ul className="space-y-2.5">
          {services.map((feature) => {
            const included = packageHasFeature(pkg, feature.id);
            return (
              <li key={feature.id} className="flex items-start gap-2.5">
                <FeatureMark included={included} checkClass={theme.check} />
                <span className={cn("text-[13px] leading-snug", included ? "text-ink" : "text-ink-soft/45")}>
                  {feature.label}
                </span>
              </li>
            );
          })}
        </ul>
        <Link
          href={packageOrderHref(pkg.id)}
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "mt-4 inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors",
            theme.button,
          )}
        >
          Buy now
        </Link>
      </div>
    </article>
  );
}

export function PackagePricingGrid({
  items,
  selectedId,
  onSelect,
  services,
}: {
  items: CatalogPackage[];
  selectedId?: PackageId;
  onSelect?: (id: PackageId) => void;
  services?: readonly { id: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-5 min-[717px]:grid-cols-2 lg:grid-cols-4 lg:items-end">
      {items.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          selected={selectedId === pkg.id}
          onSelect={onSelect}
          services={services}
        />
      ))}
    </div>
  );
}
