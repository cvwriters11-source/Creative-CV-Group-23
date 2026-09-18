import { StatusSelect } from "@/components/admin/status-select";
import { AdminOrderWorkflow } from "@/components/admin/order-workflow";
import { formatAdminDate } from "@/lib/admin/format";
import type { AdminOrder, PublicWriter } from "@/lib/admin/types";
import { formatZar } from "@/lib/cn";
import type { OrderUploadKind } from "@/lib/uploads";

const ribbonTones: Record<string, string> = {
  gold: "#c6a15b",
  navy: "#1b365d",
  charcoal: "#10161f",
  ink: "#1b365d",
  steel: "#254675",
};

const statusOptions = [
  { value: "received", label: "Received" },
  { value: "pending_payment", label: "Pending payment" },
  { value: "paid", label: "Paid" },
  { value: "in_progress", label: "Assigned" },
  { value: "review", label: "In review" },
  { value: "corrections", label: "Corrections" },
  { value: "complete", label: "Complete" },
];

function fileVersion(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
    return { label: "Picture", detail: ext === "jpg" || ext === "jpeg" ? "JPEG" : ext.toUpperCase() };
  }
  if (ext === "pdf") return { label: "PDF", detail: "Document" };
  if (ext === "doc") return { label: "Word", detail: "DOC" };
  if (ext === "docx") return { label: "Word", detail: "DOCX" };
  return { label: "File", detail: ext.toUpperCase() || "File" };
}

function extraItems(addonNames: string) {
  if (!addonNames || addonNames.trim().toLowerCase() === "none") return [];
  return addonNames
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function IncludedMark() {
  return (
    <span className="plan-pricing-check mt-0.5" aria-hidden>
      <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
        <path d="M2.5 6.2 5 8.7 9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function FileChip({
  orderId,
  kind,
  fileName,
}: {
  orderId: string;
  kind: OrderUploadKind;
  fileName?: string;
}) {
  if (!fileName) return null;
  const href = `/api/admin/orders/${orderId}/files/${kind}`;
  const version = fileVersion(fileName);
  const badge =
    version.label === "Picture"
      ? "bg-cyan-400/20 text-cyan-200"
      : version.label === "PDF"
        ? "bg-rose-400/20 text-rose-200"
        : version.label === "Word"
          ? "bg-accent/20 text-accent"
          : "bg-white/10 text-slate-200";
  return (
    <li className="flex w-full min-w-0 items-center gap-2 rounded-full border border-accent/25 bg-white/5 px-3 py-1.5 sm:w-auto">
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${badge}`}>
        {version.label}
      </span>
      <span className="min-w-0 truncate text-xs font-medium text-slate-100" title={fileName}>
        {fileName}
      </span>
      <a href={href} target="_blank" rel="noreferrer" className="shrink-0 text-xs font-semibold text-accent hover:text-white hover:underline">
        Open
      </a>
      <a href={`${href}?download=1`} className="shrink-0 text-xs font-semibold text-accent hover:text-white hover:underline">
        Download
      </a>
    </li>
  );
}

export function AdminOrderPlanCard({
  order,
  tabLabel,
  tone,
  included,
  writers,
}: {
  order: AdminOrder;
  tabLabel: string;
  tone?: string;
  included: string[];
  writers: PublicWriter[];
}) {
  const extras = extraItems(order.addonNames);
  const history = [...included, ...extras.map((item) => `${item} (extra)`)];

  return (
    <article className="plan-pricing-card admin-order-card" style={{ ["--plan-tab" as string]: ribbonTones[tone ?? ""] ?? ribbonTones.gold }}>
      <p className="plan-pricing-tab">{tabLabel}</p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0 sm:w-40 sm:shrink-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent/80">Order total</p>
          <p className="mt-1 font-sans text-[2rem] font-extrabold leading-none tracking-tight text-white">
            {formatZar(order.amount)}
          </p>
          <p className="mt-3 truncate text-sm font-semibold text-white">{order.fullName}</p>
          <p className="text-xs font-semibold text-accent">{order.orderNumber ?? `Ref ${order.reference}`}</p>
          <p className="mt-1 break-all text-xs text-slate-300">{order.email}</p>
          <p className="text-xs text-slate-300">{order.phone}</p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-accent/80">Order history</p>
          <ul className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {history.length > 0 ? (
              history.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-2 text-[13px] leading-snug text-slate-200">
                  <IncludedMark />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400">No package details saved.</li>
            )}
          </ul>
        </div>

        <div className="w-full shrink-0 sm:w-auto sm:self-center">
          <StatusSelect
            endpoint="/api/admin/orders"
            id={order.id}
            value={order.status}
            options={statusOptions}
            className="admin-order-status"
          />
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        <FileChip orderId={order.id} kind="photo" fileName={order.photoFileName} />
        <FileChip orderId={order.id} kind="cv" fileName={order.cvFileName} />
        <FileChip orderId={order.id} kind="extra" fileName={order.extraFileName} />
        <FileChip orderId={order.id} kind="delivery" fileName={order.deliveryFileName} />
      </ul>

      <AdminOrderWorkflow order={order} writers={writers} />

      <p className="mt-3 text-xs text-slate-400">
        Received {formatAdminDate(order.createdAt)}
        {order.completedAt ? ` · Completed ${formatAdminDate(order.completedAt)}` : ""}
        {!order.paymentConfigured ? " · Paystack not configured — no charge taken." : ""}
      </p>
      {order.goals ? <p className="mt-1 text-xs text-slate-400">Notes: {order.goals}</p> : null}
    </article>
  );
}
