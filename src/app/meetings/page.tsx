import { MeetingBooking } from "@/components/meetings/meeting-booking";

export const metadata = { title: "Book a Session" };
export const dynamic = "force-dynamic";

export default function MeetingsPage() {
  return (
    <div className="bg-wash">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 py-16 lg:grid-cols-[1fr_0.95fr] lg:px-8">
        <MeetingBooking />
      </div>
    </div>
  );
}
