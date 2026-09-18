import { unstable_noStore as noStore } from "next/cache";
import { getPackageServiceCatalog } from "@/lib/admin/store";
import { applyPackageMeta, defaultPackageTurnaroundMap, packages, type CatalogPackage } from "@/lib/packages";

export async function getResolvedCatalog(): Promise<CatalogPackage[]> {
  noStore();
  const { map, meta } = await getPackageServiceCatalog();
  const defaults = defaultPackageTurnaroundMap();
  return packages.map((pkg) =>
    applyPackageMeta(
      {
        ...pkg,
        features: map[pkg.id] ?? pkg.features,
      },
      meta[pkg.id] ?? defaults[pkg.id],
    ),
  );
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

export async function getResolvedReturnPackages() {
  const catalog = await getResolvedCatalog();
  return catalog.filter((item) => item.category === "return");
}
