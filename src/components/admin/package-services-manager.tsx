"use client";

import { useMemo, useState } from "react";
import { packages } from "@/lib/packages";
import type { PackageService } from "@/lib/admin/types";

type Catalog = {
  services: PackageService[];
  map: Record<string, string[]>;
};

const cvPackages = packages.filter((item) => item.category === "core" || item.category === "standalone");

export function PackageServicesManager({ initial }: { initial: Catalog }) {
  const [catalog, setCatalog] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [label, setLabel] = useState("");
  const [newFor, setNewFor] = useState<string[]>(cvPackages.map((item) => item.id));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const dirty = useMemo(() => JSON.stringify(catalog) !== JSON.stringify(saved), [catalog, saved]);

  function included(packageId: string, serviceId: string) {
    return (catalog.map[packageId] ?? []).includes(serviceId);
  }

  function toggle(packageId: string, serviceId: string) {
    setCatalog((current) => {
      const nextIds = new Set(current.map[packageId] ?? []);
      if (nextIds.has(serviceId)) nextIds.delete(serviceId);
      else nextIds.add(serviceId);
      return { ...current, map: { ...current.map, [packageId]: [...nextIds] } };
    });
    setMessage("");
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/package-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", services: catalog.services, map: catalog.map }),
    });
    const payload = await response.json();
    setSaving(false);
    if (!response.ok) {
      setMessage(payload.error ?? "Could not save.");
      return;
    }
    setCatalog(payload);
    setSaved(payload);
    setMessage("Package services updated. Public cards now use this list.");
  }

  async function addService(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/package-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", label, packageIds: newFor }),
    });
    const payload = await response.json();
    setSaving(false);
    if (!response.ok) {
      setMessage(payload.error ?? "Could not add service.");
      return;
    }
    setCatalog(payload);
    setSaved(payload);
    setLabel("");
    setMessage("Service added to the selected packages.");
  }

  async function removeService(id: string) {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/package-services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const payload = await response.json();
    setSaving(false);
    if (!response.ok) {
      setMessage(payload.error ?? "Could not remove service.");
      return;
    }
    setCatalog(payload);
    setSaved(payload);
    setMessage("Custom service removed.");
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={addService} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <h2 className="text-base font-semibold text-slate-900">Add a service</h2>
        <p className="mt-1 text-sm text-slate-500">
          New lines appear on every package card. Tick which packages include it (blue tick). Unticked packages show a
          grey cross.
        </p>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row">
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="e.g. LinkedIn profile rewrite"
            className="field min-w-0 flex-1"
          />
          <button
            type="submit"
            disabled={saving || !label.trim()}
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
          >
            Add service
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {cvPackages.map((pkg) => {
            const on = newFor.includes(pkg.id);
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() =>
                  setNewFor((current) => (on ? current.filter((id) => id !== pkg.id) : [...current, pkg.id]))
                }
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  on ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-400"
                }`}
              >
                {pkg.name}
              </button>
            );
          })}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-semibold">Service</th>
              {cvPackages.map((pkg) => (
                <th key={pkg.id} className="px-3 py-3 text-center font-semibold">
                  {pkg.headerName}
                </th>
              ))}
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {catalog.services.map((service) => (
              <tr key={service.id} className="border-t border-slate-100">
                <td className="px-5 py-3 font-medium text-slate-900">
                  {service.label}
                  {service.custom ? <span className="ml-2 text-xs font-normal text-teal-600">custom</span> : null}
                </td>
                {cvPackages.map((pkg) => (
                  <td key={pkg.id} className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={included(pkg.id, service.id)}
                      onChange={() => toggle(pkg.id, service.id)}
                      className="h-4 w-4 accent-teal-600"
                      aria-label={`${service.label} for ${pkg.name}`}
                    />
                  </td>
                ))}
                <td className="px-3 py-3 text-right">
                  {service.custom ? (
                    <button
                      type="button"
                      onClick={() => void removeService(service.id)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving || !dirty}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save package services"}
        </button>
        {message ? <p className="text-sm text-slate-500">{message}</p> : null}
      </div>
    </div>
  );
}
