import { NextResponse } from "next/server";
import { recordGeneratorEvent } from "@/lib/admin/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName?: string;
    email?: string;
    headline?: string;
    targetRole?: string;
  };
  if (!body.email || !body.fullName) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  await recordGeneratorEvent({
    type: "draft_complete",
    email: body.email,
    fullName: body.fullName,
    headline: body.headline,
    targetRole: body.targetRole,
    paymentConfigured: false,
    paid: false,
  });

  return NextResponse.json({ ok: true });
}
