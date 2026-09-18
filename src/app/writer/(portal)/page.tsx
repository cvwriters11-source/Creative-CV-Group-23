import { WriterAssignedOrders } from "@/components/writer/assigned-orders";
import { getWriterOrders } from "@/lib/admin/store";
import { getWriterSession } from "@/lib/writer/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Writer dashboard" };

export default async function WriterDashboardPage() {
  const session = await getWriterSession();
  if (!session) redirect("/writer/login");
  const orders = await getWriterOrders(session.writerId);
  const open = orders.filter((order) => order.status !== "complete");
  const corrections = orders.filter((order) => order.status === "corrections");

  return (
    <div>
      <h1 className="font-serif text-3xl text-white">Your assignments</h1>
      <p className="mt-2 text-sm text-slate-300">
        You only see orders assigned to you. Upload the finished CV and mark it for review — admin is notified at the same time.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-white/10 px-3 py-1">{open.length} open</span>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-100">{corrections.length} corrections</span>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-100">
          {orders.filter((order) => order.status === "complete").length} complete
        </span>
      </div>
      <div className="mt-8">
        <WriterAssignedOrders orders={orders} />
      </div>
    </div>
  );
}
