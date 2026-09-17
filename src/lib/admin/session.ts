import { cookies } from "next/headers";

export const ADMIN_COOKIE = "creative-cv-admin-session";

export const DEFAULT_ADMIN_EMAIL = "info@creative-cv.co.za";
export const DEFAULT_ADMIN_PASSWORD = "Gospelman";

const WEEK_MS = 60 * 60 * 24 * 7 * 1000;

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  };
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "creative-cv-local-admin-session";
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacHex(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(signature);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createAdminToken(email: string) {
  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    exp: Date.now() + WEEK_MS,
  });
  const encoded = btoa(payload);
  return `${encoded}.${await hmacHex(encoded)}`;
}

export async function verifyAdminToken(token: string | undefined | null) {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = await hmacHex(encoded);
  if (!timingSafeEqual(signature, expected)) return null;
  try {
    const payload = JSON.parse(atob(encoded)) as { email?: string; exp?: number };
    if (!payload.email || !payload.exp || payload.exp < Date.now()) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

export async function setAdminSession(email: string) {
  const token = await createAdminToken(email);
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export function passwordsMatch(input: string, expected: string) {
  return timingSafeEqual(input, expected) && input.length === expected.length;
}
