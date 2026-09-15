export type UserRole = "job_seeker" | "recruiter";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  company?: string;
};

export const DEMO_AUTH_COOKIE = "creative-cv-demo-session";
