import { TermsDocument } from "@/components/legal/terms-document";
import { getTermsContent } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const terms = await getTermsContent();

  return (
    <article className="bg-paper">
      <div className="mx-auto max-w-3xl px-5 py-16 leading-relaxed text-ink-soft lg:px-8">
        <TermsDocument terms={terms} />
      </div>
    </article>
  );
}
