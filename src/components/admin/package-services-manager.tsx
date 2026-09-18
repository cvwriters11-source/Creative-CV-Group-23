"use client";

import { useMemo, useState } from "react";
import {
  addons,
  defaultPackageTurnaroundMap,
  nextTurnaroundLabel,
  normalizePackageTurnaround,
  packages,
  type PackageMeta,
} from "@/lib/packages";
import { cn, formatZar } from "@/lib/cn";
import type { PackageService } from "@/lib/admin/types";

type Catalog = {
  services: PackageService[];
  map: Record<string, string[]>;
  meta: Record<string, PackageMeta>;
};

function withMeta(catalog: Catalog): Catalog {
  const defaults = defaultPackageTurnaroundMap();
  return {
    ...catalog,
    meta: Object.fromEntries(
      packages.map((pkg) => [pkg.id, normalizePackageTurnaround(catalog.meta?.[pkg.id], defaults[pkg.id])]),
    ),
  };
}

export function PackageServicesManager({ initial }: { initial: Catalog }) {
  const [catalog, setCatalog] = useState(() => withMeta(initial));
  const [saved, setSaved] = useState(() => withMeta(initial));
  const [activeId, setActiveId] = useState(packages[0]?.id ?? "fresh-graduate");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const pkg = packages.find((item) => item.id === activeId) ?? packages[0];
  const meta = pkg ? catalog.meta[pkg.id] : undefined;
  const dirty = useMemo(() => JSON.stringify(catalog) !== JSON.stringify(saved), [catalog, saved]);

  function included(packageId: string, serviceId: string) {
    return (catalog.map[packageId] ?? []).includes(serviceId);
  }

  function includedCount(packageId: string) {
    return catalog.services.filter((service) => included(packageId, service.id)).length;
  }

  function patchMeta(patch: Partial<PackageMeta>) {
    if (!pkg) return;
    setCatalog((current) => {
      const previous = current.meta[pkg.id] ?? defaultPackageTurnaroundMap()[pkg.id];
      const next: PackageMeta = { ...previous, ...patch };
      if (patch.turnaroundDays != null && patch.turnaroundLabel == null) {
        const days = Number(patch.turnaroundDays);
        if (Number.isFinite(days)) {
          next.turnaroundDays = Math.min(90, Math.max(1, Math.round(days)));
          next.turnaroundLabel = nextTurnaroundLabel(next.turnaroundDays, previous.turnaroundLabel, previous.turnaroundDays);
        }
      }
      if (typeof patch.promotion === "string") next.promotion = patch.promotion;
      return {
        ...current,
        meta: {
          ...current.meta,
          [pkg.id]: next,
        },
      };
    });
  }

  function removeFromPackage(serviceId: string) {
    if (!pkg) return;
    setCatalog((current) => ({
      ...current,
      map: {
        ...current.map,
        [pkg.id]: (current.map[pkg.id] ?? []).filter((id) => id !== serviceId),
      },
    }));
    setMessage(`Removed from ${meta?.headerName ?? pkg.headerName}. Save to update the public cards.`);
  }

  function addExistingToPackage(serviceId: string) {
    if (!pkg || !serviceId) return;
    setCatalog((current) => {
      const nextIds = new Set(current.map[pkg.id] ?? []);
      nextIds.add(serviceId);
      return { ...current, map: { ...current.map, [pkg.id]: [...nextIds] } };
    });
    setMessage(`Added to ${meta?.headerName ?? pkg.headerName}. Save to update the public cards.`);
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/package-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", services: catalog.services, map: catalog.map, meta: catalog.meta }),
    });
    const payload = await response.json();
    setSaving(false);
    if (!response.ok) {
      setMessage(payload.error ?? "Could not save.");
      return;
    }
    const next = withMeta(payload);
    setCatalog(next);
    setSaved(next);
    setMessage("Saved. Public package cards now use these details.");
  }

  async function addService(event: React.FormEvent) {
    event.preventDefault();
    if (!pkg) return;
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/package-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", label, packageIds: [pkg.id] }),
    });
    const payload = await response.json();
    setSaving(false);
    if (!response.ok) {
      setMessage(payload.error ?? "Could not add line.");
      return;
    }
    const next = withMeta(payload);
    setCatalog(next);
    setSaved(next);
    setLabel("");
    setMessage(`Line added to ${meta?.headerName ?? pkg.headerName}. Tick it on other packages if they need it too.`);
  }

  if (!pkg || !meta) return null;

  return (
    <div className="grid min-w-0 gap-5">
      <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-200/15 p-3">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Choose a package</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {packages.map((item) => {
              const active = item.id === pkg.id;
              const itemMeta = catalog.meta[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveId(item.id);
                    setMessage("");
                  }}
                  className={cn(
                    "flex min-h-12 min-w-0 flex-col items-start rounded-xl px-3 py-2 text-left transition-colors",
                    active ? "bg-accent text-on-accent shadow-sm" : "bg-white/5 text-slate-200 hover:bg-white/10",
                  )}
                >
                  <span className="w-full truncate text-sm font-semibold">{itemMeta?.headerName ?? item.headerName}</span>
                  <span className={cn("text-[11px]", active ? "text-on-accent/75" : "text-slate-400")}>
                    {includedCount(item.id)} lines · {formatZar(itemMeta?.price ?? item.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          <div className="grid min-w-0 gap-3">
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Package name
              <input
                value={meta.name}
                onChange={(event) => patchMeta({ name: event.target.value })}
                className="field w-full min-w-0 text-sm font-semibold normal-case tracking-normal"
              />
            </label>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Card heading
                <input
                  value={meta.headerName}
                  onChange={(event) => patchMeta({ headerName: event.target.value })}
                  className="field w-full min-w-0 text-sm font-semibold normal-case tracking-normal"
                />
              </label>
              <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Price (ZAR)
                <input
                  type="number"
                  min={1}
                  max={100000}
                  value={meta.price}
                  onChange={(event) => patchMeta({ price: Number(event.target.value) })}
                  className="field w-full min-w-0 text-sm font-semibold normal-case tracking-normal"
                />
              </label>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-[8rem_1fr]">
              <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Working days
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={meta.turnaroundDays}
                  onChange={(event) => patchMeta({ turnaroundDays: Number(event.target.value) })}
                  className="field w-full min-w-0 text-sm font-semibold normal-case tracking-normal"
                />
              </label>
              <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Turnaround on site
                <input
                  value={meta.turnaroundLabel}
                  onChange={(event) => patchMeta({ turnaroundLabel: event.target.value })}
                  className="field w-full min-w-0 text-sm font-semibold normal-case tracking-normal"
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={meta.africaOnly}
                onChange={(event) => patchMeta({ africaOnly: event.target.checked })}
                className="size-4 accent-[#c6a15b]"
              />
              Africa only
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Who it is for
              <textarea
                value={meta.audience}
                onChange={(event) => patchMeta({ audience: event.target.value })}
                rows={3}
                className="field w-full min-w-0 resize-y text-sm font-normal normal-case tracking-normal"
              />
            </label>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Promotion</p>
              <p className="mt-1 text-xs text-slate-400">Leave blank if there is no special. Was price only shows when it is higher than the current price.</p>
              <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Promo label
                  <input
                    value={meta.promotion}
                    onChange={(event) => patchMeta({ promotion: event.target.value })}
                    placeholder="e.g. R 150 off this week"
                    className="field w-full min-w-0 text-sm font-semibold normal-case tracking-normal"
                  />
                </label>
                <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Was price (ZAR)
                  <input
                    type="number"
                    min={0}
                    max={100000}
                    value={meta.compareAtPrice ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      patchMeta({ compareAtPrice: value === "" ? null : Number(value) });
                    }}
                    placeholder="Optional"
                    className="field w-full min-w-0 text-sm font-semibold normal-case tracking-normal"
                  />
                </label>
              </div>
            </div>
          </div>

          <h3 className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Included on this package
          </h3>
          <ul className="mt-2 divide-y divide-slate-200/10 rounded-xl border border-slate-200/15">
            {catalog.services.filter((service) => included(pkg.id, service.id)).length === 0 ? (
              <li className="px-3 py-4 text-sm text-slate-400">No lines on this package yet.</li>
            ) : null}
            {catalog.services
              .filter((service) => included(pkg.id, service.id))
              .map((service) => (
                <li key={service.id} className="flex items-center gap-2 px-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-teal-500 text-[11px] font-bold text-white">
                    ✓
                  </span>
                  <span className="min-w-0 flex-1 py-3 text-sm text-slate-100">
                    {service.label}
                    {service.custom ? (
                      <span className="ml-2 text-[11px] font-normal text-teal-400">custom</span>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromPackage(service.id)}
                    className="shrink-0 rounded-lg bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/25 hover:text-rose-200"
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>

          {catalog.services.some((service) => !included(pkg.id, service.id)) ? (
            <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-[1fr_auto]">
              <select
                className="field w-full min-w-0"
                defaultValue=""
                key={`${pkg.id}-${includedCount(pkg.id)}`}
                onChange={(event) => {
                  const id = event.target.value;
                  if (id) addExistingToPackage(id);
                }}
                aria-label="Add an existing line"
              >
                <option value="">Add an existing line…</option>
                {catalog.services
                  .filter((service) => !included(pkg.id, service.id))
                  .map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.label}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}

          <form onSubmit={addService} className="mt-4 grid min-w-0 gap-2">
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder={`Add a line to ${meta.headerName}`}
              className="field w-full min-w-0"
            />
            <button
              type="submit"
              disabled={saving || !label.trim()}
              className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
            >
              Add line
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving || !dirty}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save packages"}
        </button>
        {dirty ? <p className="text-sm text-amber-300">Unsaved changes</p> : null}
        {message ? <p className="text-sm text-slate-400">{message}</p> : null}
      </div>

      <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="p-4">
          <h2 className="text-base font-semibold text-slate-900">Add-ons</h2>
          <p className="mt-1 text-sm text-slate-400">Optional extras clients can tick on an order.</p>
          <ul className="mt-3 grid gap-2">
            {addons.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-200/15 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100">{item.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{item.description}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-white">{formatZar(item.price)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
