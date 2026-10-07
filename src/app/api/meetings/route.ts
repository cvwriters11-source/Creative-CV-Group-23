import { NextResponse } from "next/server";
import { readAdminStore, recordMeeting } from "@/lib/admin/store";
import { formatInternationalPhone, isKnownDialCode } from "@/lib/phone-codes";
import {
  isMeetingSlotBooked,
  isMeetingTopic,
  isValidMeetingSlot,
  listBookedMeetingSlots,
  normalizeMeetingTime,
} from "@/lib/meetings";
import { emailAdminNewMeeting } from "@/lib/workflow-emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readAdminStore();
  return NextResponse.json(
    { booked: listBookedMeetingSlots(store.meetings ?? []) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName?: string;
    email?: string;
    countryCode?: string;
    phone?: string;
    topic?: string;
    preferredDate?: string;
    preferredTime?: string;
    notes?: string;
  };

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const countryCode = body.countryCode?.trim() ?? "";
  const nationalPhone = body.phone?.trim() ?? "";
  const topic = body.topic?.trim() ?? "";
  const preferredDate = body.preferredDate?.trim() ?? "";
  const preferredTime = normalizeMeetingTime(body.preferredTime ?? "");
  const notes = body.notes?.trim() ?? "";

  if (!fullName || !email || !nationalPhone || !topic || !preferredDate || !preferredTime) {
    return NextResponse.json({ error: "Please complete your name, email, phone, topic, date, and time." }, { status: 400 });
  }
  if (!isKnownDialCode(countryCode)) {
    return NextResponse.json({ error: "Please choose a valid country code." }, { status: 400 });
  }
  if (!isMeetingTopic(topic)) {
    return NextResponse.json({ error: "Please choose a meeting topic." }, { status: 400 });
  }
  if (!isValidMeetingSlot(preferredDate, preferredTime)) {
    return NextResponse.json({ error: "Please choose an available weekday slot during office hours." }, { status: 400 });
  }

  const store = await readAdminStore();
  if (isMeetingSlotBooked(store.meetings ?? [], preferredDate, preferredTime)) {
    return NextResponse.json({ error: "That date and time is already booked. Please pick another slot." }, { status: 409 });
  }

  const meeting = await recordMeeting({
    fullName,
    email,
    phone: formatInternationalPhone(countryCode, nationalPhone),
    topic,
    preferredDate,
    preferredTime,
    notes,
  });

  const mailed = await emailAdminNewMeeting(meeting);

  return NextResponse.json({
    ok: true,
    message: mailed.sent
      ? "Your Teams meeting request is in. We will email you once admin accepts this date and time."
      : "Your Teams meeting request is in. The slot is reserved as booked only after admin accepts the date and time.",
  });
}
