import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Minimal + safe: no 'name' anywhere, only valid fields
  const items = await prisma.coinTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { id: true, displayName: true, username: true } },
      // If your schema has adminId/admin relation and you want it:
      // admin: { select: { id: true, displayName: true, username: true } },
    },
  });

  return NextResponse.json(items);
}
