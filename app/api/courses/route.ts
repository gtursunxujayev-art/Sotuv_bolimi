import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      isFree: true,
      thumbUrl: true,
      category: true,
      tags: true,
    },
  });
  return NextResponse.json({ ok: true, data: videos });
}
