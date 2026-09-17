import { ButtonLink, PageIntro } from "@/components/ui/primitives";
import { formatZar } from "@/lib/cn";
import { generatorPrice } from "@/lib/packages";

const reasons = [
  {
    title: "Professional Content",
    copy: "Your answers are transformed into professional, polished CV language that impresses recruiters.",
  },
  {
    title: "Ready in Minutes",
    copy: "Complete the questionnaire and get your professionally formatted CV in just minutes.",
  },
  {
    title: "ATS-Optimized",
    copy: "Your CV is designed to pass Applicant Tracking Systems used by top employers.",
  },
  {
    title: "Professional Template",
    copy: "Clean, modern design that stands out while maintaining professional standards.",
  },
];

const steps = [
  ["01", "Complete the Questionnaire", "Answer questions about your experience, skills, and career goals."],
  ["02", "Professional Enhancement", "Your content is refined into professional CV language."],
  ["03", "Preview Your CV", "Review your generated CV with a watermark preview."],
  ["04", "Download", "Pay once and download your polished, ready-to-use CV."],
];

const faqs = [
  {
    title: "How long does it take to create a CV?",
    copy: "The questionnaire takes about 15–20 minutes to complete. Once submitted, your CV is generated within seconds.",
  },
  {
    title: "Can I preview my CV before paying?",
    copy: "Yes! You’ll see a full preview of your CV with a watermark before making any payment. Only pay if you’re satisfied with the result.",
  },
  {
    title: "What if I need to make changes?",
    copy: "If you need to make changes, you can start a new questionnaire. For more personalized service, consider our professional CV writing packages.",
  },
  {
    title: "Is the CV ATS-friendly?",
    copy: "Absolutely! Our templates are designed to pass through Applicant Tracking Systems while still looking professional and modern.",
  },
];

export default function CvGeneratorPage() {
  return (
    <div>
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <PageIntro
            eyebrow="CV Generator"
            title="Create Your Professional CV in Minutes"
            lede="Answer a few questions and get a polished, ATS-optimized CV that gets you noticed by employers. Takes about 15–20 minutes."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/cv-generator/create" variant="accent">
              Start the questionnaire
            </ButtonLink>
            <ButtonLink href="/packages" variant="outline">
              Prefer a professional writer?
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-wash">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <p className="kicker">Why generate</p>
          <h2 className="mt-3 font-serif text-3xl">Why Use Our CV Generator?</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Get a professional CV without the hassle of formatting or writing from scratch.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {reasons.map((reason) => (
              <article key={reason.title} className="rounded-2xl border border-accent/30 bg-paper-deep p-6">
                <h3 className="font-serif text-2xl">{reason.title}</h3>
                <p className="mt-2 text-ink-soft">{reason.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold-soft">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <p className="kicker">How it works</p>
          <h2 className="mt-3 font-serif text-3xl">How It Works</h2>
          <p className="mt-2 text-ink-soft">Four simple steps to your professional CV</p>
          <ol className="mt-10 grid gap-8 md:grid-cols-2">
            {steps.map(([n, title, copy]) => (
              <li key={n} className="card-surface p-6">
                <p className="text-xs tracking-[0.18em] text-gold">{n}</p>
                <h3 className="mt-3 font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-ink-soft">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-charcoal text-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="kicker kicker-gold">Pricing</p>
            <h2 className="mt-3 font-serif text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-ink/70">One payment, lifetime access to your CV</p>
            <p className="mt-8 font-serif text-5xl text-gold">{formatZar(generatorPrice)}</p>
            <ul className="mt-6 space-y-2 text-ink/75">
              <li>— Professional summary</li>
              <li>— ATS-optimized formatting</li>
              <li>— Clean, modern design</li>
              <li>— PDF format for easy sharing</li>
              <li>— Instant download after payment</li>
              <li>— All sections professionally formatted</li>
            </ul>
            <p className="mt-6 text-sm text-ink/60">Preview your CV before paying</p>
            <ButtonLink href="/cv-generator/create" variant="accent" className="mt-8">
              Start the questionnaire
            </ButtonLink>
          </div>
          <div className="space-y-6 text-ink/75">
            {faqs.map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-2xl text-ink">{item.title}</h3>
                <p className="mt-2">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
