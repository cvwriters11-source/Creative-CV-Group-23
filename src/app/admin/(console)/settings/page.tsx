import Link from "next/link";
import { getAdminEnvStatus } from "@/lib/admin/env";
import { site } from "@/lib/site";

export const metadata = { title: "Settings" };

function Flag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
      <span>{label}</span>
      <span className={ok ? "font-semibold text-emerald-600" : "text-slate-400"}>{ok ? "Configured" : "Not configured"}</span>
    </li>
  );
}

export default function AdminSettingsPage() {
  const env = getAdminEnvStatus();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Site details, writers, and environment checks.</p>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-semibold text-slate-900">Writers</h2>
        <p className="mt-2 text-sm text-slate-500">
          Admins can add and remove CV writers. New writers show on the dashboard with zero performance until orders are assigned.
        </p>
        <Link
          href="/admin/writers"
          className="mt-4 inline-flex rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500"
        >
          Manage writers
        </Link>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-semibold text-slate-900">Public contact details</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Email</dt>
            <dd>{site.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Phone</dt>
            <dd>{site.phone}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Hours</dt>
            <dd className="text-right">{site.hours}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">WhatsApp</dt>
            <dd>
              <a href={site.whatsappHref} className="content-link" target="_blank" rel="noreferrer">
                +27 74 650 2580
              </a>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Enquiry inbox</dt>
            <dd>{env.contactTo}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-semibold text-slate-900">Integrations</h2>
        <ul className="mt-4 grid gap-2 text-sm">
          <Flag ok={env.paystack} label="Paystack" />
          <Flag ok={env.supabase} label="Supabase" />
          <Flag ok={env.resend} label="Resend email" />
        </ul>
        <p className="mt-4 text-sm text-slate-500">
          Admin login uses <code className="text-teal-700">ADMIN_EMAIL</code> / <code className="text-teal-700">ADMIN_PASSWORD</code>
          ({env.adminEmail}). Client activity is stored in a local JSON file when Supabase is not configured.
        </p>
      </section>
    </div>
  );
}
