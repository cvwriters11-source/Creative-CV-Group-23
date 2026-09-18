import { NextResponse } from "next/server";
import { getAdminOrder, getWriterById, submitOrderForReview } from "@/lib/admin/store";
import { isCvFile, saveOrderUpload } from "@/lib/uploads";
import { emailAdminReviewReady } from "@/lib/workflow-emails";
import { getWriterSession } from "@/lib/writer/session";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getWriterSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const form = await request.formData();
  const file = form.get("cv");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Upload the completed CV before marking it for review." }, { status: 400 });
  }
  if (!isCvFile(file)) {
    return NextResponse.json({ error: "Please upload a PDF or Word document." }, { status: 400 });
  }

  const writer = await getWriterById(session.writerId);
  if (!writer) return NextResponse.json({ error: "Writer not found." }, { status: 404 });

  const existing = await getAdminOrder(id);
  if (!existing || existing.assignedWriterId !== session.writerId) {
    return NextResponse.json({ error: "This order is not assigned to you." }, { status: 403 });
  }

  let deliveryFileName = "";
  try {
    deliveryFileName = await saveOrderUpload(existing.reference, "delivery", file);
  } catch (error) {
    const text = error instanceof Error ? error.message : "Could not save the CV.";
    return NextResponse.json({ error: text }, { status: 400 });
  }
  const result = await submitOrderForReview(id, session.writerId, deliveryFileName);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  await emailAdminReviewReady(result.order, writer.name);
  return NextResponse.json({ ok: true, order: result.order });
}
