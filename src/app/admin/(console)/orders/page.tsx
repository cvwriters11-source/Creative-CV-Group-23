import { AdminOrderPlanCard } from "@/components/admin/order-plan-card";
import { readAdminStore } from "@/lib/admin/store";
import { getResolvedCatalog, getResolvedPackageServices } from "@/lib/catalog";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const [store, catalog, services] = await Promise.all([
    readAdminStore(),
    getResolvedCatalog(),
    getResolvedPackageServices(),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">Orders</h1>
      <p className="mt-1 text-sm text-slate-300">
        Incoming package orders. Payment is only marked paid when you confirm it — Paystack is never assumed successful.
      </p>

      {store.orders.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No orders yet.</p>
      ) : (
        <div className="mt-8 grid gap-8">
          {store.orders.map((order) => {
            const pkg = catalog.find((item) => item.id === order.packageId);
            const included = services
              .filter((feature) => pkg?.features.includes(feature.id))
              .map((feature) => feature.label);
            return (
              <AdminOrderPlanCard
                key={order.id}
                order={order}
                tabLabel={pkg?.headerName ?? order.packageName}
                tone={pkg?.tone}
                included={included}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
