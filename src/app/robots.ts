import type { MetadataRoute } from "next";
import { asset, DEMO_MODE } from "@/lib/site";
import { pageUrl } from "@/lib/seo";

// Generated once at build time — the site is a static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Demo build: keep the whole site out of search until launch.
  if (DEMO_MODE) {
    // Crawlers must be allowed to read the pages' noindex directives.
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [asset("/plan/")] }],
    sitemap: pageUrl("/sitemap.xml"),
  };
}
