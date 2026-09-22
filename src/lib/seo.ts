import type { Metadata } from "next";
import { site } from "./site";

/** Absolute URLs include the Pages repository path exactly once. */
export function pageUrl(path: string) {
  return `${site.url.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

/** The social preview image, built by src/app/og-image.png/route.tsx. */
export const ogImage = {
  url: pageUrl("/og-image.png"),
  width: 1200,
  height: 630,
  alt: `${site.name} — roofing in Southern New Hampshire and Northern Massachusetts`,
};

/**
 * Title, description, canonical URL and social-preview tags for one page.
 * Without this every page inherited the home page's Open Graph text, so a
 * shared link to any page previewed as the home page.
 *
 * `path` is relative to metadataBase and ends in "/" to match trailingSlash.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const full = `${title} | ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: pageUrl(path) },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      title: full,
      description,
      url: pageUrl(path),
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [ogImage.url] },
  };
}
