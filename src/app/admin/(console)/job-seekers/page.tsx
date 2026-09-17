import { formatAdminDate } from "@/lib/admin/format";
import { readAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Job Seekers" };

export default async function AdminJobSeekersPage() {
  const store = await readAdminStore();
  const seekers = store.users.filter((user) => user.role === "job_seeker");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Job Seekers</h1>
      <p className="mt-1 text-sm text-slate-500">Registered job seekers and applications from the public jobs board.</p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Registered</th>
            </tr>
          </thead>
          <tbody>
            {seekers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-slate-500">
                  No job seekers yet.
                </td>
              </tr>
            ) : (
              seekers.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-medium text-slate-900">{user.fullName}</td>
                  <td className="px-5 py-4 text-slate-600">{user.email}</td>
                  <td className="px-5 py-4 text-slate-500">{formatAdminDate(user.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Applications</h2>
      <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-semibold">Applicant</th>
              <th className="px-5 py-3 font-semibold">Role</th>
              <th className="px-5 py-3 font-semibold">Cover note</th>
              <th className="px-5 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {store.applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-slate-500">
                  No applications yet.
                </td>
              </tr>
            ) : (
              store.applications.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 align-top">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{item.fullName}</p>
                    <p className="text-xs text-slate-400">{item.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-700">{item.jobTitle}</p>
                    <p className="text-xs text-slate-400">{item.company}</p>
                  </td>
                  <td className="max-w-sm px-5 py-4 text-slate-500">{item.coverNote || "—"}</td>
                  <td className="px-5 py-4 text-slate-500">{formatAdminDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
