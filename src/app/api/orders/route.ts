import { NextResponse } from "next/server";
import { recordOrder } from "@/lib/admin/store";
import { getResolvedCatalog } from "@/lib/catalog";
import { addons, type AddonId } from "@/lib/packages";
import { sendTransactionalEmail } from "@/lib/email";
import { initializePaystack, isPaystackConfigured } from "@/lib/paystack";
import { formatInternationalPhone, isKnownDialCode } from "@/lib/phone-codes";
import { site } from "@/lib/site";
import { isCvFile, isImageFile, saveOrderUpload } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const firstName = String(form.get("firstName") ?? "").trim();
  const lastName = String(form.get("lastName") ?? "").trim();
  const fullNameLegacy = String(form.get("fullName") ?? "").trim();
  const first = firstName || fullNameLegacy.split(/\s+/)[0] || "";
  const last = lastName || fullNameLegacy.split(/\s+/).slice(1).join(" ");
  const fullName = [first, last].filter(Boolean).join(" ");
  const email = String(form.get("email") ?? "").trim();
  const countryCode = String(form.get("countryCode") ?? "").trim();
  const nationalPhone = String(form.get("phone") ?? "").trim();
  const goals = String(form.get("goals") ?? "").trim();
  const packageId = String(form.get("packageId") ?? "");
  const amount = Number(form.get("amount") ?? 0);
  const addonIds = JSON.parse(String(form.get("addonIds") ?? "[]")) as AddonId[];
  const photo = form.get("photo");
  const cv = form.get("cv");
  const extra = form.get("extra");
  const catalog = await getResolvedCatalog();
  const pkg = catalog.find((item) => item.id === packageId);

  const photoFile = photo instanceof File && photo.size > 0 ? photo : null;
  const cvFile = cv instanceof File && cv.size > 0 ? cv : null;
  const extraFile = extra instanceof File && extra.size > 0 ? extra : null;

  if (!fullName || !email || !nationalPhone || !pkg) {
    return NextResponse.json({ error: "Please complete the required order fields." }, { status: 400 });
  }
  if (!isKnownDialCode(countryCode)) {
    return NextResponse.json({ error: "Please choose a valid country code." }, { status: 400 });
  }
  if (!photoFile || !isImageFile(photoFile)) {
    return NextResponse.json({ error: "Please upload a picture (JPG, PNG or WebP)." }, { status: 400 });
  }
  if (!cvFile || !isCvFile(cvFile)) {
    return NextResponse.json({ error: "Please upload your CV as a PDF, DOC or DOCX file." }, { status: 400 });
  }

  const phone = formatInternationalPhone(countryCode, nationalPhone);
  const reference = `ccv-${Date.now()}`;
  const addonNames = addonIds
    .map((id) => addons.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  let photoFileName = photoFile.name;
  let cvFileName = cvFile.name;
  let extraFileName = extraFile?.name ?? "";
  try {
    photoFileName = (await saveOrderUpload(reference, "photo", photoFile)) || photoFileName;
    cvFileName = (await saveOrderUpload(reference, "cv", cvFile)) || cvFileName;
    extraFileName = extraFile ? (await saveOrderUpload(reference, "extra", extraFile)) || extraFile.name : "";
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not save your files.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const paymentConfigured = isPaystackConfigured();
  const order = await recordOrder({
    reference,
    fullName,
    firstName: first,
    lastName: last,
    email,
    phone,
    packageId: pkg.id,
    packageName: pkg.name,
    addonNames: addonNames || "None",
    amount,
    status: paymentConfigured ? "pending_payment" : "received",
    goals,
    cvFileName,
    photoFileName,
    extraFileName,
    paymentConfigured,
  });

  const summary = [
    `Order ${order.orderNumber}`,
    `Internal ref: ${reference}`,
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Package: ${pkg.name} (R${pkg.price})`,
    `Add-ons: ${addonNames || "None"}`,
    `Amount: R${amount}`,
    `Picture: ${photoFileName}`,
    `CV: ${cvFileName}`,
    `Additional file: ${extraFileName || "None"}`,
    goals ? `Notes: ${goals}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await sendTransactionalEmail({
    to: process.env.CONTACT_TO_EMAIL ?? site.email,
    subject: `New Creative CV order ${order.orderNumber}`,
    text: summary,
  });

  if (!paymentConfigured) {
    return NextResponse.json({
      ok: true,
      paymentConfigured: false,
      reference,
      orderNumber: order.orderNumber,
    });
  }

  const origin = new URL(request.url).origin;
  const paystack = await initializePaystack({
    email,
    amountZar: amount,
    reference,
    callbackUrl: `${origin}/packages/order?paid=${reference}`,
    metadata: { packageId, fullName, orderNumber: order.orderNumber },
  });

  return NextResponse.json({
    ok: true,
    paymentConfigured: true,
    authorizationUrl: paystack?.authorization_url,
    reference,
    orderNumber: order.orderNumber,
  });
}
