import { AdminOrderPlanCard } from "@/components/admin/order-plan-card";
import { readAdminStore, toPublicWriter } from "@/lib/admin/store";
import { getResolvedCatalog, getResolvedPackageServices } from "@/lib/catalog";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const [store, catalog, services] = await Promise.all([
    readAdminStore(),
    getResolvedCatalog(),
    getResolvedPackageServices(),
  ]);

  const writers = store.writers.map(toPublicWriter);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">Orders</h1>
      <p className="mt-1 text-sm text-slate-300">
        Assign a writer, review their upload, then approve to send the CV to the client. Corrections show here and on the writer dashboard.
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
                writers={writers}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
