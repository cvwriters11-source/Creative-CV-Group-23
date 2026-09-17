import { cookies } from "next/headers";
import { DEMO_AUTH_COOKIE, type SessionUser } from "@/lib/auth-types";
import { ButtonLink } from "@/components/ui/primitives";
import { LogoutButton } from "@/components/auth/logout-button";
import { PostJobForm } from "@/components/jobs/post-job-form";

async function getDemoUser() {
  const raw = (await cookies()).get(DEMO_AUTH_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export default async function RecruiterDashboard() {
  const user = await getDemoUser();
  if (!user || user.role !== "recruiter") {
    return (
      <div className="bg-wash">
        <div className="mx-auto max-w-xl px-5 py-20">
          <p className="kicker">Recruiter</p>
          <h1 className="mt-3 font-serif text-4xl">Recruiter dashboard</h1>
          <div className="brand-rule mt-4" aria-hidden />
          <p className="mt-4 text-ink-soft">Sign in as a recruiter to post jobs and review applications.</p>
          <ButtonLink href="/auth/login" variant="accent" className="mt-6">
            Sign In
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gold-soft/50">
      <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker">Recruiter</p>
            <h1 className="mt-2 font-serif text-4xl">{user.company ?? user.fullName}</h1>
            <p className="mt-2 text-ink-soft">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
        <PostJobForm defaultCompany={user.company} />
      </div>
    </div>
  );
}
