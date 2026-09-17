"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(published);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !value;
    setValue(next);
    setSaving(true);
    await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={saving}
      onClick={toggle}
      className="rounded-full border border-accent/40 px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:bg-accent-soft disabled:opacity-60"
    >
      {value ? "Unpublish" : "Publish"}
    </button>
  );
}
