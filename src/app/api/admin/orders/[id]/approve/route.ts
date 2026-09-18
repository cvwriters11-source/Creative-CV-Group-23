import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { approveOrder } from "@/lib/admin/store";
import { emailClientApprovedCv } from "@/lib/workflow-emails";

export const runtime = "nodejs";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const result = await approveOrder(id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  await emailClientApprovedCv(result.order);
  return NextResponse.json({ ok: true, order: result.order });
}
