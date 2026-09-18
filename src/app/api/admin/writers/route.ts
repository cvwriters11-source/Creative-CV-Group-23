import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { addWriter, removeWriter, setWriterPassword, toPublicWriter } from "@/lib/admin/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { name?: string; email?: string; phone?: string; password?: string };
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const result = await addWriter({ name, email, phone: body.phone, password });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, writer: result.writer });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { id?: string; password?: string };
  if (!body.id || !body.password) {
    return NextResponse.json({ error: "Writer id and password are required." }, { status: 400 });
  }

  const result = await setWriterPassword(body.id, body.password);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, writer: result.writer });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ error: "Writer id is required." }, { status: 400 });

  const result = await removeWriter(body.id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 404 });
  return NextResponse.json({ ok: true, writer: toPublicWriter(result.writer) });
}
