import { PackagesCatalogView } from "@/components/packages/packages-catalog";
import { getResolvedPackageServices, getResolvedPrimaryPackages } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const items = await getResolvedPrimaryPackages();
  const services = await getResolvedPackageServices();

  return <PackagesCatalogView items={items} services={services} />;
}
