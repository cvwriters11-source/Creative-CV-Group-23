import { NextResponse } from "next/server";
import { getAdminCredentials, passwordsMatch, setAdminSession } from "@/lib/admin/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const expected = getAdminCredentials();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const emailOk = email === expected.email;
  const passwordOk = passwordsMatch(password, expected.password);
  if (!emailOk || !passwordOk) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  await setAdminSession(expected.email);
  return NextResponse.json({ ok: true, redirect: "/admin" });
}
