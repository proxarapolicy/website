import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  experimental: {
    // Enables React's <ViewTransition> during route navigation. Native browser
    // API — no animation library — and where unsupported the app simply does
    // not animate. Used for exactly one effect: the /thinking index title
    // morphing into the essay <h1>. See src/app/globals.css.
    viewTransition: true,
  },
};

export default nextConfig;
