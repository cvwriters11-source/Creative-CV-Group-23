import { PageIntro } from "@/components/ui/primitives";
import { site } from "@/lib/site";
import { parseTermsBody, TERMS_EYEBROW, type TermsContent } from "@/lib/legal/terms";

const TOKEN = /(\*\*[^*]+\*\*|\{email\}|\{phone\})/g;

function TermsInline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return parts.map((part, index) => {
    if (part === "{email}") {
      return (
        <a key={index} className="content-link" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      );
    }
    if (part === "{phone}") {
      return (
        <a key={index} className="content-link" href={site.phoneHref}>
          {site.phone}
        </a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

export function TermsDocument({ terms }: { terms: TermsContent }) {
  return (
    <>
      <PageIntro eyebrow={TERMS_EYEBROW} title={terms.title} />
      <p className="mt-8 text-sm">Last updated: {terms.lastUpdated}</p>
      <div className="mt-10 space-y-8">
        {terms.sections.map((section) => (
          <section key={section.id}>
            <h2 className="heading-accent font-serif text-2xl text-ink">{section.heading}</h2>
            {parseTermsBody(section.body).map((block, index) => {
              if (block.type === "ul") {
                return (
                  <ul key={index} className="mt-3 list-disc space-y-2 pl-5">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <TermsInline text={item} />
                      </li>
                    ))}
                  </ul>
                );
              }
              const className =
                block.variant === "accent"
                  ? "mt-3 font-semibold text-accent"
                  : block.variant === "label"
                    ? "mt-3 font-semibold text-ink"
                    : "mt-3";
              return (
                <p key={index} className={className}>
                  <TermsInline text={block.text} />
                </p>
              );
            })}
          </section>
        ))}
      </div>
    </>
  );
}
