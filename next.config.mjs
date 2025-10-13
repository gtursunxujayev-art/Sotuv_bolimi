/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  env: {
    NEXT_PUBLIC_APP_NAME: "Sotuv bo'limi",
    NEXT_PUBLIC_APP_URL: "https://sotuv-bolimi-kappa.vercel.app",
  },
  poweredByHeader: false,
};

export default nextConfig;