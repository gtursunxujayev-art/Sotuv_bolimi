// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/src/lib/jwt";

// Force Node.js runtime so 'jsonwebtoken' works
export const runtime = "nodejs";
// If you need dynamic evaluation
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Try Authorization: Bearer <token>
    const auth = req.headers.get("authorization");
    let token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

    // Or from cookie "token"
    if (!token) {
      const cookie = req.cookies.get("token");
      token = cookie?.value || null;
    }

    if (!token) {
      return NextResponse.json({ ok: false, error: "No token" }, { status: 401 });
    }

    const user = verifyJwt(token) as { id?: string; email?: string; [k: string]: any };

    return NextResponse.json({ ok: true, user });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "Invalid token" }, { status: 401 });
  }
}
