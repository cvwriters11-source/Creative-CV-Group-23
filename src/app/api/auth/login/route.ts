import { NextResponse } from "next/server";
import { getAdminCredentials, passwordsMatch, setAdminSession } from "@/lib/admin/session";
import { setSessionUser } from "@/lib/session";
import { createAnonClient } from "@/lib/supabase/anon";
import type { UserRole } from "@/lib/auth-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    role?: UserRole;
  };
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const expected = getAdminCredentials();
  if (email.trim().toLowerCase() === expected.email) {
    if (!passwordsMatch(password, expected.password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    await setAdminSession(expected.email);
    return NextResponse.json({ ok: true, redirect: "/admin" });
  }

  if (!body.role) {
    return NextResponse.json({ error: "Email, password, and account type are required." }, { status: 400 });
  }

  const supabase = createAnonClient();
  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  await setSessionUser({
    id: crypto.randomUUID(),
    email,
    fullName: email.split("@")[0],
    role: body.role,
  });

  return NextResponse.json({
    ok: true,
    redirect: body.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard",
  });
}
