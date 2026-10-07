import { getAdminSession } from "@/lib/admin/session";
import type { TeamRole } from "@/lib/admin/types";
import { getWriterSession } from "@/lib/writer/session";

export type TeamActor = {
  name: string;
  email: string;
  role: TeamRole;
};

export async function getTeamActor(): Promise<TeamActor | null> {
  const admin = await getAdminSession();
  if (admin) {
    return { name: "Admin", email: admin.email, role: "admin" };
  }
  const writer = await getWriterSession();
  if (writer) {
    return { name: writer.name, email: writer.email, role: "writer" };
  }
  return null;
}
