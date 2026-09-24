import type { MetadataRoute } from "next";
import { pageUrl } from "@/lib/seo";
import { services } from "@/lib/services";
import { townPages } from "@/lib/areas";

// Generated once at build time — the site is a static export.
export const dynamic = "force-static";

// Every URL ends in "/" to match trailingSlash in next.config.ts, so search
// engines are not sent through a redirect for each entry.
export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["/", "/services/", "/service-areas/", "/free-estimate/", "/about/", "/privacy/"];

  return [
    ...statics.map((p) => ({
      url: pageUrl(p),
      changeFrequency: "monthly" as const,
      priority: p === "/" ? 1 : p === "/privacy/" ? 0.3 : 0.8,
    })),
    ...services.map((s) => ({
      url: pageUrl(`/services/${s.slug}/`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...townPages.map((t) => ({
      url: pageUrl(`/service-areas/${t.slug}/`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
