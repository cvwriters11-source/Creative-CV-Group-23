import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { getTermsContent, saveTermsContent } from "@/lib/admin/store";
import { formatTermsDate, type TermsContent } from "@/lib/legal/terms";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ terms: await getTermsContent() });
}

export async function PUT(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<TermsContent>;
  try {
    body = (await request.json()) as Partial<TermsContent>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const result = await saveTermsContent({
    title: body.title ?? "",
    lastUpdated: body.lastUpdated?.trim() || formatTermsDate(),
    sections: body.sections ?? [],
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  revalidatePath("/terms");
  return NextResponse.json({ terms: result.terms });
}
