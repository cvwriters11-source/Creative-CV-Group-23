import { TermsEditor } from "@/components/admin/terms-editor";
import { getTermsContent } from "@/lib/admin/store";

export const metadata = { title: "Terms" };

export default async function AdminTermsPage() {
  const terms = await getTermsContent();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-semibold text-white">Terms and Conditions</h1>
      <p className="mt-1 text-sm text-slate-300">
        Edit the public legal copy. Saving updates the Terms page on the website.
      </p>
      <div className="mt-6">
        <TermsEditor initial={terms} />
      </div>
    </div>
  );
}
