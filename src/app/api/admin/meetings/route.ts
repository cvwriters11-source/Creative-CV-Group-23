import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { decideMeeting } from "@/lib/admin/store";
import { isTeamsMeetingUrl } from "@/lib/meetings";
import { emailClientMeetingApproved, emailClientMeetingDeclined } from "@/lib/workflow-emails";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    id?: string;
    action?: "approve" | "decline";
    teamsUrl?: string;
    note?: string;
  };

  if (!body.id || (body.action !== "approve" && body.action !== "decline")) {
    return NextResponse.json({ error: "A meeting id and approve or decline action are required." }, { status: 400 });
  }

  const teamsUrl = body.teamsUrl?.trim() ?? "";
  if (body.action === "approve") {
    if (!teamsUrl || !isTeamsMeetingUrl(teamsUrl)) {
      return NextResponse.json(
        { error: "Paste a valid Microsoft Teams meeting link before approving." },
        { status: 400 },
      );
    }
  }

  const result = await decideMeeting({
    id: body.id,
    status: body.action === "approve" ? "approved" : "declined",
    teamsUrl: body.action === "approve" ? teamsUrl : undefined,
    adminNote: body.note,
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
  }

  const mailed =
    result.meeting.status === "approved"
      ? await emailClientMeetingApproved(result.meeting)
      : await emailClientMeetingDeclined(result.meeting);

  return NextResponse.json({
    ok: true,
    meeting: result.meeting,
    emailed: mailed.sent,
  });
}
