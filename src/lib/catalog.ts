import { unstable_noStore as noStore } from "next/cache";
import { getPackageServiceCatalog } from "@/lib/admin/store";
import { packages, type CatalogPackage } from "@/lib/packages";

export async function getResolvedCatalog(): Promise<CatalogPackage[]> {
  noStore();
  const { map } = await getPackageServiceCatalog();
  return packages.map((pkg) => ({
    ...pkg,
    features: map[pkg.id] ?? pkg.features,
  }));
}

export async function getResolvedPackageServices() {
  noStore();
  const { services } = await getPackageServiceCatalog();
  return services.map(({ id, label }) => ({ id, label }));
}

export async function getResolvedPrimaryPackages() {
  const catalog = await getResolvedCatalog();
  return catalog.filter((item) => item.category === "core" || item.category === "standalone");
}
