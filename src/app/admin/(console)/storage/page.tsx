import { TeamStorage } from "@/components/team/team-storage";
import { listOrderNumberOptions, readAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Storage" };

export default async function AdminStoragePage() {
  const store = await readAdminStore();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-semibold text-white">Storage</h1>
      <p className="mt-1 text-sm text-slate-300">
        Upload working files by order number. Search the same way. Re-uploading the same file name keeps every version and who saved it.
      </p>
      <div className="mt-6">
        <TeamStorage initialFiles={store.teamFiles ?? []} orders={listOrderNumberOptions(store)} />
      </div>
    </div>
  );
}
