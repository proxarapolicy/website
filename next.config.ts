import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // Do not let the CDN keep ISR HTML for 5 minutes after on-demand revalidate.
  expireTime: 0,
  experimental: {
    // Enables React's <ViewTransition> during route navigation. Native browser
    // API — no GSAP page exits. Used for: gentle (site) page crossfade via
    // template.tsx, and the /thinking index title morphing into the essay <h1>.
    viewTransition: true,
  },
};

export default nextConfig;
