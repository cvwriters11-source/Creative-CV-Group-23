import { MeetingQueue } from "@/components/admin/meeting-queue";
import { readAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Meetings" };

export default async function AdminMeetingsPage() {
  const store = await readAdminStore();
  const meetings = store.meetings ?? [];
  const pending = meetings.filter((item) => item.status === "pending").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Teams meetings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Clients pick a date and time on the public calendar. Approve a request with a Microsoft Teams link to mark that slot booked.
        {pending > 0 ? ` ${pending} waiting for review.` : ""}
      </p>
      <div className="mt-6">
        <MeetingQueue meetings={meetings} />
      </div>
    </div>
  );
}
