import { NextResponse } from "next/server";
import { recordContact } from "@/lib/admin/store";
import { sendTransactionalEmail } from "@/lib/email";
import { site } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Please complete name, email, and message." }, { status: 400 });
  }

  await recordContact({
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: body.message,
  });

  const text = `Name: ${body.name}\nEmail: ${body.email}\nPhone: ${body.phone ?? ""}\n\n${body.message}`;
  const result = await sendTransactionalEmail({
    to: process.env.CONTACT_TO_EMAIL ?? site.email,
    subject: `Creative CV contact from ${body.name}`,
    text,
  });

  if (!result.sent) {
    return NextResponse.json({
      ok: true,
      message:
        "Your message was received. Email delivery is not configured on this environment (Resend API key missing), so please also write to  info@creative-cv.co.za or call +27 74 650 2580.",
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you. We typically respond to all inquiries within 24 hours.",
  });
}
