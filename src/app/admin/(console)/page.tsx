import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  DollarSign,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";
import { formatOpsZar, getDashboardMetrics } from "@/lib/admin/dashboard";
import { readAdminStore } from "@/lib/admin/store";
import { cn } from "@/lib/cn";

export const metadata = { title: "Dashboard" };

const iconWrap = {
  green: "bg-emerald-100 text-emerald-600",
  teal: "bg-teal-100 text-teal-600",
  blue: "bg-sky-100 text-sky-600",
  amber: "bg-amber-100 text-amber-500",
  purple: "bg-violet-100 text-violet-600",
};

function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
  hint,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ size?: number }>;
  tone: keyof typeof iconWrap;
  hint?: string;
}) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          {hint ? <p className="mt-1 text-xs text-amber-600">{hint}</p> : null}
        </div>
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", iconWrap[tone])}>
          <Icon size={18} />
        </span>
      </div>
    </article>
  );
}

export default async function AdminOverviewPage() {
  const store = await readAdminStore();
  const metrics = getDashboardMetrics(store);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Welcome back! Here’s an overview of your operations.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Today" value={formatOpsZar(metrics.revenueToday)} icon={DollarSign} tone="green" />
        <KpiCard label="This Week" value={formatOpsZar(metrics.revenueWeek)} icon={TrendingUp} tone="teal" />
        <KpiCard label="This Month" value={formatOpsZar(metrics.revenueMonth)} icon={DollarSign} tone="blue" />
        <KpiCard label="All Time" value={formatOpsZar(metrics.revenueAll)} icon={TrendingUp} tone="teal" />
        <KpiCard label="Total Orders" value={String(metrics.totalOrders)} icon={ClipboardList} tone="blue" />
        <KpiCard
          label="Pending Orders"
          value={String(metrics.pendingOrders)}
          icon={Clock3}
          tone="amber"
          hint={metrics.pendingOrders > 0 ? "Requires attention" : undefined}
        />
        <KpiCard label="Completed Orders" value={String(metrics.completedOrders)} icon={CheckCircle2} tone="green" />
        <KpiCard label="Total Customers" value={String(metrics.totalCustomers)} icon={Users} tone="purple" />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <UserRound size={16} />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Writer Performance</h2>
          </div>
          <Link href="/admin/writers" className="text-sm font-medium text-teal-600 hover:text-teal-700">
            Manage writers
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Writer</th>
                <th className="px-5 py-3 font-semibold">Active orders</th>
                <th className="px-5 py-3 font-semibold">Completed</th>
                <th className="px-5 py-3 font-semibold">Avg. turnaround</th>
                <th className="px-5 py-3 text-right font-semibold">Total revenue</th>
              </tr>
            </thead>
            <tbody>
              {metrics.writers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-slate-500">
                    No writers yet. Add a writer to see performance here — figures stay at zero until orders are assigned.
                  </td>
                </tr>
              ) : (
                metrics.writers.map((writer) => (
                  <tr key={writer.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{writer.name}</p>
                      <p className="text-xs text-slate-400">{writer.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                        {writer.activeOrders}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{writer.completed}</td>
                    <td className="px-5 py-4 text-slate-600">{writer.avgTurnaroundDays.toFixed(1)} days</td>
                    <td className="px-5 py-4 text-right text-slate-500">{formatOpsZar(writer.totalRevenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
