import { PackageServicesManager } from "@/components/admin/package-services-manager";
import { getPackageServiceCatalog } from "@/lib/admin/store";

export const metadata = { title: "Packages" };

export default async function AdminPackagesPage() {
  const catalog = await getPackageServiceCatalog();

  return (
    <div className="min-w-0">
      <h1 className="text-2xl font-semibold text-slate-900">Packages</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pick a package, edit the name, price, turnaround, description, or a promotion, then save. Public cards update as soon as you save.
      </p>
      <div className="mt-6">
        <PackageServicesManager initial={catalog} />
      </div>
    </div>
  );
}
