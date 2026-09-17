import type { AdminOrder, AdminStore, AdminWriter } from "@/lib/admin/types";

const TZ = "Africa/Johannesburg";

const paidStatuses = new Set(["paid", "in_progress", "complete"]);

export function isPaidOrder(order: AdminOrder) {
  return paidStatuses.has(order.status);
}

export function formatOpsZar(amount: number) {
  return `R ${Number(amount || 0).toFixed(2)}`;
}

function zaParts(value: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(value);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const weekday = get("weekday");
  const mondayOffset: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekdayOffset: mondayOffset[weekday] ?? 0,
  };
}

function utcDay(year: number, month: number, day: number) {
  return Date.UTC(year, month - 1, day);
}

function isToday(order: AdminOrder, now: Date) {
  const orderDate = zaParts(new Date(order.createdAt));
  const today = zaParts(now);
  return orderDate.year === today.year && orderDate.month === today.month && orderDate.day === today.day;
}

function isThisWeek(order: AdminOrder, now: Date) {
  const orderDate = zaParts(new Date(order.createdAt));
  const today = zaParts(now);
  const todayUtc = utcDay(today.year, today.month, today.day);
  const mondayUtc = todayUtc - today.weekdayOffset * 86400000;
  const orderUtc = utcDay(orderDate.year, orderDate.month, orderDate.day);
  return orderUtc >= mondayUtc && orderUtc <= todayUtc;
}

function isThisMonth(order: AdminOrder, now: Date) {
  const orderDate = zaParts(new Date(order.createdAt));
  const today = zaParts(now);
  return orderDate.year === today.year && orderDate.month === today.month;
}

function sumPaid(orders: AdminOrder[]) {
  return orders.filter(isPaidOrder).reduce((total, order) => total + (Number(order.amount) || 0), 0);
}

function turnaroundDays(order: AdminOrder) {
  if (!order.completedAt) return null;
  const start = new Date(order.createdAt).getTime();
  const end = new Date(order.completedAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  return (end - start) / 86400000;
}

export type WriterPerformanceRow = {
  id: string;
  name: string;
  email: string;
  activeOrders: number;
  completed: number;
  avgTurnaroundDays: number;
  totalRevenue: number;
};

export function getWriterPerformance(store: AdminStore): WriterPerformanceRow[] {
  return store.writers.map((writer: AdminWriter) => {
    const assigned = store.orders.filter((order) => order.assignedWriterId === writer.id);
    const completedOrders = assigned.filter((order) => order.status === "complete");
    const turnarounds = completedOrders.map(turnaroundDays).filter((value): value is number => value != null);
    return {
      id: writer.id,
      name: writer.name,
      email: writer.email,
      activeOrders: assigned.filter((order) => order.status !== "complete").length,
      completed: completedOrders.length,
      avgTurnaroundDays: turnarounds.length
        ? turnarounds.reduce((total, value) => total + value, 0) / turnarounds.length
        : 0,
      totalRevenue: sumPaid(assigned),
    };
  });
}

export function getDashboardMetrics(store: AdminStore) {
  const now = new Date();
  const paid = store.orders.filter(isPaidOrder);
  const uniqueCustomers = new Set(
    store.orders.map((order) => order.email.trim().toLowerCase()).filter(Boolean),
  );

  return {
    revenueToday: sumPaid(paid.filter((order) => isToday(order, now))),
    revenueWeek: sumPaid(paid.filter((order) => isThisWeek(order, now))),
    revenueMonth: sumPaid(paid.filter((order) => isThisMonth(order, now))),
    revenueAll: sumPaid(paid),
    totalOrders: store.orders.length,
    pendingOrders: store.orders.filter(
      (order) => order.status === "received" || order.status === "pending_payment",
    ).length,
    completedOrders: store.orders.filter((order) => order.status === "complete").length,
    totalCustomers: uniqueCustomers.size,
    writers: getWriterPerformance(store),
  };
}
