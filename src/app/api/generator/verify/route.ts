import { NextResponse } from "next/server";
import { recordGeneratorEvent } from "@/lib/admin/store";
import { verifyPaystack } from "@/lib/paystack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { reference?: string; email?: string; fullName?: string };
  const reference = body.reference?.trim();
  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
  }

  const result = await verifyPaystack(reference);
  await recordGeneratorEvent({
    type: "verify",
    email: body.email ?? "",
    fullName: body.fullName ?? "",
    reference,
    paymentConfigured: Boolean(result.configured),
    paid: Boolean(result.paid),
  });
  if (!result.configured) {
    return NextResponse.json({
      paid: false,
      paymentConfigured: false,
      message:
        "Paystack is not configured, so this download cannot be unlocked. No payment has been taken.",
    });
  }

  if (!result.paid) {
    return NextResponse.json({
      paid: false,
      paymentConfigured: true,
      message: "Payment is not confirmed yet. The unwatermarked CV PDF has not been released.",
    });
  }

  return NextResponse.json({ paid: true, paymentConfigured: true, reference: result.reference });
}
