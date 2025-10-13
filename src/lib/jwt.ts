// src/lib/jwt.ts
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "";

if (!SECRET) {
  // In production, define JWT_SECRET (or NEXTAUTH_SECRET) in Vercel env
  console.warn("[jwt] JWT secret is missing. Set JWT_SECRET in environment variables.");
}

type SignPayload = Record<string, unknown>;

export function signJwt(payload: SignPayload, expiresIn: string | number = "7d") {
  if (!SECRET) throw new Error("JWT secret not configured");
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJwt<T = any>(token: string): T {
  if (!SECRET) throw new Error("JWT secret not configured");
  return jwt.verify(token, SECRET) as T;
}
