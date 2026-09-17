import { StatusSelect } from "@/components/admin/status-select";
import { formatAdminDate } from "@/lib/admin/format";
import { readAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Contacts" };

const statusOptions = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
];

export default async function AdminContactsPage() {
  const store = await readAdminStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Contact messages</h1>
      <p className="mt-1 text-sm text-slate-500">Submissions from the public contact form.</p>

      <ul className="mt-6 grid gap-4">
        {store.contacts.length === 0 ? (
          <li className="card-surface p-6 text-sm text-ink-soft">No messages yet.</li>
        ) : (
          store.contacts.map((contact) => (
            <li key={contact.id} className="card-surface p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-ink">{contact.name}</p>
                  <p className="text-sm text-ink-soft">
                    {contact.email}
                    {contact.phone ? ` · ${contact.phone}` : ""}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{contact.message}</p>
                  <p className="mt-3 text-xs text-ink-soft">{formatAdminDate(contact.createdAt)}</p>
                </div>
                <StatusSelect
                  endpoint="/api/admin/contacts"
                  id={contact.id}
                  value={contact.status}
                  options={statusOptions}
                />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
