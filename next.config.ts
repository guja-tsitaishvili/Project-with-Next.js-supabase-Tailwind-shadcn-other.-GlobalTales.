//certian things you can control here 
//In short: it tells Next.js how your app should behave at build time and runtime.
//Image domains (images.domains / remotePatterns)
//
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // ⚠️ use YOUR project ref here:
        hostname: "juioxkzmhtpcsddlskpi.supabase.co",
        // allow both public and signed URLs
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;



// You must whitelist hostnames in next.config.ts so Next.js knows:
// “Yes, it’s safe to fetch and optimize images from this domain.”