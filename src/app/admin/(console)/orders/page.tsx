import { StatusSelect } from "@/components/admin/status-select";
import { formatAdminDate } from "@/lib/admin/format";
import { readAdminStore } from "@/lib/admin/store";
import { formatZar } from "@/lib/cn";

export const metadata = { title: "Orders" };

const statusOptions = [
  { value: "received", label: "Received" },
  { value: "pending_payment", label: "Pending payment" },
  { value: "paid", label: "Paid" },
  { value: "in_progress", label: "In progress" },
  { value: "complete", label: "Complete" },
];

export default async function AdminOrdersPage() {
  const store = await readAdminStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
      <p className="mt-1 text-sm text-slate-500">
        Incoming package orders. Payment is only marked paid when you confirm it — Paystack is never assumed successful.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper-deep text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {store.orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-ink-soft">
                  No orders yet.
                </td>
              </tr>
            ) : (
              store.orders.map((order) => (
                <tr key={order.id} className="border-t border-line align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-ink">{order.fullName}</p>
                    <p className="text-ink-soft">{order.email}</p>
                    <p className="text-ink-soft">{order.phone}</p>
                    <p className="mt-2 text-xs text-ink-soft">Ref {order.reference}</p>
                    {order.cvFileName ? <p className="mt-1 text-xs text-accent">CV uploaded: {order.cvFileName}</p> : null}
                    {order.goals ? <p className="mt-2 max-w-xs text-xs text-ink-soft">Notes: {order.goals}</p> : null}
                    {!order.paymentConfigured ? (
                      <p className="mt-2 text-xs text-ink-soft">Paystack not configured — no charge taken.</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <p>{order.packageName}</p>
                    {order.addonNames ? <p className="text-xs text-ink-soft">{order.addonNames}</p> : null}
                  </td>
                  <td className="px-4 py-4">{formatZar(order.amount)}</td>
                  <td className="px-4 py-4">
                    <StatusSelect endpoint="/api/admin/orders" id={order.id} value={order.status} options={statusOptions} />
                  </td>
                  <td className="px-4 py-4 text-ink-soft">{formatAdminDate(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
