import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

/**
 * Stateless, HMAC-signed session cookie for /admin/blast — no session table,
 * no extra dependency. The cookie carries "username.expiresAt.signature";
 * ADMIN_SESSION_SECRET (server-only) signs it, so a client can't forge or
 * extend one. httpOnly means it's never reachable from page JavaScript.
 */

export const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours
export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionCookieValue(username: string): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `${encodeURIComponent(username)}.${expiresAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionCookieValue(value: string | undefined | null): { username: string } | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !value) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [encodedUsername, expiresAtStr, signature] = parts;

  const expectedSignature = sign(`${encodedUsername}.${expiresAtStr}`, secret);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null;

  return { username: decodeURIComponent(encodedUsername) };
}

export function getSession(req: NextRequest): { username: string } | null {
  return verifySessionCookieValue(req.cookies.get(SESSION_COOKIE_NAME)?.value);
}
