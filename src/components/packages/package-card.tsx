"use client";

import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
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
  { header: string; button: string; check: string; ring: string; title: string; muted: string; badge: string; price: string }
> = {
  gold: {
    header: "bg-accent",
    button: "bg-on-accent text-accent hover:bg-steel",
    check: "bg-accent text-on-accent",
    ring: "ring-accent",
    title: "text-on-accent",
    muted: "text-on-accent/80",
    badge: "border-on-accent/30 bg-on-accent/10 text-on-accent",
    price: "bg-on-accent/10 text-on-accent ring-on-accent/40",
  },
  navy: {
    header: "bg-steel",
    button: "bg-accent text-on-accent hover:bg-accent-hover",
    check: "bg-accent text-on-accent",
    ring: "ring-steel",
    title: "text-white",
    muted: "text-white/90",
    badge: "border-white/40 bg-white/15 text-white",
    price: "bg-white/20 text-white ring-white/75",
  },
  charcoal: {
    header: "bg-charcoal",
    button: "bg-accent text-on-accent hover:bg-accent-hover",
    check: "bg-accent text-on-accent",
    ring: "ring-charcoal",
    title: "text-white",
    muted: "text-white/90",
    badge: "border-white/40 bg-white/15 text-white",
    price: "bg-white/20 text-white ring-white/75",
  },
  ink: {
    header: "bg-brand",
    button: "bg-accent text-on-accent hover:bg-accent-hover",
    check: "bg-accent text-on-accent",
    ring: "ring-brand",
    title: "text-white",
    muted: "text-white/90",
    badge: "border-white/40 bg-white/15 text-white",
    price: "bg-white/20 text-white ring-white/75",
  },
  steel: {
    header: "bg-steel",
    button: "bg-accent text-on-accent hover:bg-accent-hover",
    check: "bg-accent text-on-accent",
    ring: "ring-accent",
    title: "text-white",
    muted: "text-white/90",
    badge: "border-white/40 bg-white/15 text-white",
    price: "bg-white/20 text-white ring-white/75",
  },
};

function FeatureMark({ checkClass }: { checkClass: string }) {
  return (
    <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", checkClass)} aria-hidden>
      <Check className="size-3" strokeWidth={3} />
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
  const includedServices = services.filter((feature) => packageHasFeature(pkg, feature.id));

  return (
    <article
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-accent/35 bg-paper-deep shadow-[0_14px_40px_rgba(2,6,23,0.45)] transition-[transform,box-shadow] duration-200",
        featured && "lg:shadow-[0_22px_50px_rgba(198,161,91,0.22)]",
        selected && cn("ring-2 ring-offset-2 ring-offset-paper", theme.ring),
        onSelect && "cursor-pointer",
      )}
      onClick={onSelect ? () => onSelect(pkg.id) : undefined}
    >
      <header className="relative">
        <div className={cn("absolute inset-0 package-header-slant", theme.header)} />
        <div className={cn("relative z-10 flex flex-col px-4 pt-4 sm:px-5 sm:pt-5", pkg.regionLabel ? "pb-8" : "pb-7")}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 pr-1 pt-0.5">
              <h3 className={cn("font-sans text-xl font-bold uppercase leading-tight tracking-[0.03em]", theme.title)}>
                {pkg.headerName}
              </h3>
              {pkg.promotion ? (
                <p className={cn("mt-1 text-[11px] font-semibold uppercase tracking-[0.14em]", theme.muted)}>{pkg.promotion}</p>
              ) : featured ? (
                <p className={cn("mt-1 text-[11px] font-semibold uppercase tracking-[0.16em]", theme.muted)}>Most popular</p>
              ) : null}
              {featured && pkg.promotion ? (
                <p className={cn("mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em]", theme.muted)}>Most popular</p>
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
                "flex size-16 shrink-0 items-center justify-center rounded-full ring-2 sm:size-[5.15rem]",
                theme.price,
              )}
              aria-label={`${pkg.name} price R${pkg.price}`}
            >
              <span className="flex flex-col items-center font-bold leading-none tracking-tight">
                {pkg.compareAtPrice ? (
                  <span className="text-[10px] font-semibold tracking-normal line-through opacity-70">R{pkg.compareAtPrice}</span>
                ) : null}
                <span className="flex items-center">
                  <span className="text-xl sm:text-2xl">R</span>
                  <span className="text-xl sm:text-2xl">{pkg.price}</span>
                </span>
              </span>
            </div>
          </div>
          {pkg.regionLabel ? (
            <p className={cn("mt-1.5 text-[13px] font-medium leading-snug", theme.muted)}>{pkg.regionLabel}</p>
          ) : null}
        </div>
      </header>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-1 sm:px-6 sm:pb-6">
        <ul className="mb-4 space-y-2">
          {includedServices.map((feature) => (
            <li key={feature.id} className="flex min-w-0 items-start gap-2.5">
              <FeatureMark checkClass={theme.check} />
              <span className="min-w-0 break-words text-[13px] leading-snug text-ink">{feature.label}</span>
            </li>
          ))}
        </ul>
        <Link
          href={packageOrderHref(pkg.id)}
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold uppercase tracking-[0.12em] shadow-[0_10px_24px_rgba(2,6,23,0.28)] transition-colors",
            theme.button,
          )}
        >
          <ShoppingBag className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
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
    <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-4 sm:gap-5 lg:grid-cols-4">
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
