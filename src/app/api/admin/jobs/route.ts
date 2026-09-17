import { NextResponse } from "next/server";
import { getJobById, inferProvince, normalizeJobType } from "@/lib/admin/jobs";
import { getAdminSession } from "@/lib/admin/session";
import { recordJob, setJobPublished } from "@/lib/admin/store";
import type { AdminJob } from "@/lib/admin/types";

export const runtime = "nodejs";

function parseRequirements(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<AdminJob> & { requirementsText?: string };
  if (!body.title || !body.company || !body.location || !body.description) {
    return NextResponse.json({ error: "Title, company, location, and description are required." }, { status: 400 });
  }

  const job = await recordJob({
    id: crypto.randomUUID(),
    title: String(body.title),
    company: String(body.company),
    location: String(body.location),
    province: String(body.province || inferProvince(String(body.location))),
    type: normalizeJobType(String(body.type || "Full-time")),
    industry: String(body.industry || "Human Resources"),
    salaryMin: body.salaryMin ?? null,
    salaryMax: body.salaryMax ?? null,
    salaryLabel: String(body.salaryLabel || "Competitive"),
    postedAt: new Date().toISOString(),
    featured: Boolean(body.featured),
    description: String(body.description),
    requirements: parseRequirements(body.requirementsText ?? body.requirements),
    published: body.published !== false,
    source: "admin",
    recruiterEmail: session.email,
  });

  return NextResponse.json({ ok: true, job });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<AdminJob> & {
    id?: string;
    published?: boolean;
    requirementsText?: string;
  };
  if (!body.id) {
    return NextResponse.json({ error: "Job id is required." }, { status: 400 });
  }

  if (typeof body.published === "boolean" && body.title == null) {
    await setJobPublished(body.id, body.published);
    return NextResponse.json({ ok: true });
  }

  const current = await getJobById(body.id, true);
  if (!current) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  const published = body.published ?? current.published;
  const job = await recordJob({
    ...current,
    title: String(body.title ?? current.title),
    company: String(body.company ?? current.company),
    location: String(body.location ?? current.location),
    province: String(body.province ?? current.province),
    type: normalizeJobType(String(body.type ?? current.type)),
    industry: String(body.industry ?? current.industry),
    salaryMin: body.salaryMin === undefined ? current.salaryMin : body.salaryMin,
    salaryMax: body.salaryMax === undefined ? current.salaryMax : body.salaryMax,
    salaryLabel: String(body.salaryLabel ?? current.salaryLabel),
    featured: body.featured ?? current.featured,
    description: String(body.description ?? current.description),
    requirements: body.requirementsText != null || body.requirements != null
      ? parseRequirements(body.requirementsText ?? body.requirements)
      : current.requirements,
    published,
    source: current.source === "seed" ? "admin" : current.source,
    recruiterEmail: current.recruiterEmail ?? session.email,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, job });
}
