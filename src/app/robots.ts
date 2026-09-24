import type { MetadataRoute } from "next";
import { DEMO_MODE } from "@/lib/site";
import { pageUrl } from "@/lib/seo";

// Generated once at build time — the site is a static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Demo build: keep the whole site out of search until launch.
  if (DEMO_MODE) {
    // Crawlers must be allowed to read the pages' noindex directives.
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }
  // No Disallow lines: /plan is never deployed, and the admin pages carry
  // their own noindex, which crawlers can only see if they may fetch them.
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: pageUrl("/sitemap.xml"),
  };
}
