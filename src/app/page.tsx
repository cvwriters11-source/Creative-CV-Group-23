import { type ReactNode } from "react";
import {
  Bot,
  Briefcase,
  Check,
  CircleCheck,
  DollarSign,
  Headphones,
  Infinity as InfinityIcon,
  Rocket,
  Star,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { HomeCvPackages } from "@/components/home/cv-packages";
import { RecruitmentProcessVideo } from "@/components/packages/recruitment-process-video";
import { ButtonLink } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const reasons: { title: string; copy: string; icon: LucideIcon }[] = [
  {
    title: "Affordable Prices",
    copy: "Lots of professional CV writing services use a template and then charge you the earth. We don’t! Our service is unique as well as affordable.",
    icon: DollarSign,
  },
  {
    title: "Written by South African Professionals",
    copy: "Our professional writers have extensive experience writing CVs in your industry. They know exactly what employers are looking for.",
    icon: Users,
  },
  {
    title: "From Beginner to Boardroom",
    copy: "Your professional CV writer knows exactly how each rung on your career ladder should be presented on a CV, from graduates to executives.",
    icon: Rocket,
  },
  {
    title: "5-Star Service",
    copy: "We place our 5-star customer experience at the heart of our CV writing service. Our 24/7 support puts you in direct contact with your writer.",
    icon: Headphones,
  },
  {
    title: "ATS Friendly",
    copy: "We’ll optimize your CV to make sure it gets through Applicant Tracking Systems successfully using industry-specific keywords.",
    icon: Bot,
  },
  {
    title: "Get more job interviews with ease.",
    copy: "We’ll keep going until you’re completely satisfied with your order, no matter how long it takes and at no extra cost.",
    icon: InfinityIcon,
  },
];

const trustChecks = [
  "ATS-friendly formatting",
  "Experienced professional writers",
  "Fast turnaround time",
  "Get more job interviews with ease.",
];

function HeroStat({
  icon,
  label,
  value,
  className,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-accent/40 bg-paper-deep/95 px-4 py-3 shadow-[0_8px_28px_rgba(198,161,91,0.16)] backdrop-blur-sm",
        className,
      )}
    >
      {icon}
      <div>
        <p className="text-sm text-ink-soft">{label}</p>
        <p className="text-lg font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative isolate min-h-[calc(100dvh-5rem)] overflow-hidden bg-paper">
        <RecruitmentProcessVideo variant="background" />

        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] max-w-7xl items-start px-4 py-16 pb-28 sm:px-6 lg:items-center lg:px-8 lg:py-24 lg:pb-32">
          <div className="pointer-events-auto max-w-xl">
            <p className="inline-flex rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-accent ring-1 ring-gold/50 backdrop-blur-sm">
              Free lifetime CV amendments
            </p>
            <h1 className="mt-6 max-w-xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] lg:text-5xl xl:text-6xl">
              {site.tagline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)] lg:text-xl">
              {site.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex items-center gap-2">
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" />
                  ))}
                </div>
                <span className="font-semibold text-ink">{site.rating}</span>
              </div>
              <p className="text-ink/80">
                <strong className="font-semibold text-ink">Trusted</strong> by professionals across South Africa
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/packages" variant="accent" className="px-8 py-4 text-base shadow-lg">
                View Packages
              </ButtonLink>
              <ButtonLink href="/cv-generator" variant="outlineLight" className="px-8 py-4 text-base shadow-lg">
                Generate CV
              </ButtonLink>
              <ButtonLink href="/jobs" variant="brand" className="px-8 py-4 text-base shadow-lg">
                <Briefcase size={18} />
                Find Jobs
              </ButtonLink>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustChecks.map((item) => (
                <li key={item} className="flex items-start gap-2 text-ink/85">
                  <Check className="mt-0.5 shrink-0 text-ok" size={20} strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 lg:hidden">
              <HeroStat
                icon={
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Zap size={18} fill="currentColor" />
                  </span>
                }
                label="Fast Service"
                value="24–48hrs"
              />
              <HeroStat
                icon={
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ok/15 text-ok">
                    <CircleCheck size={22} />
                  </span>
                }
                label="Client Satisfaction"
                value="100%"
              />
            </div>
          </div>
        </div>

        <HeroStat
          className="absolute top-6 right-6 z-20 max-lg:hidden"
          icon={
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
              <Zap size={18} fill="currentColor" />
            </span>
          }
          label="Fast Service"
          value="24–48hrs"
        />
        <HeroStat
          className="absolute bottom-28 left-6 z-20 max-lg:hidden"
          icon={
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ok/15 text-ok">
              <CircleCheck size={22} />
            </span>
          }
          label="Client Satisfaction"
          value="100%"
        />
      </section>

      <HomeCvPackages />

      <section className="bg-paper-deep text-ink">
        <div className="h-1 bg-gradient-to-r from-gold via-accent to-transparent" aria-hidden />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="kicker kicker-gold">New: Job Board</p>
            <h2 className="mt-4 font-serif text-4xl font-bold tracking-tight md:text-5xl">Find Your Dream Job Today</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
              Browse thousands of job opportunities across South Africa. Create your profile, upload your CV, and apply
              to jobs with a single click.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/jobs" variant="accent">
                Browse jobs
              </ButtonLink>
              <ButtonLink href="/auth/register/job-seeker" variant="outlineLight">
                Create a free profile
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2">
            {[
              ["Smart Job Search", "Filter by industry, location, salary & more"],
              ["One-Click Apply", "Apply instantly with your saved CV"],
              ["Job Alerts", "Get notified when matching jobs are posted"],
              ["Track Applications", "Monitor your application status"],
            ].map(([title, copy]) => (
              <li key={title} className="border-t border-gold/30 pt-5">
                <p className="font-medium">{title}</p>
                <p className="mt-2 text-sm text-ink/65">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-wash">
        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="kicker">Why Creative CV</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight md:text-4xl">Why Choose Creative CV?</h2>
            <div className="brand-rule mx-auto mt-4" aria-hidden />
            <p className="mt-4 text-base leading-relaxed text-ink-soft md:text-lg">
              We combine professional expertise with personalized service to deliver CVs that get results.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reasons.map(({ title, copy, icon: Icon }) => (
              <article
                key={title}
                className="flex gap-4 rounded-2xl border border-accent/30 bg-paper-deep p-6 shadow-[0_8px_28px_rgba(37,99,235,0.12)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent">
                  <Icon size={22} strokeWidth={2} aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-bold leading-snug">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold-soft">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="kicker">Reviews</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight md:text-4xl">Rated by clients across South Africa</h2>
            <div className="brand-rule mx-auto mt-4" aria-hidden />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Google", site.googleRating],
              ["Trustpilot", site.trustpilot],
              ["Client satisfaction", site.rating],
            ].map(([label, value]) => (
              <article key={label} className="rounded-2xl border border-gold/40 bg-paper px-6 py-8 text-center">
                <div className="flex justify-center text-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3 font-serif text-3xl font-semibold text-accent">{value}</p>
                <p className="mt-1 text-sm text-ink-soft">{label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-20 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="kicker kicker-gold">Next step</p>
            <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight">Ready to take the next step in your career?</h2>
            <p className="mt-4 max-w-xl text-ink/70">
              Client satisfaction 100%. Let us help you gain and master your career success.
            </p>
          </div>
          <ButtonLink href="/packages" variant="accent" className="px-7">
            View CV packages
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
