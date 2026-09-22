import { preload } from "react-dom";
import { imageSources } from "@/lib/image-loader";

/** Static WebP variants with their real pixel widths, including small originals. */
export function ResponsiveImage({ src, alt, sizes, className = "", priority = false, fill = false }: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  const sources = imageSources(src);
  if (priority) preload(sources.src, { as: "image", imageSrcSet: sources.srcSet, imageSizes: sizes, fetchPriority: "high" });
  // Native srcset is intentional: next/image's global width list cannot
  // describe each original's different maximum width on a static host.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...sources} alt={alt} sizes={sizes} loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined} decoding="async"
      className={`${fill ? "absolute inset-0 h-full w-full" : ""} ${className}`} />
  );
}
