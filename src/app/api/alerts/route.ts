import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "job_seeker") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  const form = await request.formData();
  const keywords = String(form.get("keywords") ?? "");
  return NextResponse.redirect(
    new URL(`/dashboard?alert=${encodeURIComponent(keywords || "saved")}`, request.url),
  );
}
