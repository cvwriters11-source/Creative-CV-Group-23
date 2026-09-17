import { NextResponse } from "next/server";
import { setSessionUser } from "@/lib/session";
import { createAnonClient } from "@/lib/supabase/anon";
import type { UserRole } from "@/lib/auth-types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    role?: UserRole;
  };
  if (!body.email || !body.password || !body.role) {
    return NextResponse.json({ error: "Email, password, and account type are required." }, { status: 400 });
  }

  const supabase = createAnonClient();
  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  await setSessionUser({
    id: crypto.randomUUID(),
    email: body.email,
    fullName: body.email.split("@")[0],
    role: body.role,
  });

  return NextResponse.json({
    ok: true,
    redirect: body.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard",
  });
}
