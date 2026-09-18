import { NextResponse } from "next/server";
import { addOrderCorrection, findOrderByNumberAndEmail } from "@/lib/admin/store";
import { isCvFile, saveNamedOrderUpload } from "@/lib/uploads";
import { emailWriterCorrections } from "@/lib/workflow-emails";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const orderNumber = String(form.get("orderNumber") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const file = form.get("file");

  if (!orderNumber || !email || !message) {
    return NextResponse.json({ error: "Order number, email, and correction notes are required." }, { status: 400 });
  }

  const order = await findOrderByNumberAndEmail(orderNumber, email);
  if (!order) {
    return NextResponse.json({ error: "Order number and email do not match." }, { status: 400 });
  }

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
    orderId: order.id,
    email,
    message,
    fileName,
    storedFileName,
    source: "client",
  });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  if (result.writer) await emailWriterCorrections(result.order, result.writer, message);
  return NextResponse.json({ ok: true });
}
