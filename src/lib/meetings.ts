export const meetingTopics = [
  { value: "career-consultation", label: "Career consultation" },
  { value: "cv-review", label: "CV or package discussion" },
  { value: "interview-coaching", label: "Interview coaching" },
  { value: "linkedin", label: "LinkedIn and personal brand" },
  { value: "international", label: "International applications" },
  { value: "other", label: "Something else" },
] as const;

export type MeetingTopic = (typeof meetingTopics)[number]["value"];

export const meetingTopicLabels: Record<MeetingTopic, string> = Object.fromEntries(
  meetingTopics.map((item) => [item.value, item.label]),
) as Record<MeetingTopic, string>;

export function isMeetingTopic(value: string): value is MeetingTopic {
  return meetingTopics.some((item) => item.value === value);
}

export function isTeamsMeetingUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();
    return (
      host === "teams.microsoft.com" ||
      host.endsWith(".teams.microsoft.com") ||
      host === "teams.live.com" ||
      host.endsWith(".teams.live.com") ||
      host === "aka.ms" ||
      (host === "www.microsoft.com" && path.includes("microsoft-teams")) ||
      host.includes("teams")
    );
  } catch {
    return false;
  }
}

export const MEETING_TZ = "Africa/Johannesburg";
export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type MeetingSlot = { date: string; time: string };

type MeetingSlotSource = {
  status: string;
  preferredDate: string;
  preferredTime: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function todayYmd(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: MEETING_TZ }).format(now);
}

export function nowHm(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MEETING_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

export function ymdParts(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return { year, month, day };
}

export function normalizeMeetingTime(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return "";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

export function hourSlotTime(time: string) {
  const normalized = normalizeMeetingTime(time);
  if (!normalized) return "";
  return `${normalized.slice(0, 2)}:00`;
}

export function slotKey(date: string, time: string) {
  return `${date}|${hourSlotTime(time) || normalizeMeetingTime(time)}`;
}

export function weekdayMondayIndex(ymd: string) {
  const { year, month, day } = ymdParts(ymd);
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
  return weekday === 0 ? 6 : weekday - 1;
}

export function slotsForDate(ymd: string) {
  const weekday = weekdayMondayIndex(ymd);
  if (weekday >= 5) return [] as string[];
  const endHour = weekday === 4 ? 13 : 16;
  const slots: string[] = [];
  for (let hour = 8; hour < endHour; hour += 1) {
    slots.push(`${pad(hour)}:00`);
  }
  return slots;
}

export function isSlotPast(date: string, time: string, now = new Date()) {
  const today = todayYmd(now);
  if (date < today) return true;
  if (date > today) return false;
  return normalizeMeetingTime(time) <= nowHm(now);
}

export function isValidMeetingSlot(date: string, time: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const normalized = normalizeMeetingTime(time);
  if (!normalized) return false;
  if (!slotsForDate(date).includes(normalized)) return false;
  return !isSlotPast(date, normalized, now);
}

export function listBookedMeetingSlots(meetings: MeetingSlotSource[]): MeetingSlot[] {
  const seen = new Set<string>();
  const booked: MeetingSlot[] = [];
  for (const meeting of meetings) {
    if (meeting.status !== "approved") continue;
    const date = meeting.preferredDate.trim();
    const time = hourSlotTime(meeting.preferredTime);
    const key = slotKey(date, time);
    if (!date || !time || seen.has(key)) continue;
    seen.add(key);
    booked.push({ date, time });
  }
  return booked;
}

export function bookedSlotKeys(meetings: MeetingSlotSource[]) {
  return new Set(listBookedMeetingSlots(meetings).map((item) => slotKey(item.date, item.time)));
}

export function isMeetingSlotBooked(meetings: MeetingSlotSource[], date: string, time: string) {
  return bookedSlotKeys(meetings).has(slotKey(date, time));
}

export function monthGrid(year: number, month: number) {
  const first = `${year}-${pad(month)}-01`;
  const startPad = weekdayMondayIndex(first);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<string | null> = Array.from({ length: startPad }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${year}-${pad(month)}-${pad(day)}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function shiftYearMonth(year: number, month: number, delta: number) {
  const next = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 };
}

export function formatMonthTitle(year: number, month: number) {
  return new Intl.DateTimeFormat("en-ZA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatMeetingDate(ymd: string) {
  const { year, month, day } = ymdParts(ymd);
  if (!year || !month || !day) return ymd;
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatPreferredSlot(date: string, time: string) {
  const normalizedTime = normalizeMeetingTime(time);
  if (!date && !normalizedTime) return "Not given";
  if (date && normalizedTime) return `${formatMeetingDate(date)} · ${normalizedTime} (SAST)`;
  return `${date || normalizedTime} (SAST)`;
}
