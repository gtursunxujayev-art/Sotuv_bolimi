import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// Agar admin tekshiruvi bo'lsa, shu yerga import qiling:
// import { getSession } from "@/lib/auth";

export async function GET() {
  // const s = await getSession();
  // if (!s?.isAdmin) return NextResponse.json([], { status: 403 });

  const items = await prisma.coinTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      // E’TIBOR: User da 'name' yo‘q, to‘g‘risi 'displayName'
      user:  { select: { id: true, displayName: true, username: true } },
      admin: { select: { id: true, displayName: true, username: true } }, // adminId qo‘shgan bo‘lsangiz
    },
  });

  return NextResponse.json(items);
}
