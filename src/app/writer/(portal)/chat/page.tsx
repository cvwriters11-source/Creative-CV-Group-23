import { TeamChat } from "@/components/team/team-chat";
import { readAdminStore } from "@/lib/admin/store";
import { getWriterSession } from "@/lib/writer/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Team chat" };

export default async function WriterChatPage() {
  const session = await getWriterSession();
  if (!session) redirect("/writer/login");
  const store = await readAdminStore();

  return (
    <div>
      <h1 className="font-serif text-3xl text-white">Team chat</h1>
      <p className="mt-2 text-sm text-slate-300">Message admin and the other writers here.</p>
      <div className="mt-6">
        <TeamChat
          initialMessages={store.teamChat ?? []}
          me={{ name: session.name, email: session.email, role: "writer" }}
        />
      </div>
    </div>
  );
}
