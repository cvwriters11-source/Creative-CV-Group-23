import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdminOrder } from "@/lib/admin/store";
import {
  contentTypeForFileName,
  resolveOrderUpload,
  resolveStoredUpload,
  type OrderUploadKind,
} from "@/lib/uploads";
import { getWriterSession } from "@/lib/writer/session";

export const runtime = "nodejs";

const kinds: OrderUploadKind[] = ["photo", "cv", "extra", "delivery"];

function originalNameFor(
  kind: OrderUploadKind,
  order: { cvFileName: string; photoFileName?: string; extraFileName?: string; deliveryFileName?: string },
) {
  if (kind === "cv") return order.cvFileName;
  if (kind === "photo") return order.photoFileName;
  if (kind === "delivery") return order.deliveryFileName;
  return order.extraFileName;
}

function contentDisposition(fileName: string, download: boolean) {
  const fallback = fileName.replace(/[^\w.\- ]+/g, "_") || "file";
  const encoded = encodeURIComponent(fileName);
  const type = download ? "attachment" : "inline";
  return `${type}; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; kind: string }> },
) {
  const session = await getWriterSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, kind } = await context.params;
  const order = await getAdminOrder(id);
  if (!order || order.assignedWriterId !== session.writerId) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const url = new URL(request.url);
  const stored = url.searchParams.get("stored") ?? "";
  const download = url.searchParams.get("download") === "1";

  if (kind === "correction") {
    const correction = order.corrections?.find((item) => item.storedFileName === stored);
    const filePath = await resolveStoredUpload(order.reference, correction?.storedFileName);
    if (!filePath) return NextResponse.json({ error: "File not found." }, { status: 404 });
    const file = await fs.readFile(filePath);
    const downloadName = correction?.fileName || path.basename(filePath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentTypeForFileName(downloadName),
        "Content-Disposition": contentDisposition(downloadName, download),
        "Cache-Control": "private, no-store",
      },
    });
  }

  if (!kinds.includes(kind as OrderUploadKind)) {
    return NextResponse.json({ error: "Unknown file type." }, { status: 400 });
  }

  const uploadKind = kind as OrderUploadKind;
  const originalName = originalNameFor(uploadKind, order);
  const filePath = await resolveOrderUpload(order.reference, uploadKind, originalName);
  if (!filePath) return NextResponse.json({ error: "File not found." }, { status: 404 });

  const file = await fs.readFile(filePath);
  const downloadName = originalName?.trim() || path.basename(filePath).replace(/^(photo|cv|extra|delivery)-/, "");
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": contentTypeForFileName(downloadName),
      "Content-Disposition": contentDisposition(downloadName, download),
      "Cache-Control": "private, no-store",
    },
  });
}
