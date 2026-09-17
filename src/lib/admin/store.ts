import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
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
  OrderStatus,
} from "@/lib/admin/types";

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

export async function recordOrder(input: Omit<AdminOrder, "id" | "createdAt">) {
  return mutateAdminStore((store) => {
    const order: AdminOrder = {
      ...input,
      id: crypto.randomUUID(),
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

export async function addWriter(input: { name: string; email: string; phone?: string }) {
  return mutateAdminStore((store) => {
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    if (!name || !email) return { error: "Name and email are required." } as const;
    if (store.writers.some((item) => item.email.toLowerCase() === email)) {
      return { error: "A writer with this email already exists." } as const;
    }
    const writer: AdminWriter = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: input.phone?.trim() ?? "",
      createdAt: new Date().toISOString(),
    };
    store.writers.unshift(writer);
    pushActivity(store, {
      type: "writer",
      title: "Writer added",
      detail: `${writer.name} · ${writer.email}`,
      href: "/admin/writers",
    });
    return { writer } as const;
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
