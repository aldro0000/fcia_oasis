import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/assets/**/*": [
      "./logo.png",
      "./logofcia.png",
      "./public/**/*",
      "./FOTOS WEB FCIA/**/*",
      "./fotos web fcia/**/*",
    ],
  },
};

export default nextConfig;
