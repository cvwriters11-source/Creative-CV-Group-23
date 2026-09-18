import { cookies } from "next/headers";

export const WRITER_COOKIE = "creative-cv-writer-session";

const WEEK_MS = 60 * 60 * 24 * 7 * 1000;

function getSessionSecret() {
  return `writer:${process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "creative-cv-local-admin-session"}`;
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
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export type WriterSession = { writerId: string; email: string; name: string };

export async function createWriterToken(session: WriterSession) {
  const payload = JSON.stringify({ ...session, exp: Date.now() + WEEK_MS });
  const encoded = btoa(payload);
  return `${encoded}.${await hmacHex(encoded)}`;
}

export async function verifyWriterToken(token: string | undefined | null): Promise<WriterSession | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = await hmacHex(encoded);
  if (!timingSafeEqual(signature, expected)) return null;
  try {
    const payload = JSON.parse(atob(encoded)) as WriterSession & { exp?: number };
    if (!payload.writerId || !payload.email || !payload.exp || payload.exp < Date.now()) return null;
    return { writerId: payload.writerId, email: payload.email, name: payload.name || payload.email };
  } catch {
    return null;
  }
}

export async function getWriterSession() {
  const token = (await cookies()).get(WRITER_COOKIE)?.value;
  return verifyWriterToken(token);
}

export async function setWriterSession(session: WriterSession) {
  const token = await createWriterToken(session);
  (await cookies()).set(WRITER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearWriterSession() {
  (await cookies()).delete(WRITER_COOKIE);
}
