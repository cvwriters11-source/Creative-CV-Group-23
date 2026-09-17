import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { getAdminOrder } from "@/lib/admin/store";
import { contentTypeForFileName, resolveOrderUpload, type OrderUploadKind } from "@/lib/uploads";

export const runtime = "nodejs";

const kinds: OrderUploadKind[] = ["photo", "cv", "extra"];

function isUploadKind(value: string): value is OrderUploadKind {
  return kinds.includes(value as OrderUploadKind);
}

function originalNameFor(kind: OrderUploadKind, order: { cvFileName: string; photoFileName?: string; extraFileName?: string }) {
  if (kind === "cv") return order.cvFileName;
  if (kind === "photo") return order.photoFileName;
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
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, kind } = await context.params;
  if (!isUploadKind(kind)) {
    return NextResponse.json({ error: "Unknown file type." }, { status: 400 });
  }

  const order = await getAdminOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const originalName = originalNameFor(kind, order);
  const filePath = await resolveOrderUpload(order.reference, kind, originalName);
  if (!filePath) return NextResponse.json({ error: "File not found." }, { status: 404 });

  const file = await fs.readFile(filePath);
  const downloadName = originalName?.trim() || path.basename(filePath).replace(/^(photo|cv|extra)-/, "");
  const download = new URL(request.url).searchParams.get("download") === "1";

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": contentTypeForFileName(downloadName),
      "Content-Disposition": contentDisposition(downloadName, download),
      "Cache-Control": "private, no-store",
    },
  });
}
