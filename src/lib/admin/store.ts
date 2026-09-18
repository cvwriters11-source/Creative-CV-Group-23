import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  defaultPackageServiceMap,
  defaultPackageServices,
  defaultPackageTurnaroundMap,
  normalizePackageTurnaround,
  packages,
  type PackageTurnaround,
} from "@/lib/packages";
import type {
  ActivityItem,
  AdminApplication,
  AdminContact,
  AdminJob,
  AdminOrder,
  AdminStore,
  AdminUser,
  AdminWriter,
  ContactStatus,
  GeneratorEvent,
  OrderCorrection,
  OrderStatus,
  PackageService,
  PublicWriter,
} from "@/lib/admin/types";
import { hashPassword } from "@/lib/passwords";

const emptyStore = (): AdminStore => ({
  orders: [],
  contacts: [],
  applications: [],
  jobs: [],
  unpublishedJobIds: [],
  users: [],
  writers: [],
  generatorEvents: [],
  activity: [],
});

let writeChain: Promise<unknown> = Promise.resolve();
let resolvedPath: string | null = null;

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function primaryPath() {
  return path.join(process.cwd(), ".data", "admin-store.json");
}

function fallbackPath() {
  return path.join(os.tmpdir(), "creative-cv-admin-store.json");
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolvePath() {
  if (resolvedPath) return resolvedPath;
  if (await fileExists(primaryPath())) {
    resolvedPath = primaryPath();
    return resolvedPath;
  }
  if (await fileExists(fallbackPath())) {
    resolvedPath = fallbackPath();
    return resolvedPath;
  }
  return primaryPath();
}

async function readFromDisk(): Promise<AdminStore> {
  const filePath = await resolvePath();
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<AdminStore>;
    return {
      ...emptyStore(),
      ...parsed,
      orders: parsed.orders ?? [],
      contacts: parsed.contacts ?? [],
      applications: parsed.applications ?? [],
      jobs: parsed.jobs ?? [],
      unpublishedJobIds: parsed.unpublishedJobIds ?? [],
      users: parsed.users ?? [],
      writers: parsed.writers ?? [],
      generatorEvents: parsed.generatorEvents ?? [],
      activity: parsed.activity ?? [],
      packageServices: parsed.packageServices,
      packageServiceMap: parsed.packageServiceMap,
      packageMeta: parsed.packageMeta,
    };
  } catch {
    return emptyStore();
  }
}

async function writeToDisk(store: AdminStore) {
  const preferred = resolvedPath ?? primaryPath();
  const payload = `${JSON.stringify(store, null, 2)}\n`;
  try {
    await fs.mkdir(path.dirname(preferred), { recursive: true });
    await fs.writeFile(preferred, payload, "utf8");
    resolvedPath = preferred;
  } catch {
    const fallback = fallbackPath();
    await fs.mkdir(path.dirname(fallback), { recursive: true });
    await fs.writeFile(fallback, payload, "utf8");
    resolvedPath = fallback;
  }
}

export async function readAdminStore() {
  return enqueue(() => readFromDisk());
}

export async function getAdminOrder(id: string) {
  const store = await readAdminStore();
  return store.orders.find((order) => order.id === id) ?? null;
}

export function toPublicWriter(writer: AdminWriter): PublicWriter {
  return {
    id: writer.id,
    name: writer.name,
    email: writer.email,
    phone: writer.phone,
    createdAt: writer.createdAt,
    hasPassword: Boolean(writer.passwordHash),
  };
}

export async function getWriterByEmail(email: string) {
  const store = await readAdminStore();
  const needle = email.trim().toLowerCase();
  return store.writers.find((writer) => writer.email.toLowerCase() === needle) ?? null;
}

export async function getWriterById(id: string) {
  const store = await readAdminStore();
  return store.writers.find((writer) => writer.id === id) ?? null;
}

export async function getWriterOrders(writerId: string) {
  const store = await readAdminStore();
  return store.orders.filter((order) => order.assignedWriterId === writerId);
}

export async function findOrderByNumberAndEmail(orderNumber: string, email: string) {
  const store = await readAdminStore();
  const number = orderNumber.trim().toLowerCase();
  const needle = email.trim().toLowerCase();
  return (
    store.orders.find(
      (order) => order.orderNumber.trim().toLowerCase() === number && order.email.trim().toLowerCase() === needle,
    ) ?? null
  );
}

