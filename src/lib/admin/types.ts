import type { Job } from "@/lib/jobs";
import type { PackageTurnaround } from "@/lib/packages";

export type OrderStatus =
  | "received"
  | "pending_payment"
  | "paid"
  | "in_progress"
  | "review"
  | "corrections"
  | "complete";
export type ContactStatus = "new" | "read" | "replied";
export type GeneratorEventType = "pay_attempt" | "draft_complete" | "verify";
export type ActivityType = "order" | "contact" | "application" | "job" | "user" | "generator" | "writer";
export type JobSource = "seed" | "admin" | "recruiter";

export type OrderCorrection = {
  id: string;
  createdAt: string;
  message: string;
  fileName?: string;
  storedFileName?: string;
  source: "admin" | "client";
};

export type AdminOrder = {
  id: string;
  reference: string;
  orderNumber: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  packageId: string;
  packageName: string;
  addonNames: string;
  amount: number;
  status: OrderStatus;
  goals: string;
  cvFileName: string;
  photoFileName?: string;
  extraFileName?: string;
  deliveryFileName?: string;
  paymentConfigured: boolean;
  createdAt: string;
  completedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
  assignedWriterId?: string;
  corrections?: OrderCorrection[];
};

export type AdminWriter = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  createdAt: string;
};

export type PublicWriter = Omit<AdminWriter, "passwordHash"> & { hasPassword: boolean };

export type AdminContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
};

export type AdminApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  fullName: string;
  email: string;
  coverNote: string;
  status: string;
  createdAt: string;
};

export type AdminJob = Job & {
  published: boolean;
  source: JobSource;
  recruiterEmail?: string;
  updatedAt?: string;
};

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: "job_seeker" | "recruiter";
  company?: string;
  createdAt: string;
};

export type GeneratorEvent = {
  id: string;
  type: GeneratorEventType;
  email: string;
  fullName: string;
  reference?: string;
  amount?: number;
  paymentConfigured: boolean;
  paid: boolean;
  headline?: string;
  targetRole?: string;
  createdAt: string;
};

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  href: string;
  createdAt: string;
};

export type PackageService = {
  id: string;
  label: string;
  custom?: boolean;
};

export type AdminStore = {
  orders: AdminOrder[];
  contacts: AdminContact[];
  applications: AdminApplication[];
  jobs: AdminJob[];
  unpublishedJobIds: string[];
  users: AdminUser[];
  writers: AdminWriter[];
  generatorEvents: GeneratorEvent[];
  activity: ActivityItem[];
  packageServices?: PackageService[];
  packageServiceMap?: Record<string, string[]>;
  packageMeta?: Record<string, PackageTurnaround>;
};
