import { NextResponse } from "next/server";
import { getJobById } from "@/lib/admin/jobs";
import { recordApplication } from "@/lib/admin/store";
import { getSessionUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    jobId?: string;
    jobTitle?: string;
    fullName?: string;
    email?: string;
    coverNote?: string;
  };
  if (!body.jobId || !body.fullName || !body.email) {
    return NextResponse.json({ error: "Name, email, and job are required." }, { status: 400 });
  }
  const job = await getJobById(body.jobId);
  if (!job) {
    return NextResponse.json({ error: "That role is no longer listed." }, { status: 404 });
  }
  await recordApplication({
    jobId: job.id,
    jobTitle: body.jobTitle || job.title,
    company: job.company,
    fullName: body.fullName,
    email: body.email,
    coverNote: body.coverNote ?? "",
  });
  const user = await getSessionUser();
  return NextResponse.json({
    ok: true,
    message: user
      ? `Application submitted for ${job.title} at ${job.company}. Track status from your dashboard.`
      : `Application received for ${job.title}. Create a job-seeker account to track it and apply with a saved CV next time.`,
  });
}
