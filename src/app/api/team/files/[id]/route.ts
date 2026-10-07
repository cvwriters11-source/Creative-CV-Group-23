import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { findTeamFileVersion, readAdminStore } from "@/lib/admin/store";
import { getTeamActor } from "@/lib/team";
import { contentTypeForFileName, resolveTeamUpload } from "@/lib/uploads";

export const runtime = "nodejs";

function contentDisposition(fileName: string) {
  const fallback = fileName.replace(/[^\w.\- ]+/g, "_") || "file";
  const encoded = encodeURIComponent(fileName);
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await getTeamActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const store = await readAdminStore();
  const found = findTeamFileVersion(store, id);
  if (!found) return NextResponse.json({ error: "File not found." }, { status: 404 });

  const filePath = await resolveTeamUpload(found.group.orderNumber, found.version.storedName);
  if (!filePath) return NextResponse.json({ error: "File not found." }, { status: 404 });

  const file = await fs.readFile(filePath);
  const downloadName = found.version.fileName || path.basename(filePath);
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": contentTypeForFileName(downloadName),
      "Content-Disposition": contentDisposition(downloadName),
      "Cache-Control": "private, no-store",
    },
  });
}
