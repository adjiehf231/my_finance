import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth profile avatars
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // Supabase Storage URLs
      },
    ],
  },
};

export default nextConfig;
