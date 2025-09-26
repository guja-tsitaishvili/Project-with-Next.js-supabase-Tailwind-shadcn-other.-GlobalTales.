//certian things you can control here 
//In short: it tells Next.js how your app should behave at build time and runtime.
//Image domains (images.domains / remotePatterns)
//
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "juioxkzmhtpcsddlskpi.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;


// You must whitelist hostnames in next.config.ts so Next.js knows:
// “Yes, it’s safe to fetch and optimize images from this domain.”