export async function mutateAdminStore<T>(fn: (store: AdminStore) => T | Promise<T>): Promise<T> {
  return enqueue(async () => {
    const store = await readFromDisk();
    const result = await fn(store);
    await writeToDisk(store);
    return result;
  });
}

export function pushActivity(store: AdminStore, item: Omit<ActivityItem, "id" | "createdAt">) {
  store.activity.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...item,
  });
  store.activity = store.activity.slice(0, 80);
}

export function nextRevampOrderNumber(orders: AdminOrder[]) {
  let highest = 0;
  for (const order of orders) {
    const match = /^Revamp(\d+)$/i.exec(order.orderNumber ?? "");
    if (match) highest = Math.max(highest, Number(match[1]));
  }
  return `Revamp${String(highest + 1).padStart(3, "0")}`;
}

export async function recordOrder(input: Omit<AdminOrder, "id" | "createdAt" | "orderNumber">) {
  return mutateAdminStore((store) => {
    const order: AdminOrder = {
      ...input,
      id: crypto.randomUUID(),
      orderNumber: nextRevampOrderNumber(store.orders),
      createdAt: new Date().toISOString(),
    };
    store.orders.unshift(order);
    pushActivity(store, {
      type: "order",
      title: "New package order",
      detail: `${order.fullName} · ${order.packageName} · R${order.amount}`,
      href: "/admin/orders",
    });
    return order;
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return mutateAdminStore((store) => {
    const order = store.orders.find((item) => item.id === id);
    if (!order) return null;
    order.status = status;
    if (status === "complete") {
      order.completedAt = order.completedAt ?? new Date().toISOString();
    } else {
      delete order.completedAt;
    }
    return order;
  });
}

export async function assignWriter(orderId: string, writerId: string) {
  return mutateAdminStore((store) => {
    const order = store.orders.find((item) => item.id === orderId);
    if (!order) return { error: "Order not found." } as const;
    const writer = store.writers.find((item) => item.id === writerId);
    if (!writer) return { error: "Writer not found." } as const;
    order.assignedWriterId = writer.id;
    if (order.status === "received" || order.status === "pending_payment" || order.status === "paid") {
      order.status = "in_progress";
    }
    pushActivity(store, {
      type: "writer",
      title: "Order assigned to writer",
      detail: `${order.orderNumber} → ${writer.name}`,
      href: "/admin/orders",
    });
    return { order, writer } as const;
  });
}

export async function submitOrderForReview(orderId: string, writerId: string, deliveryFileName: string) {
  return mutateAdminStore((store) => {
    const order = store.orders.find((item) => item.id === orderId);
    if (!order) return { error: "Order not found." } as const;
    if (order.assignedWriterId !== writerId) {
      return { error: "This order is not assigned to you." } as const;
    }
    if (!["in_progress", "review", "corrections"].includes(order.status)) {
      return { error: "This order cannot be submitted for review yet." } as const;
    }
    order.deliveryFileName = deliveryFileName;
    order.status = "review";
    order.reviewedAt = new Date().toISOString();
    delete order.completedAt;
    pushActivity(store, {
      type: "order",
      title: "CV submitted for review",
      detail: `${order.orderNumber} · ${order.fullName}`,
      href: "/admin/orders",
    });
    return { order } as const;
  });
}

export async function approveOrder(orderId: string) {
  return mutateAdminStore((store) => {
    const order = store.orders.find((item) => item.id === orderId);
    if (!order) return { error: "Order not found." } as const;
    if (!order.deliveryFileName) return { error: "The writer has not uploaded a CV yet." } as const;
    if (order.status !== "review" && order.status !== "corrections") {
      return { error: "Only orders in review or corrections can be approved." } as const;
    }
    const now = new Date().toISOString();
    order.status = "complete";
    order.approvedAt = now;
    order.completedAt = now;
    pushActivity(store, {
      type: "order",
      title: "CV approved and sent to client",
      detail: `${order.orderNumber} · ${order.fullName}`,
      href: "/admin/orders",
    });
    return { order } as const;
  });
}

export async function addOrderCorrection(input: {
  orderId?: string;
  orderNumber?: string;
  email?: string;
  message: string;
  fileName?: string;
  storedFileName?: string;
  source: OrderCorrection["source"];
}) {
  const message = input.message.trim();
  if (!message) return { error: "Correction notes are required." } as const;

  return mutateAdminStore((store) => {
    const email = input.email?.trim().toLowerCase();
    const order = store.orders.find((item) => {
      if (input.orderId && item.id === input.orderId) return true;
      if (input.orderNumber && item.orderNumber.trim().toLowerCase() === input.orderNumber.trim().toLowerCase()) {
        return !email || item.email.trim().toLowerCase() === email;
      }
      return false;
    });
    if (!order) return { error: "Order not found." } as const;
    if (email && order.email.trim().toLowerCase() !== email) {
      return { error: "Order number and email do not match." } as const;
    }
    const correction: OrderCorrection = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      message,
      fileName: input.fileName,
      storedFileName: input.storedFileName,
      source: input.source,
    };
    order.corrections = [correction, ...(order.corrections ?? [])];
    order.status = "corrections";
    delete order.completedAt;
    const writer = store.writers.find((item) => item.id === order.assignedWriterId);
    pushActivity(store, {
      type: "order",
      title: "Client corrections received",
      detail: `${order.orderNumber} · ${order.fullName}`,
      href: "/admin/orders",
    });
    return { order, correction, writer } as const;
  });
}

export async function recordContact(input: { name: string; email: string; phone?: string; message: string }) {
  return mutateAdminStore((store) => {
    const contact: AdminContact = {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      message: input.message,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    store.contacts.unshift(contact);
    pushActivity(store, {
      type: "contact",
      title: "New contact message",
      detail: `${contact.name} · ${contact.email}`,
      href: "/admin/contacts",
    });
    return contact;
  });
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  return mutateAdminStore((store) => {
    const contact = store.contacts.find((item) => item.id === id);
    if (!contact) return null;
    contact.status = status;
    return contact;
  });
}

export async function recordApplication(input: Omit<AdminApplication, "id" | "createdAt" | "status"> & { status?: string }) {
  return mutateAdminStore((store) => {
    const application: AdminApplication = {
      ...input,
      id: crypto.randomUUID(),
      status: input.status ?? "submitted",
      createdAt: new Date().toISOString(),
    };
    store.applications.unshift(application);
    pushActivity(store, {
      type: "application",
      title: "New job application",
      detail: `${application.fullName} → ${application.jobTitle}`,
      href: "/admin/applications",
    });
    return application;
  });
}

export async function recordJob(input: AdminJob) {
  return mutateAdminStore((store) => {
    const existing = store.jobs.findIndex((item) => item.id === input.id);
    const job: AdminJob = {
      ...input,
      updatedAt: new Date().toISOString(),
    };
    if (existing >= 0) store.jobs[existing] = job;
    else store.jobs.unshift(job);

    if (job.published) {
      store.unpublishedJobIds = store.unpublishedJobIds.filter((id) => id !== job.id);
    } else if (!store.unpublishedJobIds.includes(job.id)) {
      store.unpublishedJobIds.push(job.id);
    }

    pushActivity(store, {
      type: "job",
      title: existing >= 0 ? "Job updated" : "New job posted",
      detail: `${job.title} at ${job.company}`,
      href: "/admin/jobs",
    });
    return job;
  });
}

export async function setJobPublished(id: string, published: boolean) {
  return mutateAdminStore((store) => {
    const job = store.jobs.find((item) => item.id === id);
    if (job) job.published = published;
    if (published) {
      store.unpublishedJobIds = store.unpublishedJobIds.filter((item) => item !== id);
    } else if (!store.unpublishedJobIds.includes(id)) {
      store.unpublishedJobIds.push(id);
    }
    return { id, published };
  });
}

export async function recordUser(input: Omit<AdminUser, "id" | "createdAt"> & { id?: string }) {
  return mutateAdminStore((store) => {
    const email = input.email.trim().toLowerCase();
    const existing = store.users.find((item) => item.email.toLowerCase() === email);
    if (existing) {
      existing.fullName = input.fullName;
      existing.role = input.role;
      existing.company = input.company;
      return existing;
    }
    const user: AdminUser = {
      id: input.id ?? crypto.randomUUID(),
      email,
      fullName: input.fullName,
      role: input.role,
      company: input.company,
      createdAt: new Date().toISOString(),
    };
    store.users.unshift(user);
    pushActivity(store, {
      type: "user",
      title: "New account registered",
      detail: `${user.fullName} · ${user.role === "recruiter" ? "Recruiter" : "Job seeker"}`,
      href: "/admin/users",
    });
    return user;
  });
}

export async function addWriter(input: { name: string; email: string; phone?: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();
  if (!name || !email) return { error: "Name and email are required." } as const;
  if (password.length < 6) return { error: "Password must be at least 6 characters." } as const;
  const passwordHash = await hashPassword(password);
  return mutateAdminStore((store) => {
    if (store.writers.some((item) => item.email.toLowerCase() === email)) {
      return { error: "A writer with this email already exists." } as const;
    }
    const writer: AdminWriter = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: input.phone?.trim() ?? "",
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    store.writers.unshift(writer);
    pushActivity(store, {
      type: "writer",
      title: "Writer added",
      detail: `${writer.name} · ${writer.email}`,
      href: "/admin/writers",
    });
    return { writer: toPublicWriter(writer) } as const;
  });
}

export async function setWriterPassword(id: string, password: string) {
  const next = password.trim();
  if (next.length < 6) return { error: "Password must be at least 6 characters." } as const;
  const passwordHash = await hashPassword(next);
  return mutateAdminStore((store) => {
    const writer = store.writers.find((item) => item.id === id);
    if (!writer) return { error: "Writer not found." } as const;
    writer.passwordHash = passwordHash;
    return { writer: toPublicWriter(writer) } as const;
  });
}

export async function removeWriter(id: string) {
  return mutateAdminStore((store) => {
    const index = store.writers.findIndex((item) => item.id === id);
    if (index < 0) return { error: "Writer not found." } as const;
    const [writer] = store.writers.splice(index, 1);
    if (!writer) return { error: "Writer not found." } as const;
    for (const order of store.orders) {
      if (order.assignedWriterId === id) delete order.assignedWriterId;
    }
    pushActivity(store, {
      type: "writer",
      title: "Writer removed",
      detail: `${writer.name} · ${writer.email}`,
      href: "/admin/writers",
    });
    return { writer } as const;
  });
}

export async function recordGeneratorEvent(input: Omit<GeneratorEvent, "id" | "createdAt">) {
  return mutateAdminStore((store) => {
    const event: GeneratorEvent = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    store.generatorEvents.unshift(event);
    const title =
      event.type === "pay_attempt"
        ? "Generator checkout attempt"
        : event.type === "verify"
          ? "Generator payment verify"
          : "Generator draft completed";
    pushActivity(store, {
      type: "generator",
      title,
      detail: `${event.fullName || event.email}${event.reference ? ` · ${event.reference}` : ""}`,
      href: "/admin/generator",
    });
    return event;
  });
}

function resolvedPackageMeta(saved: Record<string, PackageTurnaround> | undefined) {
  const defaults = defaultPackageTurnaroundMap();
  return Object.fromEntries(
    packages.map((pkg) => [pkg.id, normalizePackageTurnaround(saved?.[pkg.id], defaults[pkg.id])]),
  );
}

export async function getPackageServiceCatalog() {
  const store = await readAdminStore();
  const defaults = defaultPackageServices();
  const saved = store.packageServices ?? [];
  const custom = saved.filter((item) => item.custom || !defaults.some((feature) => feature.id === item.id));
  const services = [...defaults, ...custom.filter((item) => item.custom)];
  const map = { ...defaultPackageServiceMap(), ...(store.packageServiceMap ?? {}) };
  for (const pkg of packages) {
    if (!map[pkg.id]) map[pkg.id] = [...pkg.features];
  }
  return { services, map, meta: resolvedPackageMeta(store.packageMeta) };
}

export async function savePackageServiceCatalog(input: {
  services: PackageService[];
  map: Record<string, string[]>;
  meta?: Record<string, PackageTurnaround>;
}) {
  return mutateAdminStore((store) => {
    store.packageServices = input.services;
    store.packageServiceMap = input.map;
    if (input.meta) store.packageMeta = resolvedPackageMeta(input.meta);
    return { services: store.packageServices, map: store.packageServiceMap, meta: resolvedPackageMeta(store.packageMeta) };
  });
}
