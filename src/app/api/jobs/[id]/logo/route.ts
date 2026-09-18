import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getJobById } from "@/lib/admin/jobs";
import { contentTypeForFileName, resolveJobLogo } from "@/lib/uploads";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const job = await getJobById(id, true);
  if (!job?.logoFileName) return NextResponse.json({ error: "Logo not found." }, { status: 404 });

  const filePath = await resolveJobLogo(job.id, job.logoFileName);
  if (!filePath) return NextResponse.json({ error: "Logo not found." }, { status: 404 });

  const file = await fs.readFile(filePath);
  const downloadName = job.logoFileName || path.basename(filePath).replace(/^logo-/, "");
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": contentTypeForFileName(downloadName),
      "Cache-Control": "private, no-cache",
      "Content-Disposition": `inline; filename="${downloadName.replace(/[^\w.\- ]+/g, "_")}"`,
    },
  });
}
