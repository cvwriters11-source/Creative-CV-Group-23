import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderCheckout } from "@/components/packages/order-checkout";
import { getResolvedCatalog, getResolvedPackageServices } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Complete your order",
  description: "Enter your name, phone, email, and upload your picture and CV to order a Creative CV package.",
};

export const dynamic = "force-dynamic";

export default async function PackageOrderPage() {
  const catalog = await getResolvedCatalog();
  const services = await getResolvedPackageServices();

  return (
    <div className="bg-paper">
      <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-16 text-ink-soft">Loading order form…</div>}>
        <OrderCheckout catalog={catalog} services={services} />
      </Suspense>
    </div>
  );
}
