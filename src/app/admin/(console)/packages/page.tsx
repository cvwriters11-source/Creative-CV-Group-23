import { PackageServicesManager } from "@/components/admin/package-services-manager";
import { getPackageServiceCatalog } from "@/lib/admin/store";

export const metadata = { title: "Packages" };

export default async function AdminPackagesPage() {
  const catalog = await getPackageServiceCatalog();

  return (
    <div className="min-w-0">
      <h1 className="text-2xl font-semibold text-slate-900">Packages</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pick a package and edit the name, price, turnaround, description, or a promotion. Home, packages, and checkout update at the same time.
      </p>
      <div className="mt-6">
        <PackageServicesManager initial={catalog} />
      </div>
    </div>
  );
}
