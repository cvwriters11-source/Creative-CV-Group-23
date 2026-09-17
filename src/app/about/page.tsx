import { ButtonLink, PageIntro } from "@/components/ui/primitives";
import { site } from "@/lib/site";

const values = [
  { title: "Professionalism", copy: "Delivering high-quality, industry-standard documents." },
  { title: "Integrity", copy: "Being honest, transparent, and client-focused." },
  { title: "Innovation", copy: "Continuously improving our tools, templates, and career solutions." },
  { title: "Excellence", copy: "Providing exceptional results that exceed client expectations." },
  { title: "Empowerment", copy: "Helping individuals unlock their full potential and advance their careers." },
];

const services = [
  "Professional CV Writing & Revamping",
  "LinkedIn Profile Optimisation",
  "Tailored Cover Letters",
  "Interview Coaching & Preparation",
  "International Job Application Guidance",
  "Career Consultations & Development Planning",
];

export default function AboutPage() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <PageIntro
        eyebrow="About"
        title="About Creative CV"
        lede={`Established in ${site.founded} by ${site.founder} with a powerful vision: to help job seekers confidently position themselves for local and international opportunities through expertly crafted career documents and personalised support.`}
      />

      <section className="mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="heading-accent font-serif text-3xl">Our Story</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">
            <p>
              Creative CV was established in {site.founded} by {site.founder} with a powerful vision: to help job
              seekers confidently position themselves for local and international opportunities. The company was built
              on the belief that a well-crafted CV has the power to change a person’s future.
            </p>
            <p>
              From humble beginnings, Creative CV has grown into a trusted brand known for producing world-class CVs,
              LinkedIn makeovers, cover letters, interview preparation, and tailored career guidance. Over the years, we
              have supported thousands of clients—from recent graduates to senior executives—helping them gain
              interviews, promotions, and global opportunities.
            </p>
            <p>Our commitment is simple: To deliver career documents that speak, impress, and open doors.</p>
            <p>
              Creative CV continues to innovate with digital tools, advanced writing techniques, and personalised career
              support. We strive to empower every client to stand out with confidence and achieve their next career
              milestone.
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          <article className="rounded-3xl border border-accent/40 bg-paper-deep p-8 text-ink">
            <h3 className="font-serif text-2xl text-gold">Mission</h3>
            <p className="mt-3 leading-relaxed text-ink/90">
              To empower job seekers by providing world-class CVs, professional branding, and career guidance that
              enhances confidence and opens meaningful opportunities.
            </p>
          </article>
          <article className="rounded-3xl border border-gold/40 bg-gold-soft p-8">
            <h3 className="font-serif text-2xl">Vision</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              To become Africa’s leading career-development company, recognised globally for transforming the job-search
              experience through innovation, quality, and excellence.
            </p>
          </article>
        </div>
      </section>

      <section className="mt-20 rounded-3xl bg-wash px-6 py-10 md:px-8">
        <h2 className="heading-accent font-serif text-3xl">Our Core Values</h2>
        <p className="mt-2 text-ink-soft">These core values guide everything we do at Creative CV</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {values.map((value) => (
            <article key={value.title} className="border-t-2 border-accent pt-5">
              <h3 className="font-serif text-xl">{value.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{value.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-10 md:grid-cols-3">
        {[
          [`${site.founded}`, "Established"],
          ["1,000s+", "Clients Supported"],
          ["5+", "Core Services"],
        ].map(([stat, label]) => (
          <div key={label} className="rounded-3xl border border-gold/40 bg-gold-soft px-6 py-8">
            <p className="font-serif text-4xl text-accent">{stat}</p>
            <p className="mt-2 text-sm text-ink-soft">{label}</p>
          </div>
        ))}
      </section>

      <section className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="heading-accent font-serif text-3xl">Company Profile</h2>
          <dl className="mt-6 space-y-3 text-ink-soft">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-accent">Company Name</dt>
              <dd>Creative CV</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-accent">Established</dt>
              <dd>{site.founded}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-accent">Founder</dt>
              <dd>{site.founder}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-accent">Industry</dt>
              <dd>Career Development & Personal Branding</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 className="heading-accent font-serif text-3xl">Our Services</h2>
          <ul className="mt-6 space-y-2 text-ink-soft">
            {services.map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-charcoal px-8 py-12 text-ink">
        <p className="kicker kicker-gold">Get started</p>
        <h2 className="mt-3 font-serif text-3xl">Ready to Get Started?</h2>
        <p className="mt-3 max-w-xl text-ink/70">
          Let our team of professional writers help you create a CV that gets results
        </p>
        <ButtonLink href="/packages" variant="accent" className="mt-6">
          View packages
        </ButtonLink>
      </section>
      </div>
    </div>
  );
}
