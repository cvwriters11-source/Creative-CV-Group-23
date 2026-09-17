import { formatOpsZar } from "@/lib/admin/dashboard";
import { addons, packages } from "@/lib/packages";

export const metadata = { title: "Packages" };

export default function AdminPackagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Packages</h1>
      <p className="mt-1 text-sm text-slate-500">Public catalogue prices. These are not revenue until an order is paid.</p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-semibold">Package</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Turnaround</th>
              <th className="px-5 py-3 font-semibold">Audience</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 align-top">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs capitalize text-slate-400">{item.category}</p>
                </td>
                <td className="px-5 py-4 text-slate-700">{formatOpsZar(item.price)}</td>
                <td className="px-5 py-4 text-slate-600">{item.turnaroundLabel}</td>
                <td className="px-5 py-4 text-slate-500">{item.audience}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Add-ons</h2>
      <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-semibold">Add-on</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {addons.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-5 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-5 py-4 text-slate-700">{formatOpsZar(item.price)}</td>
                <td className="px-5 py-4 text-slate-500">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
