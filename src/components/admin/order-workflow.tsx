"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminOrder, PublicWriter } from "@/lib/admin/types";
import { formatAdminDate } from "@/lib/admin/format";

export function AdminOrderWorkflow({ order, writers }: { order: AdminOrder; writers: PublicWriter[] }) {
  const router = useRouter();
  const [writerId, setWriterId] = useState(order.assignedWriterId ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const assigned = writers.find((writer) => writer.id === order.assignedWriterId);

  async function assign() {
    if (!writerId) return;
    setBusy("assign");
    setMessage("");
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, assignedWriterId: writerId }),
    });
    const payload = (await response.json()) as { error?: string };
    setBusy("");
    if (!response.ok) {
      setMessage(payload.error ?? "Could not assign writer.");
      return;
    }
    router.refresh();
  }

  async function approve() {
    setBusy("approve");
    setMessage("");
    const response = await fetch(`/api/admin/orders/${order.id}/approve`, { method: "POST" });
    const payload = (await response.json()) as { error?: string };
    setBusy("");
    if (!response.ok) {
      setMessage(payload.error ?? "Could not approve this CV.");
      return;
    }
    router.refresh();
  }

  async function recordCorrection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("correction");
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch(`/api/admin/orders/${order.id}/corrections`, {
      method: "POST",
      body: new FormData(form),
    });
    const payload = (await response.json()) as { error?: string };
    setBusy("");
    if (!response.ok) {
      setMessage(payload.error ?? "Could not record corrections.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <div className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid min-w-56 flex-1 gap-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
          Assign writer
          <select
            className="field py-1.5 text-sm"
            value={writerId}
            onChange={(event) => setWriterId(event.target.value)}
          >
            <option value="">Select a writer</option>
            {writers.map((writer) => (
              <option key={writer.id} value={writer.id}>
                {writer.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={!writerId || busy === "assign"}
          onClick={assign}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-60"
        >
          {busy === "assign" ? "Assigning…" : "Assign"}
        </button>
      </div>
      {assigned ? (
        <p className="text-xs text-slate-300">
          Assigned to {assigned.name}. They only see this order on their writer dashboard.
        </p>
      ) : (
        <p className="text-xs text-slate-400">Not assigned yet.</p>
      )}

      {order.status === "review" || order.status === "corrections" ? (
        <button
          type="button"
          disabled={busy === "approve"}
          onClick={approve}
          className="w-fit rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy === "approve" ? "Sending…" : "Approve and send to client"}
        </button>
      ) : null}

      {(order.corrections?.length ?? 0) > 0 ? (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-200">Corrections</p>
          <ul className="mt-2 grid gap-2">
            {order.corrections?.map((item) => (
              <li key={item.id} className="text-sm text-slate-200">
                <p>{item.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatAdminDate(item.createdAt)} · {item.source === "client" ? "Client" : "Admin"}
                  {item.storedFileName ? (
                    <>
                      {" · "}
                      <a
                        className="font-semibold text-accent hover:underline"
                        href={`/api/admin/orders/${order.id}/files/correction?stored=${encodeURIComponent(item.storedFileName)}`}
                      >
                        {item.fileName || "Attachment"}
                      </a>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form onSubmit={recordCorrection} className="grid gap-2">
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
          Record client corrections
          <textarea required name="message" rows={3} className="field text-sm" placeholder="Paste the client’s correction notes" />
        </label>
        <input name="file" type="file" className="text-xs text-slate-300" />
        <button
          type="submit"
          disabled={busy === "correction"}
          className="w-fit rounded-xl border border-amber-300/40 px-4 py-2 text-sm font-semibold text-amber-100 disabled:opacity-60"
        >
          {busy === "correction" ? "Saving…" : "Save corrections and email writer"}
        </button>
      </form>
      {message ? <p className="text-sm text-amber-200">{message}</p> : null}
    </div>
  );
}
