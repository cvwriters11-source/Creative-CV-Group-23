import { NextResponse } from "next/server";
import { inferProvince, normalizeJobType } from "@/lib/admin/jobs";
import { recordJob } from "@/lib/admin/store";
import { getSessionUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "recruiter") {
    return NextResponse.json({ error: "Sign in as a recruiter to post a role." }, { status: 401 });
  }
  const body = (await request.json()) as {
    title?: string;
    company?: string;
    location?: string;
    industry?: string;
    type?: string;
    salaryLabel?: string;
    description?: string;
  };
  if (!body.title || !body.company || !body.location || !body.description) {
    return NextResponse.json({ error: "Title, company, location, and description are required." }, { status: 400 });
  }

  const job = await recordJob({
    id: crypto.randomUUID(),
    title: body.title,
    company: body.company,
    location: body.location,
    province: inferProvince(body.location),
    type: normalizeJobType(body.type || "Full-time"),
    industry: body.industry || "Human Resources",
    salaryMin: null,
    salaryMax: null,
    salaryLabel: body.salaryLabel || "Competitive",
    postedAt: new Date().toISOString(),
    description: body.description,
    requirements: [],
    published: true,
    source: "recruiter",
    recruiterEmail: user.email,
  });

  return NextResponse.json({
    ok: true,
    jobId: job.id,
    message: `“${body.title}” at ${body.company} is now live on the jobs board.`,
  });
}
