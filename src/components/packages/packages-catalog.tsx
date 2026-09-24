"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  addons,
  africaOnlyLabel,
  getPackage,
  packageOrderHref,
  returnClientPackages,
  type CatalogPackage,
  type PackageId,
  type AddonId,
} from "@/lib/packages";
import { cn, formatZar } from "@/lib/cn";
import { PackagePricingGrid } from "@/components/packages/package-card";
import { ButtonLink, PageIntro } from "@/components/ui/primitives";

const steps = [
  {
    n: "01",
    title: "Choose your package and place your order.",
    copy: "Buy now takes you to a short form: name, surname, phone with country code, email, your picture, your CV, and an optional extra file.",
  },
  {
    n: "02",
    title: "Your writer will get straight to work.",
    copy: "If you’d like a CV specialist, choose a writer with a specific area of knowledge and experience throughout your industry.",
  },
  {
    n: "03",
    title: "We gather what we need.",
    copy: "If you didn’t have an old CV, or you uploaded one, your writer will request the information they need to start crafting.",
  },
  {
    n: "04",
    title: "Receive Word and PDF — then perfect it.",
    copy: "Your writer stays with you through review. That’s part of our 100% satisfaction guarantee.",
  },
];

function initialPackageId(requested: string | null): PackageId {
  return requested && getPackage(requested) ? (requested as PackageId) : "professional";
}

function PackagesCatalog({
  items,
  returnItems = returnClientPackages,
  services,
}: {
  items: CatalogPackage[];
  returnItems?: CatalogPackage[];
  services: { id: string; label: string }[];
}) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<PackageId>(() => initialPackageId(searchParams.get("package")));
  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>([]);
  const selectedPackage =
    items.find((item) => item.id === selected) ??
    returnItems.find((item) => item.id === selected) ??
    items[0];

  useEffect(() => {
    const requested = searchParams.get("package");
    if (requested && getPackage(requested)) {
      setSelected(requested as PackageId);
    }
  }, [searchParams]);

  const total = useMemo(() => {
    const extras = selectedAddons.reduce((sum, id) => {
      const addon = addons.find((item) => item.id === id);
      return sum + (addon?.price ?? 0);
    }, 0);
    return (selectedPackage?.price ?? 0) + extras;
  }, [selectedAddons, selectedPackage?.price]);

  function toggleAddon(id: AddonId) {
    setSelectedAddons((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <div className="bg-paper">
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
      <PageIntro
        eyebrow="CV Packages"
        title="Take the next step in your career with one of our packages below"
        lede="A strong CV is a must-have for any job application process. It’s your opportunity to show future employers that you’re the best candidate for the job. Standing out from the rest of the crowd is vital — and our CV writing service will help you do just that."
      />

      <section className="mt-16">
        <h2 className="heading-accent font-serif text-3xl">Our packages</h2>
        <p className="mt-2 text-ink-soft">Who each package is for, turnaround, and what’s included — prices in ZAR.</p>
        <div className="mt-10">
          <PackagePricingGrid items={items} selectedId={selected} onSelect={setSelected} services={services} />
        </div>
      </section>
    </div>

      <section className="bg-wash">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <h2 className="heading-accent font-serif text-2xl">Already a client?</h2>
        <p className="mt-2 text-ink-soft">Return edits for an existing Creative CV.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {returnItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              className={cn(
                "rounded-2xl border p-6 text-left transition-colors",
                selected === item.id ? "border-accent bg-accent-soft/40" : "border-accent/35 bg-paper-deep hover:border-accent",
              )}
            >
              <h3 className="font-serif text-xl">{item.name}</h3>
              <p className="mt-2 font-serif text-2xl">
                {item.compareAtPrice ? (
                  <span className="mr-2 text-lg text-ink-soft line-through">{formatZar(item.compareAtPrice)}</span>
                ) : null}
                {formatZar(item.price)}
              </p>
              {item.promotion ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">{item.promotion}</p> : null}
              <p className="mt-2 text-sm text-ink-soft">
                {item.turnaroundLabel}
                {item.africaOnly ? ` · ${africaOnlyLabel}` : ""}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.audience}</p>
            </button>
          ))}
        </div>
        </div>
      </section>

      <section id="accessories" className="scroll-mt-24 bg-gold-soft">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <h2 className="heading-accent font-serif text-3xl">Accessories</h2>
        <p className="mt-2 text-ink-soft">Add career services to any package. Individual options are always available.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {addons.map((addon) => {
            const active = selectedAddons.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddon(addon.id)}
                className={cn(
                  "rounded-2xl border px-5 py-4 text-left",
                  active ? "border-accent bg-accent-soft/50" : "border-accent/35 bg-paper-deep",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium">{addon.name}</p>
                  <p className="text-sm">{formatZar(addon.price)}</p>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{addon.description}</p>
              </button>
            );
          })}
        </div>
        </div>
      </section>

      <section id="order" className="scroll-mt-24 bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <h2 className="heading-accent font-serif text-3xl">How does our professional CV writing service work?</h2>
          <p className="mt-3 text-ink-soft">
            Your brand-new, professionally-written Creative CV is only a few short steps away.
          </p>
          <ol className="mt-8 space-y-6">
            {steps.map((step) => (
              <li key={step.n} className="border-t border-gold/40 pt-5">
                <p className="text-xs tracking-[0.18em] text-gold">{step.n}</p>
                <h3 className="mt-2 font-serif text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.copy}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-ink-soft">
            Is my information safe? At Creative CV, we take data protection very seriously. GDPR compliance and we are
            most assured that any information you give us is completely secure. Check out our{" "}
            <a href="/privacy" className="content-link">
              privacy policy
            </a>
            .
          </p>
          <p className="mt-4 text-sm text-ink-soft">
            Not sure what is right for you? Call us on +27 74 650 2580 — we’re available 24/7. *Subject to writer
            availability.
          </p>
        </div>
        <div className="card-surface bg-paper p-6 shadow-[0_20px_60px_rgba(6,20,40,0.08)] md:p-8">
          <p className="kicker">Place your order</p>
          <h3 className="mt-2 font-serif text-2xl">{selectedPackage?.name}</h3>
          <p className="mt-1 text-ink-soft">Total {formatZar(total)}</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Next you’ll add your name, surname, phone with country code, email, a picture, your CV, and an optional extra file.
          </p>
          <ButtonLink href={packageOrderHref(selected, selectedAddons)} variant="accent" className="mt-6 w-full">
            Fill in your details
          </ButtonLink>
        </div>
        </div>
      </section>
    </div>
  );
}

export function PackagesCatalogView(props: {
  items: CatalogPackage[];
  returnItems?: CatalogPackage[];
  services: { id: string; label: string }[];
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-16 text-ink-soft">Loading packages…</div>}>
      <PackagesCatalog {...props} />
    </Suspense>
  );
}
