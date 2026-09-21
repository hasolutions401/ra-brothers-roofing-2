import type { MetadataRoute } from "next";
import { site, DEMO_MODE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Demo build: keep the whole site out of search until launch.
  if (DEMO_MODE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/plan"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
