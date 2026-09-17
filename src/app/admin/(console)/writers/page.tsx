import { WriterManager } from "@/components/admin/writer-manager";
import { readAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Writers" };

export default async function AdminWritersPage() {
  const store = await readAdminStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Writers</h1>
      <p className="mt-1 text-sm text-slate-500">
        Add or remove CV writers. Dashboard performance uses assigned orders only — new writers start at zero.
      </p>
      <div className="mt-6">
        <WriterManager writers={store.writers} />
      </div>
    </div>
  );
}
