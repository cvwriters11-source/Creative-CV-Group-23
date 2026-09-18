import { cn } from "@/lib/cn";
import type { Job } from "@/lib/jobs";

export function JobLogo({
  job,
  className,
}: {
  job: Pick<Job, "id" | "company" | "logoFileName">;
  className?: string;
}) {
  if (job.logoFileName) {
    return (
      <img
        src={`/api/jobs/${job.id}/logo?v=${encodeURIComponent(job.logoFileName)}`}
        alt={`${job.company} logo`}
        className={cn("h-12 w-12 shrink-0 rounded-xl object-contain bg-white", className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-steel text-sm font-bold text-white",
        className,
      )}
    >
      {job.company.trim().slice(0, 1).toUpperCase() || "C"}
    </span>
  );
}
