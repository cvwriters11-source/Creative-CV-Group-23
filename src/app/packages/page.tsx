import { PackagesCatalogView } from "@/components/packages/packages-catalog";
import { getResolvedPackageServices, getResolvedPrimaryPackages, getResolvedReturnPackages } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function PackagesPage() {
  const items = await getResolvedPrimaryPackages();
  const returnItems = await getResolvedReturnPackages();
  const services = await getResolvedPackageServices();

  return <PackagesCatalogView items={items} returnItems={returnItems} services={services} />;
}
