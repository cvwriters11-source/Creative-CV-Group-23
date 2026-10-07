"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { AdminMeeting } from "@/lib/admin/types";
import { formatAdminDate } from "@/lib/admin/format";
import { bookedSlotKeys, formatPreferredSlot, meetingTopicLabels, slotKey, type MeetingTopic } from "@/lib/meetings";

const filters = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Booked" },
  { value: "declined", label: "Declined" },
  { value: "all", label: "All" },
] as const;

function topicLabel(topic: string) {
  return meetingTopicLabels[topic as MeetingTopic] ?? topic;
}

function statusClass(status: AdminMeeting["status"]) {
  if (status === "approved") return "bg-emerald-100 text-emerald-800";
  if (status === "declined") return "bg-rose-100 text-rose-800";
  return "bg-amber-100 text-amber-800";
}

export function MeetingQueue({ meetings }: { meetings: AdminMeeting[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("pending");
  const [drafts, setDrafts] = useState<Record<string, { teamsUrl: string; note: string }>>({});
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  const visible = useMemo(
    () => meetings.filter((item) => filter === "all" || item.status === filter),
    [filter, meetings],
  );
  const bookedKeys = useMemo(() => bookedSlotKeys(meetings), [meetings]);

  function draft(id: string) {
    return drafts[id] ?? { teamsUrl: "", note: "" };
  }

  function patchDraft(id: string, patch: Partial<{ teamsUrl: string; note: string }>) {
    setDrafts((current) => ({ ...current, [id]: { ...draft(id), ...patch } }));
  }

  async function decide(id: string, action: "approve" | "decline") {
    const values = draft(id);
    setBusyId(id);
    setMessage("");
    const response = await fetch("/api/admin/meetings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        action,
        teamsUrl: values.teamsUrl,
        note: values.note,
      }),
    });
    const payload = (await response.json()) as { error?: string; emailed?: boolean };
    setBusyId("");
    if (!response.ok) {
      setMessage(payload.error ?? "Could not update this request.");
      return;
    }
    setMessage(
      action === "approve"
        ? payload.emailed
          ? "Approved. The client was emailed the Teams link."
          : "Approved. Email is not configured here — send the Teams link by WhatsApp or email."
        : payload.emailed
          ? "Declined. The client was emailed."
          : "Declined. Email is not configured here — tell the client by WhatsApp or email.",
    );
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={
              filter === item.value
                ? "rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                : "rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
            }
          >
            {item.label}
            {item.value !== "all"
              ? ` · ${meetings.filter((meeting) => meeting.status === item.value).length}`
              : ` · ${meetings.length}`}
          </button>
        ))}
      </div>
      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}

      <ul className="mt-6 grid gap-4">
        {visible.length === 0 ? (
          <li className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            No {filter === "all" ? "" : `${filter === "approved" ? "booked" : filter} `}meeting requests yet.
          </li>
        ) : (
          visible.map((meeting) => {
            const slotTaken = bookedKeys.has(slotKey(meeting.preferredDate, meeting.preferredTime));
            return (
            <li key={meeting.id} className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{meeting.fullName}</p>
                  <p className="text-sm text-slate-500">
                    {meeting.email}
                    {meeting.phone ? ` · ${meeting.phone}` : ""}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusClass(meeting.status)}`}>
                  {meeting.status === "approved" ? "booked" : meeting.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-700">{topicLabel(meeting.topic)}</p>
              <p className="mt-1 text-sm text-slate-500">
                Preferred: {formatPreferredSlot(meeting.preferredDate, meeting.preferredTime)}
              </p>
              {meeting.status === "pending" && slotTaken ? (
                <p className="mt-2 text-sm text-rose-700">
                  This date and time is already booked. Decline this request or ask the client to pick another slot.
                </p>
              ) : null}
              {meeting.notes ? <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{meeting.notes}</p> : null}
              <p className="mt-3 text-xs text-slate-400">Requested {formatAdminDate(meeting.createdAt)}</p>

              {meeting.status === "approved" && meeting.teamsUrl ? (
                <p className="mt-3 break-all text-sm">
                  <a href={meeting.teamsUrl} className="text-teal-700 hover:underline" target="_blank" rel="noreferrer">
                    {meeting.teamsUrl}
                  </a>
                </p>
              ) : null}
              {meeting.adminNote ? <p className="mt-2 text-sm text-slate-500">Admin note: {meeting.adminNote}</p> : null}

              {meeting.status === "pending" ? (
                <div className="mt-4 grid gap-3">
                  <label className="grid gap-1 text-sm text-slate-600">
                    Microsoft Teams link
                    <input
                      value={draft(meeting.id).teamsUrl}
                      onChange={(event) => patchDraft(meeting.id, { teamsUrl: event.target.value })}
                      placeholder="https://teams.microsoft.com/l/meetup-join/..."
                      className="field"
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-slate-600">
                    Note to the client (optional)
                    <textarea
                      value={draft(meeting.id).note}
                      onChange={(event) => patchDraft(meeting.id, { note: event.target.value })}
                      rows={2}
                      className="field"
                      placeholder="Confirmed time, or a reason if you decline"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === meeting.id || slotTaken}
                      onClick={() => decide(meeting.id, "approve")}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {busyId === meeting.id ? "Saving…" : "Approve"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === meeting.id}
                      onClick={() => decide(meeting.id, "decline")}
                      className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ) : null}
            </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
