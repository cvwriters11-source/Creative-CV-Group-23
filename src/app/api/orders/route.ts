import { NextResponse } from "next/server";
import { recordOrder } from "@/lib/admin/store";
import { addons, getPackage, type AddonId } from "@/lib/packages";
import { sendTransactionalEmail } from "@/lib/email";
import { initializePaystack, isPaystackConfigured } from "@/lib/paystack";
import { site } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const fullName = String(form.get("fullName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const goals = String(form.get("goals") ?? "").trim();
  const packageId = String(form.get("packageId") ?? "");
  const amount = Number(form.get("amount") ?? 0);
  const addonIds = JSON.parse(String(form.get("addonIds") ?? "[]")) as AddonId[];
  const file = form.get("cv");
  const pkg = getPackage(packageId);

  if (!fullName || !email || !phone || !goals || !pkg) {
    return NextResponse.json({ error: "Please complete the required order fields." }, { status: 400 });
  }

  const fileName = file instanceof File && file.size > 0 ? file.name : "";
  const reference = `ccv-${Date.now()}`;
  const addonNames = addonIds
    .map((id) => addons.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const summary = [
    `Order ${reference}`,
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Package: ${pkg.name} (R${pkg.price})`,
    `Add-ons: ${addonNames || "None"}`,
    `Amount: R${amount}`,
    `CV uploaded: ${fileName || "No"}`,
    `Goals: ${goals}`,
  ].join("\n");

  await sendTransactionalEmail({
    to: process.env.CONTACT_TO_EMAIL ?? site.email,
    subject: `New Creative CV order ${reference}`,
    text: summary,
  });

  const paymentConfigured = isPaystackConfigured();
  await recordOrder({
    reference,
    fullName,
    email,
    phone,
    packageId: pkg.id,
    packageName: pkg.name,
    addonNames: addonNames || "None",
    amount,
    status: paymentConfigured ? "pending_payment" : "received",
    goals,
    cvFileName: fileName,
    paymentConfigured,
  });

  if (!paymentConfigured) {
    return NextResponse.json({
      ok: true,
      paymentConfigured: false,
      reference,
      message:
        "Your order was submitted to Creative CV. Paystack keys are not configured, so no payment has been taken and this is not a successful charge. Add PAYSTACK_SECRET_KEY to enable checkout.",
    });
  }

  const origin = new URL(request.url).origin;
  const paystack = await initializePaystack({
    email,
    amountZar: amount,
    reference,
    callbackUrl: `${origin}/packages?paid=${reference}`,
    metadata: { packageId, fullName },
  });

  return NextResponse.json({
    ok: true,
    paymentConfigured: true,
    authorizationUrl: paystack?.authorization_url,
    reference,
  });
}
