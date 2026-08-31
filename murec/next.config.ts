import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "assets.murec.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default config;
