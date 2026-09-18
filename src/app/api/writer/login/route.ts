import { NextResponse } from "next/server";
import { getWriterByEmail } from "@/lib/admin/store";
import { verifyPassword } from "@/lib/passwords";
import { setWriterSession } from "@/lib/writer/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const writer = await getWriterByEmail(email);
  if (!writer?.passwordHash || !(await verifyPassword(password, writer.passwordHash))) {
    return NextResponse.json({ error: "Invalid writer credentials." }, { status: 401 });
  }

  await setWriterSession({ writerId: writer.id, email: writer.email, name: writer.name });
  return NextResponse.json({ ok: true, redirect: "/writer" });
}
