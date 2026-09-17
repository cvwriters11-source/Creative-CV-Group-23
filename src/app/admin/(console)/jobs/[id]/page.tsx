import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminJobForm } from "@/components/admin/job-form";
import { getJobById } from "@/lib/admin/jobs";

export const metadata = { title: "Edit job" };

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditJobPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobById(id, true);
  if (!job) notFound();

  return (
    <div>
      <p className="text-sm text-slate-500">Jobs</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">Edit role</h1>
      <p className="mt-3">
        <Link href="/admin/jobs" className="content-link text-sm">
          Back to jobs
        </Link>
      </p>
      <AdminJobForm job={job} />
    </div>
  );
}
