import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { assignWriter, updateOrderStatus } from "@/lib/admin/store";
import type { OrderStatus } from "@/lib/admin/types";
import { emailWriterAssigned } from "@/lib/workflow-emails";

export const runtime = "nodejs";

const statuses: OrderStatus[] = [
  "received",
  "pending_payment",
  "paid",
  "in_progress",
  "review",
  "corrections",
  "complete",
];

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { id?: string; status?: OrderStatus; assignedWriterId?: string };
  if (!body.id) {
    return NextResponse.json({ error: "A valid order id is required." }, { status: 400 });
  }

  if (body.assignedWriterId) {
    const result = await assignWriter(body.id, body.assignedWriterId);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    await emailWriterAssigned(result.order, result.writer);
    return NextResponse.json({ ok: true, order: result.order });
  }

  if (!body.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: "A valid order id and status are required." }, { status: 400 });
  }

  const order = await updateOrderStatus(body.id, body.status);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}
