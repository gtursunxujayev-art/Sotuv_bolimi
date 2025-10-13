import { NextRequest, NextResponse } from "next/server";

const tg = (token: string, method: string) =>
  `https://api.telegram.org/bot${token}/${method}`;

export async function POST(req: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    if (!token) return NextResponse.json({ ok: false, error: "No token" }, { status: 500 });

    const update = await req.json();
    const msg = update?.message;

    if (msg?.chat?.id && typeof msg.text === "string") {
      await fetch(tg(token, "sendMessage"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: msg.chat.id,
          text: `Sotuv bo'limi javobi: ${msg.text}`,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}