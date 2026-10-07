import { NextResponse } from "next/server";
import { addTeamChatMessage, readAdminStore } from "@/lib/admin/store";
import { getTeamActor } from "@/lib/team";

export const runtime = "nodejs";

export async function GET() {
  const actor = await getTeamActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const store = await readAdminStore();
  return NextResponse.json({ messages: store.teamChat ?? [], me: actor });
}

export async function POST(request: Request) {
  const actor = await getTeamActor();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { body?: string };
  const result = await addTeamChatMessage({
    body: body.body ?? "",
    authorName: actor.name,
    authorEmail: actor.email,
    authorRole: actor.role,
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result);
}
