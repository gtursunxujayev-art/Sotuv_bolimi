# 1) Ensure the folder exists
mkdir -p app/api/admin/coins/history

# 2) Overwrite the file with a safe version (no `name` anywhere)
cat > app/api/admin/coins/history/route.ts <<'TS'
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.coinTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { id: true, displayName: true, username: true } },
      // If your schema has admin relation:
      // admin: { select: { id: true, displayName: true, username: true } },
    },
  });

  return NextResponse.json(items);
}
TS