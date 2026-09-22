import type { NextConfig } from "next";
import { apiUrl, basePath, siteUrl, demoMode } from "./src/lib/deployment.mjs";

// GitHub Pages serves the site from /ra-brothers-roofing-2, not the domain root.

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  basePath,

  // <Link> adds basePath on its own, but <Image> does not. asset() in
  // src/lib/site.ts reads this to prefix every photo path.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_DEMO_MODE: String(demoMode),
    NEXT_PUBLIC_API_URL: apiUrl,
  },

};

export default nextConfig;
