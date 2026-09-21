import { readAdminStore } from "@/lib/admin/store";
import { loadPublicSite } from "@/lib/admin/public-site";
import type { AdminJob } from "@/lib/admin/types";
import { provinces, seedJobs, type Job } from "@/lib/jobs";

export function normalizeJobType(value: string): Job["type"] {
  const allowed: Job["type"][] = ["Full-time", "Contract", "Part-time", "Internship"];
  return allowed.includes(value as Job["type"]) ? (value as Job["type"]) : "Full-time";
}

export function inferProvince(location: string): string {
  const found = provinces.find((item) => location.toLowerCase().includes(item.toLowerCase()));
  return found ?? "Remote";
}

export function optionalSalaryLabel(value: unknown) {
  return String(value ?? "").trim();
}

export async function getMergedJobs(includeUnpublished = false): Promise<AdminJob[]> {
  const store = await readAdminStore();
  const remote = await loadPublicSite();
  const byId = new Map<string, AdminJob>();
  const unpublished = new Set([
    ...(store.unpublishedJobIds ?? []),
    ...(remote?.unpublishedJobIds ?? []),
  ]);

  for (const job of seedJobs) {
    byId.set(job.id, {
      ...job,
      published: !unpublished.has(job.id),
      source: "seed",
    });
  }

  for (const job of [...(remote?.jobs ?? []), ...store.jobs]) {
    byId.set(job.id, {
      ...job,
      published: unpublished.has(job.id) ? false : job.published,
    });
  }

  const all = [...byId.values()].sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));
  return includeUnpublished ? all : all.filter((job) => job.published);
}

export async function getJobById(id: string, includeUnpublished = false) {
  const jobs = await getMergedJobs(includeUnpublished);
  return jobs.find((job) => job.id === id) ?? null;
}
