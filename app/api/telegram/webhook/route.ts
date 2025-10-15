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
    const text = (msg?.text || "").trim();

    if (!chatId) return NextResponse.json({ ok: true });

    const WEB_APP_URL = "https://sotuv-bolimi-kappa.vercel.app/miniapp";

    let replyText =
      "👋 Assalomu alaykum! Bu yerda *Sotuv bolimi* mini-ilovamizni ochishingiz mumkin.";
    let replyMarkup: any = {
      inline_keyboard: [[{ text: "🚀 Open Sotuv bolimi", web_app: { url: WEB_APP_URL } }]],
    };

    switch (text.toLowerCase()) {
      case "/start":
      case "start":
        break;
      case "/help":
        replyText = "ℹ️ Mini-ilovani ochish uchun tugmani bosing.";
        break;
      default:
        // still show web app button
        replyText = `Sotuv bolimi: ${text}`;
        break;
    }

    await fetch(tg(token, "sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
        parse_mode: "Markdown",
        reply_markup: replyMarkup,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
