import Link from "next/link";
import { PackagePricingGrid } from "@/components/packages/package-card";
import { ButtonLink } from "@/components/ui/primitives";
import { getResolvedPackageServices, getResolvedPrimaryPackages } from "@/lib/catalog";
import { formatZar } from "@/lib/cn";
import { africaOnlyLabel, addons, packageOrderHref, returnClientPackages } from "@/lib/packages";

export async function HomeCvPackages() {
  const items = await getResolvedPrimaryPackages();
  const services = await getResolvedPackageServices();

  return (
    <section id="cv-packages" className="bg-gold-soft/70">
      <div className="mx-auto max-w-6xl px-5 pt-12 pb-20 lg:px-8">
      <p className="kicker">CV packages</p>
      <h2 className="mt-3 max-w-2xl font-serif text-4xl font-bold tracking-tight md:text-5xl">
        Choose your CV package
      </h2>
      <div className="brand-rule mt-4" aria-hidden />
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
        Specialist writers, no templates — from first job to the boardroom. Prices in ZAR.
      </p>

      <div className="mt-12">
        <PackagePricingGrid items={items} services={services} />
      </div>

      <div className="mt-10 rounded-3xl border border-accent/20 bg-paper p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">Already a client?</p>
            <h3 className="mt-2 font-serif text-2xl font-bold">Return edits &amp; accessories</h3>
          </div>
          <ButtonLink href="/packages" variant="outline" className="shrink-0">
            See all on Packages
          </ButtonLink>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {returnClientPackages.map((pkg) => (
            <Link
              key={pkg.id}
              href={packageOrderHref(pkg.id)}
              className="rounded-2xl border border-accent/35 bg-paper-deep px-5 py-4 transition-colors hover:border-accent"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-medium">{pkg.name}</p>
                <p className="font-serif text-lg font-bold">{formatZar(pkg.price)}</p>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                {pkg.turnaroundLabel}
                {pkg.africaOnly ? ` · ${africaOnlyLabel}` : ""}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {addons.map((addon) => (
            <Link
              key={addon.id}
              href={addon.href ?? "/packages#accessories"}
              className="rounded-full border border-gold/50 bg-gold-soft px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-ink"
            >
              {addon.name} · {formatZar(addon.price)}
            </Link>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
