export const metadata = {
  title: "Sotuv bo'limi",
  description:
    "Sotuv bo'limi — CRM, sotuv, marketing va Telegram bot integratsiyalari uchun platforma.",
  metadataBase: new URL("https://sotuv-bolimi-kappa.vercel.app"),
  openGraph: {
    title: "Sotuv bo'limi",
    description:
      "Sotuv bo'limi — CRM, sotuv, marketing va Telegram bot integratsiyalari uchun platforma.",
    url: "https://sotuv-bolimi-kappa.vercel.app",
    siteName: "Sotuv bo'limi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sotuv bo'limi",
    description:
      "Sotuv bo'limi — CRM, sotuv, marketing va Telegram bot integratsiyalari uchun platforma.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  );
}