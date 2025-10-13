import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.coinTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user:  { select: { id: true, displayName: true, username: true } },
      // add this only if your schema has adminId/admin relation:
      // admin: { select: { id: true, displayName: true, username: true } },
    },
  });

  return NextResponse.json(items);
}
