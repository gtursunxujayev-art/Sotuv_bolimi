import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import your auth/session checker if you have one
// import { getSession } from "@/lib/auth";

export async function GET() {
  // const s = await getSession();
  // if (!s?.isAdmin) return NextResponse.json([], { status: 403 });

  const items = await prisma.coinTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user:  { select: { id: true, displayName: true, username: true } },
      admin: { select: { id: true, displayName: true, username: true } },
    },
  });

  return NextResponse.json(items);
}
