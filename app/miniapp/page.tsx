"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  thumbUrl?: string | null;
  category?: string | null;
  tags: string[];
};

export default function MiniAppPage() {
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const w = window as any;
    const tg = w?.Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready?.();
        tg.expand?.();
        const uname = tg.initDataUnsafe?.user?.username || null;
        setUsername(uname);
      } catch {}
    }
    setReady(true);

    (async () => {
      const res = await fetch("/api/courses");
      const json = await res.json();
      setCourses(json?.data || []);
      setLoading(false);
    })();
  }, []);

  async function buy(videoId: string, price: number) {
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, amountPaid: price, currency: "COIN" }),
      });
      const json = await res.json();
      if (json.ok) alert("Sotib olindi ✅");
      else alert("Xatolik: " + (json.error || "purchase failed"));
    } catch (e: any) {
      alert("Xatolik: " + e.message);
    }
  }

  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <main className="min-h-[100dvh] px-4 py-6">
        <h1 className="text-2xl font-bold">Sotuv bolimi — Kurslar</h1>
        {username && <p className="mt-1 text-sm text-gray-600">👤 @{username}</p>}

        {loading ? (
          <p className="mt-6">Yuklanmoqda...</p>
        ) : courses.length === 0 ? (
          <p className="mt-6">Hozircha kurslar yo‘q.</p>
        ) : (
          <ul className="mt-6 grid gap-4">
            {courses.map((c) => (
              <li key={c.id} className="rounded-2xl border p-4 shadow-sm">
                <div className="flex gap-4">
                  {c.thumbUrl ? (
                    <img src={c.thumbUrl} alt={c.title} className="h-20 w-32 rounded-lg object-cover" />
                  ) : (
                    <div className="h-20 w-32 rounded-lg bg-gray-100" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                    <p className="text-sm text-gray-700 line-clamp-2">{c.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {c.isFree ? "Bepul" : `${c.price} COIN`}
                      </span>
                      <button
                        className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50 active:scale-[0.99]"
                        onClick={() => (c.isFree ? buy(c.id, 0) : buy(c.id, c.price))}
                      >
                        {c.isFree ? "Qo'shish" : "Sotib olish"}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          className="mt-8 w-full rounded-xl border px-4 py-2 text-center hover:bg-gray-50 active:scale-[0.99]"
          onClick={() => {
            const w = window as any;
            const tg = w?.Telegram?.WebApp;
            if (tg?.close) tg.close();
            else alert("Telegram webview emas — oddiy brauzerda ochildi.");
          }}
        >
          Yopish
        </button>
      </main>
    </>
  );
}
