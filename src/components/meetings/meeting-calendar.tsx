"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  WEEKDAY_LABELS,
  formatMeetingDate,
  formatMonthTitle,
  isSlotPast,
  monthGrid,
  shiftYearMonth,
  slotKey,
  slotsForDate,
  todayYmd,
  ymdParts,
  type MeetingSlot,
} from "@/lib/meetings";
import { BrandLogo } from "@/components/layout/brand-logo";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

type Props = {
  booked: MeetingSlot[];
  selected: MeetingSlot | null;
  onSelect: (slot: MeetingSlot | null) => void;
};

export function MeetingCalendar({ booked, selected, onSelect }: Props) {
  const today = todayYmd();
  const todayParts = ymdParts(today);
  const bookedKeys = useMemo(() => new Set(booked.map((item) => slotKey(item.date, item.time))), [booked]);
  const bookedDates = useMemo(() => new Set(booked.map((item) => item.date)), [booked]);
  const [view, setView] = useState(() => ({ year: todayParts.year, month: todayParts.month }));
  const [activeDate, setActiveDate] = useState(selected?.date ?? "");

  const viewingDate = selected?.date || activeDate;
  const cells = useMemo(() => monthGrid(view.year, view.month), [view.month, view.year]);
  const times = viewingDate ? slotsForDate(viewingDate) : [];
  const canGoPrev = view.year > todayParts.year || (view.year === todayParts.year && view.month > todayParts.month);

  function chooseDate(ymd: string) {
    const slots = slotsForDate(ymd);
    if (ymd < today || slots.length === 0) return;
    setActiveDate(ymd);
    if (selected && selected.date !== ymd) onSelect(null);
  }

  function chooseTime(time: string) {
    if (!viewingDate) return;
    if (bookedKeys.has(slotKey(viewingDate, time)) || isSlotPast(viewingDate, time)) return;
    onSelect({ date: viewingDate, time });
  }

  return (
    <div className="card-surface relative mt-10 overflow-hidden bg-paper p-5 md:p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <BrandLogo
          alt=""
          className="absolute left-1/2 top-[58%] h-[min(22rem,80%)] w-[min(22rem,86%)] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black_28%,transparent_70%)]"
        />
        <div className="absolute inset-0 bg-[rgba(8,17,26,0.82)]" />
      </div>
      <div className="relative z-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-ink">Booking calendar</h2>
        <p className="text-xs uppercase tracking-[0.14em] text-gold">SAST</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink">
        Choose a date, then a 1-hour slot. Booked times stay closed after admin accepts them. Hours: {site.hoursShort}.
      </p>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => setView((current) => shiftYearMonth(current.year, current.month, -1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper/80 text-ink hover:border-gold disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="rounded-full bg-[#050b18] px-4 py-1 font-serif text-lg text-ink">{formatMonthTitle(view.year, view.month)}</p>
        <button
          type="button"
          onClick={() => setView((current) => shiftYearMonth(current.year, current.month, 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper/80 text-ink hover:border-gold"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div aria-label="Meeting dates" className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="pb-1 text-center text-[11px] font-semibold uppercase tracking-wider text-ink">
            {label}
          </div>
        ))}
        {cells.map((ymd, index) => {
          if (!ymd) {
            return <div key={`empty-${index}`} className="h-10" />;
          }
          const slots = slotsForDate(ymd);
          const closed = slots.length === 0;
          const past = ymd < today;
          const disabled = closed || past;
          const isToday = ymd === today;
          const isSelected = ymd === viewingDate;
          const hasBooked = bookedDates.has(ymd);
          return (
            <button
              key={ymd}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`${formatMeetingDate(ymd)}${hasBooked ? ", has booked times" : ""}${closed ? ", closed" : ""}`}
              onClick={() => chooseDate(ymd)}
              className={cn(
                "relative flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                disabled && "cursor-not-allowed bg-[#08111a] text-ink/45",
                !disabled && !isSelected && "bg-[#0d1722] text-ink hover:bg-brand",
                isSelected && "bg-gold font-semibold text-on-accent",
                isToday && !isSelected && "ring-1 ring-gold/80",
              )}
            >
              {Number(ymd.slice(8))}
              {hasBooked ? (
                <span className={cn("absolute bottom-1 h-1 w-1 rounded-full", isSelected ? "bg-on-accent" : "bg-gold")} />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {viewingDate ? (
          <>
            <p className="text-sm font-medium text-ink">{formatMeetingDate(viewingDate)}</p>
            {times.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">Closed on weekends. Please pick a weekday.</p>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {times.map((time) => {
                  const bookedSlot = bookedKeys.has(slotKey(viewingDate, time));
                  const past = isSlotPast(viewingDate, time);
                  const active = selected?.date === viewingDate && selected.time === time;
                  const disabled = bookedSlot || past;
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={disabled}
                      aria-pressed={active}
                      onClick={() => chooseTime(time)}
                      className={cn(
                        "rounded-xl border bg-paper/80 px-2 py-2 text-sm font-medium text-ink transition-colors",
                        active && "border-gold bg-gold font-semibold text-on-accent",
                        !disabled && !active && "border-line hover:border-gold",
                        bookedSlot && "cursor-not-allowed border-line/70 bg-paper-deep text-ink-soft line-through",
                        past && !bookedSlot && "cursor-not-allowed border-line/50 text-ink/40",
                      )}
                    >
                      {bookedSlot ? (
                        <span className="block">
                          {time}
                          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.12em] no-underline">
                            Booked
                          </span>
                        </span>
                      ) : (
                        time
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-ink">Select a date to see available times.</p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-xs text-ink">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Available
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-soft/50" /> Booked
        </span>
      </div>
      </div>
    </div>
  );
}
