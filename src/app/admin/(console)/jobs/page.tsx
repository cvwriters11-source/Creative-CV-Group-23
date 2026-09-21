import Link from "next/link";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { AdminJobForm } from "@/components/admin/job-form";
import { JobLogo } from "@/components/jobs/job-logo";
import { formatAdminDay } from "@/lib/admin/format";
import { getMergedJobs } from "@/lib/admin/jobs";

export const metadata = { title: "Jobs" };

export default async function AdminJobsPage() {
  const jobs = await getMergedJobs(true);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Job posts</h1>
      <p className="mt-1 text-sm text-slate-500">
        Seeded board roles plus jobs posted by recruiters or by admin. Posted and published jobs go live on the public jobs board at the same time.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper-deep text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Posted</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-line">
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <JobLogo job={job} className="h-10 w-10" />
                    <div>
                      <p className="font-semibold text-ink">{job.title}</p>
                      <p className="text-ink-soft">
                        {job.company} · {job.location}
                        {job.salaryLabel ? ` · ${job.salaryLabel}` : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 capitalize text-ink-soft">{job.source}</td>
                <td className="px-4 py-4">{job.published ? "Published" : "Unpublished"}</td>
                <td className="px-4 py-4 text-ink-soft">{formatAdminDay(job.postedAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/jobs/${job.id}`} className="content-link text-xs">
                      Edit
                    </Link>
                    <PublishToggle id={job.id} published={job.published} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 font-serif text-2xl">Post a job</h2>
      <AdminJobForm />
    </div>
  );
}
