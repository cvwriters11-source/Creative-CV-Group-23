import { cookies } from "next/headers";
import { DEMO_AUTH_COOKIE, type SessionUser } from "@/lib/auth-types";
import { ButtonLink } from "@/components/ui/primitives";
import { LogoutButton } from "@/components/auth/logout-button";

async function getDemoUser() {
  const raw = (await cookies()).get(DEMO_AUTH_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export default async function SeekerDashboard() {
  const user = await getDemoUser();
  if (!user || user.role !== "job_seeker") {
    return (
      <div className="bg-wash">
        <div className="mx-auto max-w-xl px-5 py-20">
          <p className="kicker">Dashboard</p>
          <h1 className="mt-3 font-serif text-4xl">Job seeker dashboard</h1>
          <div className="brand-rule mt-4" aria-hidden />
          <p className="mt-4 text-ink-soft">Sign in as a job seeker to apply, set alerts, and save a CV.</p>
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
            <p className="kicker">Dashboard</p>
            <h1 className="mt-2 font-serif text-4xl">Hello, {user.fullName}</h1>
            <p className="mt-2 text-ink-soft">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="card-surface p-6">
            <h2 className="font-serif text-2xl">Apply</h2>
            <p className="mt-2 text-sm text-ink-soft">Browse the board and apply with your saved CV.</p>
            <ButtonLink href="/jobs" variant="accent" className="mt-4">
              Find Jobs
            </ButtonLink>
          </article>
          <article className="card-surface p-6">
            <h2 className="font-serif text-2xl">Alerts</h2>
            <p className="mt-2 text-sm text-ink-soft">Get notified when matching jobs are posted.</p>
            <form action="/api/alerts" method="post" className="mt-4 grid gap-2">
              <input name="keywords" placeholder="Keywords" className="field text-sm" />
              <button className="rounded-full bg-accent py-2 text-sm text-on-accent hover:bg-accent-hover">Save alert</button>
            </form>
          </article>
          <article className="card-surface p-6">
            <h2 className="font-serif text-2xl">Saved CV</h2>
            <p className="mt-2 text-sm text-ink-soft">Upload a CV for one-click apply.</p>
            <form action="/api/saved-cv" method="post" encType="multipart/form-data" className="mt-4 grid gap-2">
              <input type="file" name="cv" accept=".pdf,.doc,.docx" className="text-sm" />
              <button className="rounded-full bg-accent py-2 text-sm text-on-accent hover:bg-accent-hover">Save CV</button>
            </form>
          </article>
        </div>
      </div>
    </div>
  );
}
