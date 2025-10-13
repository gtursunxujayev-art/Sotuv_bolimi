import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    app: "Sotuv bo'limi",
    url: "https://sotuv-bolimi-kappa.vercel.app",
    status: "ok"
  });
}