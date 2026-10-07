import { TeamChat } from "@/components/team/team-chat";
import { getAdminSession } from "@/lib/admin/session";
import { readAdminStore } from "@/lib/admin/store";
import { redirect } from "next/navigation";

export const metadata = { title: "Team chat" };

export default async function AdminChatPage() {
  const session = await getAdminSession();
  if (!session) redirect("/auth/login");
  const store = await readAdminStore();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Team chat</h1>
      <p className="mt-1 text-sm text-slate-300">
        Talk with writers and admin in one thread. Writers see the same chat from their workspace.
      </p>
      <div className="mt-6">
        <TeamChat
          initialMessages={store.teamChat ?? []}
          me={{ name: "Admin", email: session.email, role: "admin" }}
        />
      </div>
    </div>
  );
}
