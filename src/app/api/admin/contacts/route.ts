import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { updateContactStatus } from "@/lib/admin/store";
import type { ContactStatus } from "@/lib/admin/types";

export const runtime = "nodejs";

const statuses: ContactStatus[] = ["new", "read", "replied"];

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { id?: string; status?: ContactStatus };
  if (!body.id || !body.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: "A valid contact id and status are required." }, { status: 400 });
  }

  const contact = await updateContactStatus(body.id, body.status);
  if (!contact) return NextResponse.json({ error: "Message not found." }, { status: 404 });
  return NextResponse.json({ ok: true, contact });
}
