import { NextResponse } from "next/server";
import { inferProvince, normalizeJobType, optionalSalaryLabel } from "@/lib/admin/jobs";
import { recordJob } from "@/lib/admin/store";
import { getSessionUser } from "@/lib/session";
import { isImageFile, saveJobLogo } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "recruiter") {
    return NextResponse.json({ error: "Sign in as a recruiter to post a role." }, { status: 401 });
  }

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const company = String(form.get("company") ?? "").trim();
  const location = String(form.get("location") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  if (!title || !company || !location || !description) {
    return NextResponse.json({ error: "Title, company, location, and description are required." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const logo = form.get("logo");
  let logoFileName = "";
  if (logo instanceof File && logo.size > 0) {
    if (!isImageFile(logo)) {
      return NextResponse.json({ error: "Please upload a PNG, JPG, or WEBP logo." }, { status: 400 });
    }
    logoFileName = await saveJobLogo(id, logo);
  }

  const job = await recordJob({
    id,
    title,
    company,
    location,
    province: String(form.get("province") || inferProvince(location)),
    type: normalizeJobType(String(form.get("type") || "Full-time")),
    industry: String(form.get("industry") || "Human Resources"),
    salaryMin: null,
    salaryMax: null,
    salaryLabel: optionalSalaryLabel(form.get("salaryLabel")),
    logoFileName: logoFileName || undefined,
    postedAt: new Date().toISOString(),
    description,
    requirements: [],
    published: true,
    source: "recruiter",
    recruiterEmail: user.email,
  });

  return NextResponse.json({
    ok: true,
    jobId: job.id,
    message: `“${title}” at ${company} is now live on the jobs board.`,
  });
}
