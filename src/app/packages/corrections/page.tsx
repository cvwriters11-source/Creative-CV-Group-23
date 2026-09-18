import { ClientCorrectionsForm } from "@/components/packages/corrections-form";

export const metadata = { title: "CV corrections" };

export default function PackageCorrectionsPage() {
  return (
    <div className="bg-wash">
      <div className="mx-auto max-w-xl px-5 py-16">
        <p className="kicker">After delivery</p>
        <h1 className="mt-3 font-serif text-4xl">Send corrections</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Use the order number from your confirmation. We’ll email your writer and show the notes on both the admin and
          writer dashboards.
        </p>
        <div className="card-surface mt-8 bg-paper p-6 md:p-8">
          <ClientCorrectionsForm />
        </div>
      </div>
    </div>
  );
}
