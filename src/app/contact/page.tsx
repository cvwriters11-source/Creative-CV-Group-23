import { ContactForm } from "@/components/contact/contact-form";
import { PageIntro } from "@/components/ui/primitives";
import { site } from "@/lib/site";

export default function ContactPage() {
  return (
    <div className="bg-wash">
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1fr_0.9fr] lg:px-8">
      <div>
        <PageIntro
          eyebrow="Contact"
          title="Get in Touch"
          lede="Have a question or need assistance? We're here to help you elevate your career with confidence!"
        />
        <dl className="mt-12 space-y-6">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-accent">Email</dt>
            <dd className="mt-1">
              <a className="content-link" href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-accent">Phone</dt>
            <dd className="mt-1">
              <a className="content-link" href={site.phoneHref}>{site.phone}</a>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-accent">Location</dt>
            <dd className="mt-1">{site.location}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-accent">Business Hours</dt>
            <dd className="mt-1">{site.hours}</dd>
          </div>
        </dl>
        <p className="mt-10 max-w-md text-sm leading-relaxed text-ink-soft">
          Fast Response Time. We typically respond to all inquiries within 24 hours. Our experienced professionals are
          dedicated to helping you succeed in your career journey.
        </p>
      </div>
      <ContactForm />
    </div>
    </div>
  );
}
