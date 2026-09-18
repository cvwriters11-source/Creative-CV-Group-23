import { WriterManager } from "@/components/admin/writer-manager";
import { readAdminStore, toPublicWriter } from "@/lib/admin/store";

export const metadata = { title: "Writers" };

export default async function AdminWritersPage() {
  const store = await readAdminStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Writers</h1>
      <p className="mt-1 text-sm text-slate-500">
        Add writers with a login password. They use /writer/login and only see assigned orders — never this admin dashboard.
      </p>
      <div className="mt-6">
        <WriterManager writers={store.writers.map(toPublicWriter)} />
      </div>
    </div>
  );
}
