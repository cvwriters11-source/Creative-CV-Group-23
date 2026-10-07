import { TeamStorage } from "@/components/team/team-storage";
import { listOrderNumberOptions, readAdminStore } from "@/lib/admin/store";
import { getWriterSession } from "@/lib/writer/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Storage" };

export default async function WriterStoragePage() {
  const session = await getWriterSession();
  if (!session) redirect("/writer/login");
  const store = await readAdminStore();

  return (
    <div>
      <h1 className="font-serif text-3xl text-white">Storage</h1>
      <p className="mt-2 text-sm text-slate-300">
        Upload files under an order number. Search by that number, and keep versions when the same file is saved again.
      </p>
      <div className="mt-6">
        <TeamStorage initialFiles={store.teamFiles ?? []} orders={listOrderNumberOptions(store)} />
      </div>
    </div>
  );
}
