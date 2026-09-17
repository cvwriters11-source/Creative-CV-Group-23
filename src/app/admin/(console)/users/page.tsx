import { formatAdminDate } from "@/lib/admin/format";
import { readAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const store = await readAdminStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
      <p className="mt-1 text-sm text-slate-500">Accounts created through register. Passwords are never stored in the admin log.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper-deep text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Registered</th>
            </tr>
          </thead>
          <tbody>
            {store.users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-ink-soft">
                  No registered users yet.
                </td>
              </tr>
            ) : (
              store.users.map((user) => (
                <tr key={user.id} className="border-t border-line">
                  <td className="px-4 py-4 font-semibold text-ink">{user.fullName}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4 capitalize">{user.role.replace("_", " ")}</td>
                  <td className="px-4 py-4 text-ink-soft">{user.company || "—"}</td>
                  <td className="px-4 py-4 text-ink-soft">{formatAdminDate(user.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
