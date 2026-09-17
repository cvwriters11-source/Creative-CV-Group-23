import { formatAdminDate } from "@/lib/admin/format";
import { readAdminStore } from "@/lib/admin/store";
import { formatZar } from "@/lib/cn";

export const metadata = { title: "Generator" };

const typeLabel = {
  pay_attempt: "Checkout attempt",
  draft_complete: "Draft complete",
  verify: "Payment verify",
};

export default async function AdminGeneratorPage() {
  const store = await readAdminStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">CV generator</h1>
      <p className="mt-1 text-sm text-slate-500">
        Draft completions and checkout attempts. Unconfigured Paystack still logs the attempt and never marks a charge as
        paid.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper-deep text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Person</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {store.generatorEvents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-ink-soft">
                  No generator events yet.
                </td>
              </tr>
            ) : (
              store.generatorEvents.map((event) => (
                <tr key={event.id} className="border-t border-line align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-ink">{event.fullName || "—"}</p>
                    <p className="text-ink-soft">{event.email}</p>
                    {event.headline ? <p className="text-xs text-ink-soft">{event.headline}</p> : null}
                    {event.targetRole ? <p className="text-xs text-ink-soft">Target: {event.targetRole}</p> : null}
                  </td>
                  <td className="px-4 py-4">
                    <p>{typeLabel[event.type]}</p>
                    {event.reference ? <p className="text-xs text-ink-soft">{event.reference}</p> : null}
                    {event.amount ? <p className="text-xs text-ink-soft">{formatZar(event.amount)}</p> : null}
                  </td>
                  <td className="px-4 py-4 text-ink-soft">
                    {event.paid
                      ? "Paid"
                      : event.paymentConfigured
                        ? "Not confirmed"
                        : "Paystack not configured — no charge"}
                  </td>
                  <td className="px-4 py-4 text-ink-soft">{formatAdminDate(event.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
