import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are admin-supplied URLs from arbitrary hosts, so
    // allow any https origin (plus keep the Unsplash placeholders working).
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
