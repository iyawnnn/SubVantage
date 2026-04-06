import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.googleusercontent.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  ${!isDev ? "upgrade-insecure-requests;" : ""}
`.replace(/\s{2,}/g, " ").trim();

const nextConfig: NextConfig = {
  async headers() {
    const headers = [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on"
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN"
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff"
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin"
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()"
      },
      {
        key: "Content-Security-Policy",
        value: cspHeader
      }
    ];

    // Strictly enforce HSTS only in production to prevent localhost SSL locks
    if (!isDev) {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload"
      });
    }

    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
};

export default nextConfig;