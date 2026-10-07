"use client";

import { useCallback, useEffect, useState } from "react";
import { MeetingCalendar } from "@/components/meetings/meeting-calendar";
import { MeetingForm } from "@/components/meetings/meeting-form";
import { PageIntro } from "@/components/ui/primitives";
import { site } from "@/lib/site";
import { slotKey, type MeetingSlot } from "@/lib/meetings";

export function MeetingBooking() {
  const [booked, setBooked] = useState<MeetingSlot[]>([]);
  const [selected, setSelected] = useState<MeetingSlot | null>(null);

  const loadBooked = useCallback(async () => {
    const response = await fetch("/api/meetings", { cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as { booked?: MeetingSlot[] };
    const next = payload.booked ?? [];
    setBooked(next);
    setSelected((current) => {
      if (!current) return current;
      const taken = next.some((item) => slotKey(item.date, item.time) === slotKey(current.date, current.time));
      return taken ? null : current;
    });
  }, []);

  useEffect(() => {
    void loadBooked();
    const timer = window.setInterval(() => {
      void loadBooked();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [loadBooked]);

  return (
    <>
      <div>
        <PageIntro
          eyebrow="Microsoft Teams"
          title="Book a meeting with Creative CV"
          lede="Pick a date and time on the calendar. Admin reviews every request. Once the date and time are accepted, that slot is marked booked and you receive the join link."
        />
        <MeetingCalendar booked={booked} selected={selected} onSelect={setSelected} />
        <p className="mt-8 text-sm text-ink-soft">
          Need something sooner? Call{" "}
          <a className="content-link" href={site.phoneHref}>
            {site.phone}
          </a>{" "}
          or email{" "}
          <a className="content-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </div>
      <MeetingForm
        selected={selected}
        onSubmitted={() => {
          setSelected(null);
          void loadBooked();
        }}
      />
    </>
  );
}
