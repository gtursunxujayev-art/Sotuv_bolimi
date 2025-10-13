import { NextRequest, NextResponse } from "next/server";

const tg = (token: string, method: string) =>
  `https://api.telegram.org/bot${token}/${method}`;

export async function POST(req: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    if (!token) return NextResponse.json({ ok: false, error: "No token" }, { status: 500 });

    const update = await req.json();
    const msg = update?.message;
    const chatId = msg?.chat?.id;
    const text = msg?.text?.trim();

    if (!chatId || !text) return NextResponse.json({ ok: true });

    let reply = "";

    switch (text.toLowerCase()) {
      case "/start":
        reply =
          "👋 Assalomu alaykum!\nSiz *Sotuv bo'limi* botidasiz.\n\nBuyruqlar:\n/start — qayta boshlash\n/help — yordam\n/info — kompaniya haqida";
        break;

      case "/help":
        reply =
          "ℹ️ Bu bot orqali siz CRM va sotuv tizimlariga ulanish bo‘yicha yordam olishingiz mumkin.";
        break;

      case "/info":
        reply =
          "🏢 *Sotuv bo'limi*\nCRM, marketing va sotuv bo‘limlarini avtomatlashtirish uchun xizmat.\nVeb-sayt: https://sotuv-bolimi-kappa.vercel.app";
        break;

      default:
        reply = `Sotuv bo'limi javobi: ${text}`;
        break;
    }

    await fetch(tg(token, "sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
        parse_mode: "Markdown",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
