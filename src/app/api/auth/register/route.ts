import { NextResponse } from "next/server";
import { recordUser } from "@/lib/admin/store";
import { setSessionUser } from "@/lib/session";
import { createAnonClient } from "@/lib/supabase/anon";
import type { UserRole } from "@/lib/auth-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName?: string;
    email?: string;
    password?: string;
    company?: string;
    role?: UserRole;
  };
  if (!body.fullName || !body.email || !body.password || !body.role) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }
  if (body.password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const supabase = createAnonClient();
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: body.email,
        full_name: body.fullName,
        role: body.role,
        company: body.company ?? null,
      });
    }
  }

  const user = await recordUser({
    email: body.email,
    fullName: body.fullName,
    role: body.role,
    company: body.company,
  });

  await setSessionUser({
    id: user.id,
    email: body.email,
    fullName: body.fullName,
    role: body.role,
    company: body.company,
  });

  return NextResponse.json({
    ok: true,
    redirect: body.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard",
  });
}
