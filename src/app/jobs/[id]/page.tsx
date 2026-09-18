import { notFound } from "next/navigation";
import { getJobById } from "@/lib/admin/jobs";
import { ApplyForm } from "@/components/jobs/apply-form";
import { JobLogo } from "@/components/jobs/job-logo";
import { ButtonLink } from "@/components/ui/primitives";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  return (
    <div className="bg-gold-soft/60">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <article>
          <p className="kicker">{job.industry}</p>
          <div className="mt-3 flex items-start gap-4">
            <JobLogo job={job} className="mt-1 h-14 w-14" />
            <div>
              <h1 className="font-serif text-4xl tracking-tight md:text-5xl">{job.title}</h1>
              <div className="brand-rule mt-4" aria-hidden />
              <p className="mt-4 text-lg text-ink-soft">
                {job.company} · {job.location} · {job.type}
              </p>
              {job.salaryLabel ? <p className="mt-2 font-medium text-accent">{job.salaryLabel}</p> : null}
            </div>
          </div>
          <p className="mt-8 leading-relaxed text-ink-soft">{job.description}</p>
          <h2 className="heading-accent mt-10 font-serif text-2xl">Requirements</h2>
          <ul className="mt-4 space-y-2 text-ink-soft">
            {job.requirements.map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>
        </article>
        <aside className="card-surface h-fit p-6">
          <h2 className="font-serif text-2xl">Apply</h2>
          <p className="mt-2 text-sm text-ink-soft">
            One-click apply with your saved CV once you are signed in as a job seeker.
          </p>
          <ApplyForm jobId={job.id} jobTitle={job.title} />
          <ButtonLink href="/auth/register/job-seeker" variant="ghost" className="mt-4 w-full">
            Create a free job-seeker profile
          </ButtonLink>
        </aside>
      </div>
    </div>
  );
}
