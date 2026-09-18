import { NextResponse } from "next/server";
import { clearWriterSession } from "@/lib/writer/session";

export async function POST() {
  await clearWriterSession();
  return NextResponse.json({ ok: true });
}
