import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lastfm.freetls.fastly.net",
      },
    ],
  },
};

export default nextConfig;
