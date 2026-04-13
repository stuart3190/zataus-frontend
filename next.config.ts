import path from "node:path";
import type { NextConfig } from "next";

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
  ?.replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      ...(storeDomain
        ? [
            {
              protocol: "https" as const,
              hostname: storeDomain,
            },
          ]
        : []),
    ],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
