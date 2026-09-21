import { getMergedJobs } from "@/lib/admin/jobs";
import { JobsBoard } from "@/components/jobs/jobs-board";
import type { Job } from "@/lib/jobs";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function JobsPage() {
  const jobsById = new Map((await getMergedJobs()).map((job) => [job.id, job as Job]));
  const supabase = await createServerSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("jobs")
      .select("id,title,company,location,province,type,industry,salary_min,salary_max,salary_label,posted_at,featured,description,requirements")
      .order("posted_at", { ascending: false });
    for (const row of data ?? []) {
      jobsById.set(row.id, {
        id: row.id,
        title: row.title,
        company: row.company,
        location: row.location,
        province: row.province ?? "Remote",
        type: row.type as Job["type"],
        industry: row.industry,
        salaryMin: row.salary_min,
        salaryMax: row.salary_max,
        salaryLabel: row.salary_label ?? "",
        postedAt: row.posted_at,
        featured: row.featured,
        description: row.description,
        requirements: row.requirements ?? [],
      });
    }
  }

  return <JobsBoard initialJobs={[...jobsById.values()]} />;
}
