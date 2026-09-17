import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { updateOrderStatus } from "@/lib/admin/store";
import type { OrderStatus } from "@/lib/admin/types";

export const runtime = "nodejs";

const statuses: OrderStatus[] = ["received", "pending_payment", "paid", "in_progress", "complete"];

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { id?: string; status?: OrderStatus };
  if (!body.id || !body.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: "A valid order id and status are required." }, { status: 400 });
  }

  const order = await updateOrderStatus(body.id, body.status);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}
