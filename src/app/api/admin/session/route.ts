import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({
    authenticated: Boolean(session),
    email: session?.email ?? null,
  });
}
