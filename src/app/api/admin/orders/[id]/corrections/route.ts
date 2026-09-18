import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { addOrderCorrection, getAdminOrder } from "@/lib/admin/store";
import { isCvFile, saveNamedOrderUpload } from "@/lib/uploads";
import { emailWriterCorrections } from "@/lib/workflow-emails";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const form = await request.formData();
  const message = String(form.get("message") ?? "").trim();
  const file = form.get("file");
  const order = await getAdminOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  let fileName: string | undefined;
  let storedFileName: string | undefined;
  if (file instanceof File && file.size > 0) {
    if (!isCvFile(file) && !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Upload a PDF, Word document, or image." }, { status: 400 });
    }
    storedFileName = await saveNamedOrderUpload(
      order.reference,
      `correction-${crypto.randomUUID().slice(0, 8)}-${file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80)}`,
      file,
    );
    fileName = file.name;
  }

  const result = await addOrderCorrection({
    orderId: id,
    message,
    fileName,
    storedFileName,
    source: "admin",
  });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  if (result.writer) await emailWriterCorrections(result.order, result.writer, message);
  return NextResponse.json({ ok: true, order: result.order });
}
