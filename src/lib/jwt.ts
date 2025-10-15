// src/lib/jwt.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

/**
 * Conception (what this change gives you)
 * - Uses your cookie name **sotuv_bolimi_session** by default.
 * - `verifySession()` now supports **both styles**:
 *     1) `verifySession()` → reads token from cookie
 *     2) `verifySession(token)` → verifies a passed token (for legacy code)
 * - Exposes helpers to sign tokens and set/clear the session cookie.
 * - Works in Node.js runtime (required for `jsonwebtoken`).
 */

export type SessionPayload = JwtPayload & {
  id?: string;
  email?: string;
  username?: string;
  role?: string;
  isAdmin?: boolean;
  [k: string]: any;
};

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "";
export const SESSION_COOKIE =
  process.env.SESSION_COOKIE?.trim() || "sotuv_bolimi_session";

if (!SECRET) {
  // In production, set JWT_SECRET (or NEXTAUTH_SECRET) in Vercel → Environment Variables
  console.warn("[jwt] JWT secret is missing. Set JWT_SECRET / NEXTAUTH_SECRET in env.");
}

/** Low-level helpers */
export function signJwt(payload: object, expiresIn: string | number = "30d"): string {
  if (!SECRET) throw new Error("JWT secret not configured");
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJwt<T = any>(token: string): T {
  if (!SECRET) throw new Error("JWT secret not configured");
  return jwt.verify(token, SECRET) as T;
}

/**
 * High-level session helpers
 * - signSession(payload, days) → creates a JWT string
 * - verifySession() → reads cookie and verifies
 * - verifySession(token) → verifies a provided token (back-compat)
 * - setSessionCookie(res, token, days) / clearSessionCookie(res)
 */
export function signSession(payload: SessionPayload, days: number = 30): string {
  return signJwt(payload, `${days}d`);
}

/** Back-compat signature: token is optional */
export function verifySession<T = SessionPayload>(maybeToken?: string): T {
  const token =
    (maybeToken && maybeToken.trim()) ||
    cookies().get(SESSION_COOKIE)?.value ||
    "";

  if (!token) throw new Error("NO_SESSION");
  return verifyJwt<T>(token);
}

export function setSessionCookie(res: NextResponse, token: string, days: number = 30): void {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: days * 24 * 60 * 60,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
