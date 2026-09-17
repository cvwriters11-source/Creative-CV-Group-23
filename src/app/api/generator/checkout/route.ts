import { NextResponse } from "next/server";
import { recordGeneratorEvent } from "@/lib/admin/store";
import { generatorPrice } from "@/lib/packages";
import { initializePaystack, isPaystackConfigured } from "@/lib/paystack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    draft?: { email?: string; fullName?: string; headline?: string; targetRole?: string };
    amount?: number;
  };
  const email = body.draft?.email;
  if (!email) {
    return NextResponse.json({ error: "Add your email in Personal & Contact before checkout." }, { status: 400 });
  }
  const amount = body.amount ?? generatorPrice;
  const reference = `gen-${Date.now()}`;
  const paymentConfigured = isPaystackConfigured();

  await recordGeneratorEvent({
    type: "pay_attempt",
    email,
    fullName: body.draft?.fullName ?? "",
    headline: body.draft?.headline,
    targetRole: body.draft?.targetRole,
    reference,
    amount,
    paymentConfigured,
    paid: false,
  });

  if (!paymentConfigured) {
    return NextResponse.json({
      ok: true,
      paymentConfigured: false,
      reference,
      message:
        "Your CV draft is ready. Paystack is not configured on this environment, so payment has not been taken and the unwatermarked PDF cannot be released. Add PAYSTACK_SECRET_KEY to enable download checkout.",
    });
  }

  const origin = new URL(request.url).origin;
  const paystack = await initializePaystack({
    email,
    amountZar: amount,
    reference,
    callbackUrl: `${origin}/cv-generator/create?paid=${reference}`,
    metadata: { type: "generator", name: body.draft?.fullName ?? "" },
  });

  return NextResponse.json({
    ok: true,
    paymentConfigured: true,
    authorizationUrl: paystack?.authorization_url,
    reference,
  });
}
