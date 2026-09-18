"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { JobLogo } from "@/components/jobs/job-logo";
import { filterJobs, industries, provinces, seedJobs, type Job } from "@/lib/jobs";
import { PageIntro } from "@/components/ui/primitives";

const types = ["Full-time", "Contract", "Part-time", "Internship"] as const;

export function JobsBoard({ initialJobs }: { initialJobs?: Job[] }) {
  const jobs = initialJobs?.length ? initialJobs : seedJobs;
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const results = useMemo(
    () => filterJobs(jobs, { q, industry, location, type }),
    [jobs, q, industry, location, type],
  );

  return (
    <div className="bg-wash">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <PageIntro
          eyebrow="Find Jobs"
          title="Find Your Dream Job Today"
          lede="Browse job opportunities across South Africa. Create your profile, upload your CV, and apply with a single click. Free for job seekers."
        />

        <form
          className="mt-10 grid gap-3 rounded-3xl border border-accent/20 bg-paper p-4 md:grid-cols-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Role, company, keyword"
            className="field rounded-2xl px-4 py-3 md:col-span-4 lg:col-span-1"
          />
          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="field rounded-2xl px-4 py-3"
          >
            <option value="">All industries</option>
            {industries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="field rounded-2xl px-4 py-3"
          >
            <option value="">All locations</option>
            {provinces.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="field rounded-2xl px-4 py-3"
          >
            <option value="">All types</option>
            {types.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </form>

        <p className="mt-6 text-sm text-ink-soft">
          {results.length} {results.length === 1 ? "role" : "roles"}
        </p>

        <ul className="mt-6 grid gap-4">
          {results.map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="block rounded-3xl border border-line-brand bg-paper px-6 py-6 transition-colors hover:border-accent hover:bg-accent-soft/30"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <JobLogo job={job} />
                    <div className="min-w-0">
                      <p className="kicker">{job.industry}</p>
                      <h2 className="mt-2 font-serif text-2xl">{job.title}</h2>
                      <p className="mt-1 text-ink-soft">
                        {job.company} · {job.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-ink-soft md:text-right">
                    {job.salaryLabel ? <p className="font-medium text-accent">{job.salaryLabel}</p> : null}
                    <p className={job.salaryLabel ? "mt-1" : ""}>{job.type}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
