import Link from "next/link";
import { StatusSelect } from "@/components/admin/status-select";
import { formatAdminDate } from "@/lib/admin/format";
import { formatOpsZar } from "@/lib/admin/dashboard";
import { readAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const store = await readAdminStore();
  const customers = Array.from(
    store.orders.reduce((map, order) => {
      const email = order.email.trim().toLowerCase();
      if (!email) return map;
      const existing = map.get(email);
      if (!existing) {
        map.set(email, {
          email,
          name: order.fullName,
          phone: order.phone,
          orders: 1,
          spent: order.amount,
        });
      } else {
        existing.orders += 1;
        existing.spent += order.amount;
      }
      return map;
    }, new Map<string, { email: string; name: string; phone: string; orders: number; spent: number }>()),
  ).map(([, value]) => value);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
      <p className="mt-1 text-sm text-slate-500">
        Unique clients from package orders. Contact form messages stay available{" "}
        <Link href="/admin/contacts" className="content-link">
          here
        </Link>
        .
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Orders</th>
              <th className="px-5 py-3 font-semibold">Order value</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-slate-500">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.email} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-400">{customer.email}</p>
                    {customer.phone ? <p className="text-xs text-slate-400">{customer.phone}</p> : null}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{customer.orders}</td>
                  <td className="px-5 py-4 text-slate-600">{formatOpsZar(customer.spent)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Contact messages</h2>
      <ul className="mt-4 grid gap-4">
        {store.contacts.length === 0 ? (
          <li className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            No messages yet.
          </li>
        ) : (
          store.contacts.map((contact) => (
            <li key={contact.id} className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{contact.name}</p>
                  <p className="text-sm text-slate-500">
                    {contact.email}
                    {contact.phone ? ` · ${contact.phone}` : ""}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{contact.message}</p>
                  <p className="mt-3 text-xs text-slate-400">{formatAdminDate(contact.createdAt)}</p>
                </div>
                <StatusSelect
                  endpoint="/api/admin/contacts"
                  id={contact.id}
                  value={contact.status}
                  options={[
                    { value: "new", label: "New" },
                    { value: "read", label: "Read" },
                    { value: "replied", label: "Replied" },
                  ]}
                />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
