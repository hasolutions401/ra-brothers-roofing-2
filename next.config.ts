import type { NextConfig } from "next";

// GitHub Pages serves the site from /ra-brothers-roofing-2, not the domain root.
const basePath = "/ra-brothers-roofing-2";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  basePath,

  // <Link> adds basePath on its own, but <Image> does not. asset() in
  // src/lib/site.ts reads this to prefix every photo path.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
