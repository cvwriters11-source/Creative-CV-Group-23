import { formatAdminDate } from "@/lib/admin/format";
import { readAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Recruiters" };

export default async function AdminRecruitersPage() {
  const store = await readAdminStore();
  const recruiters = store.users.filter((user) => user.role === "recruiter");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Recruiters</h1>
      <p className="mt-1 text-sm text-slate-500">Recruiter accounts created through register.</p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Company</th>
              <th className="px-5 py-3 font-semibold">Registered</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-slate-500">
                  No recruiters yet.
                </td>
              </tr>
            ) : (
              recruiters.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-medium text-slate-900">{user.fullName}</td>
                  <td className="px-5 py-4 text-slate-600">{user.email}</td>
                  <td className="px-5 py-4 text-slate-500">{user.company || "—"}</td>
                  <td className="px-5 py-4 text-slate-500">{formatAdminDate(user.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
