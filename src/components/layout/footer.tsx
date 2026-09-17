import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Services",
    links: [
      { href: "/packages", label: "CV Writing Packages" },
      { href: "/services/interview-coaching", label: "Interview Coaching" },
      { href: "/services/salary-negotiation", label: "Salary Negotiation" },
      { href: "/services/career-coaching", label: "Career Coaching" },
      { href: "/services/career-transitioning", label: "Career Transitioning" },
    ],
  },
  {
    title: "Job Seekers",
    links: [
      { href: "/jobs", label: "Browse Jobs" },
      { href: "/auth/register/job-seeker", label: "Create Account" },
      { href: "/auth/login", label: "Sign In" },
      { href: "/cv-generator", label: "Build Your CV" },
    ],
  },
  {
    title: "Recruiters",
    links: [
      { href: "/dashboard/recruiter/post", label: "Post Jobs" },
      { href: "/auth/login", label: "Recruiter Login" },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/faq", label: "FAQ" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-ink">
      <div className="brand-bar" aria-hidden />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div>
          <Link href="/" className="inline-flex rounded-lg bg-white px-2 py-1.5">
            <Image
              src="/logo.jpg"
              alt="Creative-CV Group of Recruiters"
              width={720}
              height={480}
              className="h-11 w-auto object-contain"
            />
          </Link>
          <h2 className="mt-4 text-base font-bold text-accent">Creative-CV</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/70">
            We are experienced professionals who care about your success. Stand out from the crowd and
            connect with top recruiters today!
          </p>
          <ul className="mt-5 space-y-2 text-sm text-ink/80">
            <li>
              <span className="font-semibold text-ink">Email:</span>{" "}
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold">
                {site.email}
              </a>
            </li>
            <li>
              <span className="font-semibold text-ink">Phone:</span>{" "}
              <a href={site.phoneHref} className="transition-colors hover:text-gold">
                {site.phone}
              </a>
            </li>
            <li>
              <span className="font-semibold text-ink">Hours:</span> {site.hoursShort}
            </li>
          </ul>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-base font-bold text-accent">{column.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/80">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}`}>
                  <Link href={link.href} className="transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Made with <span className="text-accent">❤️</span> in {site.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
