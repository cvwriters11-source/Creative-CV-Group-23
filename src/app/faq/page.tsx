import { faqs } from "@/lib/faq";
import { PageIntro } from "@/components/ui/primitives";

export default function FaqPage() {
  return (
    <div className="bg-gold-soft/70">
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <PageIntro
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          lede="Find answers to common questions about our CV writing services"
        />
        <div className="mt-12 space-y-4">
          {faqs.map((item) => (
            <details key={item.q} className="group card-surface px-5 py-4 open:border-accent open:bg-wash">
              <summary className="cursor-pointer list-none font-medium text-ink group-open:text-accent">{item.q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-12 text-ink-soft">
          Still have questions? Our support team is available 24/7. Call{" "}
          <a className="content-link" href="tel:+27746502580">+27 74 650 2580</a> or email{" "}
          <a className="content-link" href="mailto:info@creative-cv.co.za">info@creative-cv.co.za</a>.
        </p>
      </div>
    </div>
  );
}
