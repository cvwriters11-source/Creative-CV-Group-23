import { NextResponse } from "next/server";
import { getJobById, inferProvince, normalizeJobType, optionalSalaryLabel } from "@/lib/admin/jobs";
import { getAdminSession } from "@/lib/admin/session";
import { recordJob, setJobPublished } from "@/lib/admin/store";
import { isImageFile, saveJobLogo } from "@/lib/uploads";

export const runtime = "nodejs";

function parseRequirements(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formFlag(form: FormData, name: string) {
  const value = form.get(name);
  return value === "on" || value === "true" || value === "1";
}

async function storedLogoName(jobId: string, file: File | null, fallback?: string) {
  if (!file || file.size === 0) return fallback ?? "";
  if (!isImageFile(file)) throw new Error("Please upload a PNG, JPG, or WEBP logo.");
  return saveJobLogo(jobId, file);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  try {
    logoFileName = await storedLogoName(id, logo instanceof File ? logo : null);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save the logo." },
      { status: 400 },
    );
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
    featured: formFlag(form, "featured"),
    description,
    requirements: parseRequirements(form.get("requirementsText")),
    published: formFlag(form, "published"),
    source: "admin",
    recruiterEmail: session.email,
  });

  return NextResponse.json({ ok: true, job });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { id?: string; published?: boolean };
    if (!body.id) return NextResponse.json({ error: "Job id is required." }, { status: 400 });
    if (typeof body.published === "boolean") {
      await setJobPublished(body.id, body.published);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  if (!id) return NextResponse.json({ error: "Job id is required." }, { status: 400 });

  const current = await getJobById(id, true);
  if (!current) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  const logo = form.get("logo");
  let logoFileName = current.logoFileName;
  try {
    logoFileName = await storedLogoName(current.id, logo instanceof File ? logo : null, current.logoFileName);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save the logo." },
      { status: 400 },
    );
  }

  const job = await recordJob({
    ...current,
    title: String(form.get("title") || current.title),
    company: String(form.get("company") || current.company),
    location: String(form.get("location") || current.location),
    province: String(form.get("province") || current.province),
    type: normalizeJobType(String(form.get("type") || current.type)),
    industry: String(form.get("industry") || current.industry),
    salaryLabel: optionalSalaryLabel(form.get("salaryLabel")),
    logoFileName: logoFileName || undefined,
    featured: formFlag(form, "featured"),
    description: String(form.get("description") || current.description),
    requirements: parseRequirements(form.get("requirementsText") ?? current.requirements),
    published: formFlag(form, "published"),
    source: current.source === "seed" ? "admin" : current.source,
    recruiterEmail: current.recruiterEmail ?? session.email,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, job });
}
