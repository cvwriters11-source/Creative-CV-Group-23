"use client";

import { useMemo, useState } from "react";
import { formatAdminDate } from "@/lib/admin/format";
import type { TeamFileGroup } from "@/lib/admin/types";

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function TeamStorage({
  initialFiles,
  orders,
}: {
  initialFiles: TeamFileGroup[];
  orders: Array<{ id: string; orderNumber: string; fullName: string }>;
}) {
  const [files, setFiles] = useState(initialFiles);
  const [query, setQuery] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return files;
    return files.filter(
      (group) =>
        group.orderNumber.toLowerCase().includes(needle) ||
        group.label.toLowerCase().includes(needle) ||
        group.versions.some((item) => item.uploadedByName.toLowerCase().includes(needle)),
    );
  }, [files, query]);

  async function onUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/team/files", { method: "POST", body: data });
    const payload = (await response.json()) as {
      error?: string;
      warning?: string;
      group?: TeamFileGroup;
      groups?: TeamFileGroup[];
    };
    setBusy(false);
    if (!response.ok) {
      setMessage(payload.error ?? "Could not upload that file.");
      return;
    }
    const uploaded = payload.groups?.length ? payload.groups : payload.group ? [payload.group] : [];
    if (uploaded.length) {
      setFiles((current) => {
        let next = current;
        for (const group of uploaded) {
          next = [group, ...next.filter((item) => item.id !== group.id)];
        }
        return next;
      });
    }
    form.reset();
    setOrderNumber("");
    const count = uploaded.length || 1;
    setMessage(
      payload.warning ??
        (count === 1
          ? "Saved. Same file name on this order number becomes the next version."
          : `Saved ${count} files. Same file name on this order number becomes the next version.`),
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <form onSubmit={onUpload} className="h-fit rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-accent">Upload files</h2>
        <p className="mt-1 text-sm text-slate-400">
          Add up to three files for this order number. Upload the same name again to keep a new version.
        </p>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400" htmlFor="team-order-number">
          Order number
        </label>
        <input
          id="team-order-number"
          name="orderNumber"
          list="team-order-numbers"
          required
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          placeholder="Revamp010"
          className="mt-1 w-full rounded-xl border border-white/15 bg-[#07111a] px-3 py-2.5 text-sm text-white outline-none ring-accent/40 placeholder:text-slate-500 focus:ring-2"
        />
        <datalist id="team-order-numbers">
          {orders.map((order) => (
            <option key={order.id} value={order.orderNumber}>
              {order.fullName}
            </option>
          ))}
        </datalist>
        {(["File 1", "File 2", "File 3"] as const).map((label, index) => (
          <div key={label}>
            <label
              className="mt-4 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"
              htmlFor={`team-file-${index + 1}`}
            >
              {label}
            </label>
            <input
              id={`team-file-${index + 1}`}
              name="file"
              type="file"
              required={index === 0}
              className="mt-1 w-full rounded-lg border border-white/15 px-2 py-1.5 text-sm text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-[0.12em] file:text-on-accent"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.12em] text-on-accent disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
        {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
      </form>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400" htmlFor="team-file-search">
          Search by order number
        </label>
        <input
          id="team-file-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Revamp010"
          className="mt-1 w-full rounded-xl border border-white/15 bg-[#07111a] px-3 py-2.5 text-sm text-white outline-none ring-accent/40 placeholder:text-slate-500 focus:ring-2"
        />

        {visible.length === 0 ? (
          <p className="mt-8 text-sm text-slate-400">
            {query ? "No files match that order number." : "No team files yet."}
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {visible.map((group) => {
              const latest = group.versions.at(-1);
              return (
                <li key={group.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">{group.orderNumber}</p>
                      <p className="mt-1 font-semibold text-white">{group.label}</p>
                      {latest ? (
                        <p className="mt-1 text-xs text-slate-400">
                          Latest v{latest.version} · {group.versions.length === 1 ? "1 version" : `${group.versions.length} versions`}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <ol className="mt-4 space-y-2 border-t border-white/10 pt-3">
                    {[...group.versions].reverse().map((item) => (
                      <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <p className="text-slate-200">
                          <span className="font-semibold text-white">v{item.version}</span>
                          <span className="text-slate-400">
                            {" "}
                            · {item.uploadedByName} ({item.uploadedByRole}) · {formatAdminDate(item.createdAt)} ·{" "}
                            {formatBytes(item.size)}
                          </span>
                        </p>
                        <a
                          href={`/api/team/files/${item.id}`}
                          className="text-xs font-semibold text-accent hover:underline"
                        >
                          Download
                        </a>
                      </li>
                    ))}
                  </ol>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
