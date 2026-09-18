"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatAdminDate } from "@/lib/admin/format";
import type { PublicWriter } from "@/lib/admin/types";

export function WriterManager({ writers }: { writers: PublicWriter[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [passwordId, setPasswordId] = useState("");

  async function onAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/admin/writers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        password: data.get("password"),
      }),
    });
    const payload = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) {
      setMessage(payload.error ?? "Could not add writer.");
      return;
    }
    form.reset();
    setMessage("Writer added. They sign in at /writer/login — they cannot open the admin dashboard.");
    router.refresh();
  }

  async function onSetPassword(event: React.FormEvent<HTMLFormElement>, writer: PublicWriter) {
    event.preventDefault();
    setPasswordId(writer.id);
    setMessage("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/writers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: writer.id, password: data.get("password") }),
    });
    const payload = (await response.json()) as { error?: string };
    setPasswordId("");
    if (!response.ok) {
      setMessage(payload.error ?? "Could not update password.");
      return;
    }
    event.currentTarget.reset();
    setMessage(`Password updated for ${writer.name}.`);
    router.refresh();
  }

  async function onRemove(writer: PublicWriter) {
    if (!confirm(`Remove ${writer.name}? They will be unassigned from any orders.`)) return;
    setRemovingId(writer.id);
    setMessage("");
    const response = await fetch("/api/admin/writers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: writer.id }),
    });
    const payload = (await response.json()) as { error?: string };
    setRemovingId("");
    if (!response.ok) {
      setMessage(payload.error ?? "Could not remove writer.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onAdd} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <h2 className="text-base font-semibold text-slate-900">Add a writer</h2>
        <p className="mt-1 text-sm text-slate-500">
          Writers sign in at <span className="font-semibold text-slate-700">/writer/login</span>. They only see assigned
          orders — never the admin dashboard.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-600">
            Name
            <input required name="name" className="field" placeholder="Writer name" />
          </label>
          <label className="grid gap-1 text-sm text-slate-600">
            Email
            <input required type="email" name="email" className="field" placeholder="writer@example.com" />
          </label>
          <label className="grid gap-1 text-sm text-slate-600">
            Phone <span className="font-normal text-slate-400">(optional)</span>
            <input name="phone" className="field" placeholder="Phone number" />
          </label>
          <label className="grid gap-1 text-sm text-slate-600">
            Password
            <input required type="password" name="password" minLength={6} className="field" placeholder="At least 6 characters" />
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
        >
          {saving ? "Adding…" : "Add writer"}
        </button>
        {message ? <p className="mt-3 text-sm text-slate-500">{message}</p> : null}
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Writer</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Added</th>
                <th className="px-5 py-3 font-semibold">Login</th>
                <th className="px-5 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {writers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-slate-500">
                    No writers yet.
                  </td>
                </tr>
              ) : (
                writers.map((writer) => (
                  <tr key={writer.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{writer.name}</p>
                      <p className="text-xs text-slate-400">{writer.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{writer.phone || "—"}</td>
                    <td className="px-5 py-4 text-slate-500">{formatAdminDate(writer.createdAt)}</td>
                    <td className="px-5 py-4">
                      <form onSubmit={(event) => onSetPassword(event, writer)} className="flex flex-wrap items-center gap-2">
                        <input
                          required
                          type="password"
                          name="password"
                          minLength={6}
                          placeholder={writer.hasPassword ? "Reset password" : "Set password"}
                          className="field py-1.5 text-sm"
                        />
                        <button
                          type="submit"
                          disabled={passwordId === writer.id}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {passwordId === writer.id ? "Saving…" : writer.hasPassword ? "Reset" : "Set"}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={removingId === writer.id}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                        onClick={() => onRemove(writer)}
                      >
                        {removingId === writer.id ? "Removing…" : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
