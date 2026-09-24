import manifest from "./image-manifest.json";

/**
 * Static image sources for the exported site. The generated manifest records
 * actual widths, so the browser can choose a suitable WebP without upscaling
 * small originals or downloading misleadingly labelled 2400w files.
 */
export function imageSources(src: string) {
  const name = src.split("/").at(-1) as keyof typeof manifest;
  const image = manifest[name];
  if (!image) throw new Error(`Unknown image ${src}. Run npm run images after adding an original.`);
  return {
    src: `${src}-${image.widths[0]}.webp`,
    srcSet: image.widths.map((width) => `${src}-${width}.webp ${width}w`).join(", "),
    width: image.width,
    height: image.height,
  };
}
