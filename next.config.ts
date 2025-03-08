import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lastfm.freetls.fastly.net",
      },
      {
        hostname: "flagcdn.com",
      },
    ],
  },
};

export default nextConfig;
