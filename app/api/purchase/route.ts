import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In real app, identify user from Telegram initData or session cookie
const DEMO_USER_ID = process.env.DEMO_USER_ID || "demo-user";

export async function POST(req: NextRequest) {
  try {
    const { videoId, amountPaid = 0, currency = "COIN" } = await req.json();
    if (!videoId) return NextResponse.json({ ok: false, error: "videoId required" }, { status: 400 });

    // Make sure video exists
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) return NextResponse.json({ ok: false, error: "Video not found" }, { status: 404 });

    // Upsert user for the demo flow
    const user = await prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      update: {},
      create: {
        id: DEMO_USER_ID,
        displayName: "Demo User",
        coins: 1000000,
      },
    });

    // Create purchase (unique per user+video)
    const purchase = await prisma.purchase.upsert({
      where: { userId_videoId: { userId: user.id, videoId } },
      update: { amountPaid, currency, status: "SUCCESS" },
      create: { userId: user.id, videoId, amountPaid, currency, status: "SUCCESS" },
    });

    return NextResponse.json({ ok: true, data: purchase });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "purchase failed" }, { status: 500 });
  }
}
