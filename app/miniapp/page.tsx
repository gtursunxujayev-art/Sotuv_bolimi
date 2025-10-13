"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function MiniAppPage() {
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Telegram Web App object appears in the in-app webview
    // When opened from Telegram mobile/desktop
    const w = window as any;
    const tg = w?.Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready?.();
        tg.expand?.(); // Expand to full height
        // Read user if available
        const uname = tg.initDataUnsafe?.user?.username || null;
        setUsername(uname);
        setReady(true);
      } catch {
        setReady(true);
      }
    } else {
      // Not inside Telegram (opened in normal browser)
      setReady(true);
    }
  }, []);

  return (
    <>
      {/* Recommended for web version to have the API in window.Telegram.WebApp */}
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />

      <main className="min-h-[100dvh] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Sotuv bolimi — Mini App</h1>
          <p className="mt-2 text-gray-700">
            Bu sahifa Telegram ichida ochiladi (Web App).{" "}
            {!ready ? "Yuklanmoqda..." : "Tayyor."}
          </p>
          {username && (
            <p className="mt-2 text-sm text-gray-600">👤 Telegram foydalanuvchisi: @{username}</p>
          )}

          <div className="mt-6 space-y-2 text-sm">
            <p>Bu yerga kurslar ro‘yxati, to‘lov tugmalari va h.k. qo‘shasiz.</p>
            <p>Keyingi bosqich: to‘lov provayderi yoki checkout sahifasiga o‘tkazish.</p>
          </div>

          <button
            className="mt-6 w-full rounded-xl border px-4 py-2 text-center hover:bg-gray-50 active:scale-[0.99]"
            onClick={() => {
              const w = window as any;
              const tg = w?.Telegram?.WebApp;
              if (tg?.close) tg.close();
              else alert("Telegram webview emas — oddiy brauzerda ochildi.");
            }}
          >
            Yopish
          </button>
        </div>
      </main>
    </>
  );
}
