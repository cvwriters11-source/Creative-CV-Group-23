"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StatusSelect({
  endpoint,
  id,
  value,
  options,
}: {
  endpoint: string;
  id: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [saving, setSaving] = useState(false);

  async function onChange(next: string) {
    setCurrent(next);
    setSaving(true);
    await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      className="field py-1.5 text-sm"
      value={current}
      disabled={saving}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
