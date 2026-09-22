/**
 * Turns every photo in images-src/ into responsive WebP files in
 * public/images/, at the widths src/lib/image-loader.ts asks for.
 *
 *   npm run images
 *
 * To add or replace a photo: drop a JPEG into images-src/, run the command,
 * and reference it in code as "/images/<name>" (no extension).
 * Uses the sharp version already installed with this project.
 */
import { readdir, mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_WIDTHS } from "../src/lib/image-widths.mjs";

const SRC = "images-src";
const OUT = "public/images";

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
// Validate every input before replacing any generated file. Unrelated files
// and credits in public/images are never deleted by the image pipeline.
const metadata = await Promise.all(files.map((file) => sharp(path.join(SRC, file)).metadata()));
const manifest = {};
const generated = new Set();
let total = 0;

for (const file of files) {
  const name = path.parse(file).name;
  const meta = metadata[files.indexOf(file)];
  const widths = [...new Set([...IMAGE_WIDTHS.filter((width) => width <= meta.width), Math.min(meta.width, IMAGE_WIDTHS.at(-1))])].sort((a, b) => a - b);
  manifest[name] = { width: meta.width, height: meta.height, widths };
  for (const width of widths) {
    const target = path.join(OUT, `${name}-${width}.webp`);
    const info = await sharp(path.join(SRC, file))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(target);
    total += info.size;
    generated.add(path.basename(target));
  }
  console.log(`✓ ${name}`);
}

await writeFile("src/lib/image-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
// Only remove superseded variants for originals in this run, after all new
// variants have been written. Preserve unrelated assets and original photos.
for (const file of await readdir(OUT)) {
  const match = file.match(/^(.+)-(\d+)\.webp$/);
  if (match && manifest[match[1]] && !generated.has(file)) await unlink(path.join(OUT, file));
}

console.log(`${files.length} photos, ${(total / 1024 / 1024).toFixed(2)} MB of WebP in ${OUT}/`);
