import { formatAdminDate } from "@/lib/admin/format";
import { readAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Applications" };

export default async function AdminApplicationsPage() {
  const store = await readAdminStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
      <p className="mt-1 text-sm text-slate-500">Applications submitted from the public jobs board.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper-deep text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Applicant</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Cover note</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {store.applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-ink-soft">
                  No applications yet.
                </td>
              </tr>
            ) : (
              store.applications.map((item) => (
                <tr key={item.id} className="border-t border-line align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-ink">{item.fullName}</p>
                    <p className="text-ink-soft">{item.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p>{item.jobTitle}</p>
                    <p className="text-ink-soft">{item.company}</p>
                  </td>
                  <td className="max-w-sm px-4 py-4 text-ink-soft">{item.coverNote || "—"}</td>
                  <td className="px-4 py-4 text-ink-soft">{formatAdminDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
