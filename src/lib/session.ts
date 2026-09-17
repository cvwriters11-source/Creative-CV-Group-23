import { cookies } from "next/headers";
import { DEMO_AUTH_COOKIE, type SessionUser } from "@/lib/auth-types";

export async function getSessionUser(): Promise<SessionUser | null> {
  const raw = (await cookies()).get(DEMO_AUTH_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function setSessionUser(user: SessionUser) {
  (await cookies()).set(DEMO_AUTH_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionUser() {
  (await cookies()).delete(DEMO_AUTH_COOKIE);
}
