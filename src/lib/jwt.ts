// src/lib/jwt.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

/**
 * Conception (what this change gives you)
 * - Fixes all “not exported: verifySession / signSession” compile errors.
 * - Centralizes JWT session handling for your API routes.
 * - Uses a consistent cookie name: SESSION_COOKIE (default "sotuv_bolimi_session").
 * - Works on Node.js runtime (recommended for jsonwebtoken).
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
export const SESSION_COOKIE = process.env.SESSION_COOKIE || "sotuv_bolimi_session";

if (!SECRET) {
  // In production, set JWT_SECRET (or NEXTAUTH_SECRET) in Vercel → Environment Variables.
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
 * Exported API used across routes
 * - signSession(payload) → returns token string (you can set it to cookie yourself)
 * - verifySession() → reads cookie from the current request context and returns payload (or throws)
 * - setSessionCookie(res, token, days) → attaches cookie to a NextResponse
 * - clearSessionCookie(res) → removes session cookie
 */
export function signSession(payload: SessionPayload, days: number = 30): string {
  const token = signJwt(payload, `${days}d`);
  return token;
}

export function verifySession<T = SessionPayload>(): T {
  const cookie = cookies().get(SESSION_COOKIE);
  const token = cookie?.value;
  if (!token) {
    throw new Error("NO_SESSION");
  }
  return verifyJwt<T>(token);
}

export function setSessionCookie(res: NextResponse, token: string, days: number = 30): void {
  // Attach httpOnly cookie
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
