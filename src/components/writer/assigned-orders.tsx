"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatAdminDate, orderStatusLabels } from "@/lib/admin/format";
import type { AdminOrder } from "@/lib/admin/types";

function FileLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-xs font-semibold text-accent hover:underline">
      {label}
    </a>
  );
}

function WriterOrderCard({ order }: { order: AdminOrder }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const canSubmit = order.status === "in_progress" || order.status === "review" || order.status === "corrections";
  const statusLabel = orderStatusLabels[order.status] ?? order.status;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch(`/api/writer/orders/${order.id}/review`, {
      method: "POST",
      body: data,
    });
    const payload = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) {
      setMessage(payload.error ?? "Could not submit for review.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{order.orderNumber}</p>
          <h2 className="mt-1 text-lg font-semibold text-white">{order.fullName}</h2>
          <p className="text-sm text-slate-300">{order.packageName}</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {order.status === "complete" ? "Complete" : statusLabel}
        </span>
      </div>

      {order.goals ? <p className="mt-3 text-sm text-slate-300">Brief: {order.goals}</p> : null}

      <div className="mt-4 flex flex-wrap gap-3">
        {order.cvFileName ? (
          <FileLink href={`/api/writer/orders/${order.id}/files/cv`} label={`Client CV · ${order.cvFileName}`} />
        ) : null}
        {order.photoFileName ? (
          <FileLink href={`/api/writer/orders/${order.id}/files/photo`} label={`Photo · ${order.photoFileName}`} />
        ) : null}
        {order.extraFileName ? (
          <FileLink href={`/api/writer/orders/${order.id}/files/extra`} label={`Extra · ${order.extraFileName}`} />
        ) : null}
        {order.deliveryFileName ? (
          <FileLink
            href={`/api/writer/orders/${order.id}/files/delivery`}
            label={`Your upload · ${order.deliveryFileName}`}
          />
        ) : null}
      </div>

      {(order.corrections?.length ?? 0) > 0 ? (
        <div className="mt-4 rounded-xl bg-amber-500/10 p-3">
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
                        href={`/api/writer/orders/${order.id}/files/correction?stored=${encodeURIComponent(item.storedFileName)}`}
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

      {canSubmit ? (
        <form onSubmit={onSubmit} className="mt-5 grid gap-3">
          <label className="grid gap-1 text-sm text-slate-300">
            Upload completed CV
            <input required name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf" className="text-sm" />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? "Sending…" : "Upload CV and mark for review"}
          </button>
          <p className="text-xs text-slate-400">This sends the file to admin for approval at the same time.</p>
          {message ? <p className="text-sm text-amber-200">{message}</p> : null}
        </form>
      ) : order.status === "complete" ? (
        <p className="mt-4 text-sm font-semibold text-emerald-300">Complete — admin approved this CV and sent it to the client.</p>
      ) : (
        <p className="mt-4 text-sm text-slate-400">Waiting for admin to open this assignment.</p>
      )}
    </article>
  );
}

export function WriterAssignedOrders({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return <p className="text-sm text-slate-400">No work has been assigned to you yet.</p>;
  }

  return (
    <div className="grid gap-5">
      {orders.map((order) => (
        <WriterOrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
