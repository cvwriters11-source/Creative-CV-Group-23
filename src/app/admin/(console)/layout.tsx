import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { getAdminSession } from "@/lib/admin/session";
import { readAdminStore } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/auth/login");
  const store = await readAdminStore();
  const pendingCount = store.orders.filter(
    (order) => order.status === "received" || order.status === "pending_payment",
  ).length;

  return (
    <div className="admin-ops flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden lg:flex-row">
      <AdminSidebar email={session.email} />
      <div className="admin-main flex min-w-0 flex-1 flex-col">
        <AdminTopbar pendingCount={pendingCount} />
        <div className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
