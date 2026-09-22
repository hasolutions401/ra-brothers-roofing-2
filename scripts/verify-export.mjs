import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
import sharp from "sharp";
import { basePath, siteUrl, demoMode } from "../src/lib/deployment.mjs";

const root = path.resolve("out");
async function walk(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  }))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const pages = new Map(await Promise.all(htmlFiles.map(async (file) => [file, await readFile(file, "utf8")])));
const failures = [];
let links = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const decode = (value) => value.replaceAll("&amp;", "&");

async function resolveUrl(href, source) {
  if (/^(tel:|mailto:|data:|https?:\/\/)/.test(href)) return;
  const relative = path.relative(root, source).replaceAll(path.sep, "/").replace(/index\.html$/, "");
  const url = new URL(decode(href), `https://review.invalid${basePath}/${relative}`);
  check(!basePath || url.pathname.startsWith(`${basePath}/`), `${relative}: URL misses base path: ${href}`);
  let file = path.join(root, decodeURIComponent(url.pathname.slice(basePath.length)));
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    await stat(file);
    if (url.hash && pages.has(file)) {
      const id = decodeURIComponent(url.hash.slice(1));
      check(pages.get(file).includes(`id="${id}"`), `${relative}: missing anchor ${href}`);
    }
  } catch { failures.push(`${relative}: missing file for ${href}`); }
  links++;
}

const expectedUrls = [];
for (const [file, html] of pages) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const is404 = relative === "404.html" || relative.startsWith("404/") || relative.startsWith("_not-found/");
  const isPlan = relative.startsWith("plan/");
  check((html.match(/<h1[\s>]/g) || []).length === 1, `${relative}: expected one H1`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  check(new Set(ids).size === ids.length, `${relative}: duplicate IDs`);
  for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*\b(?:href|src)="([^"]+)"/g)) await resolveUrl(match[1], file);
  for (const match of html.matchAll(/\b(?:srcSet|srcset|imageSrcSet|imagesrcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(",")) await resolveUrl(candidate.trim().split(/\s+/)[0], file);
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) check(/\balt="/.test(match[0]), `${relative}: image missing alt`);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || "";
  check(is404 || isPlan || (demoMode ? robots.includes("noindex") : !robots.includes("noindex")), `${relative}: wrong indexing mode`);
  if (!is404 && !isPlan) {
    const url = `${siteUrl}/${relative.replace(/index\.html$/, "")}`;
    expectedUrls.push(url);
    check(html.includes(`<link rel="canonical" href="${url}"`), `${relative}: incorrect canonical`);
    check(html.includes(`<meta property="og:url" content="${url}"`), `${relative}: incorrect Open Graph URL`);
    check(html.includes(`${siteUrl}/og-image.png`), `${relative}: missing social image`);
    check(/<meta name="description" content="[^"]+"/.test(html), `${relative}: missing description`);
  }
  check(!html.includes("example-roofing.com"), `${relative}: placeholder domain`);
}
const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
assert.deepEqual(sitemapUrls.sort(), expectedUrls.sort(), "Sitemap must match every public page exactly");
if (!demoMode) check(!files.some((file) => path.relative(root, file).startsWith(`plan${path.sep}`)), "Launch export includes /plan");

const manifest = JSON.parse(await readFile("src/lib/image-manifest.json", "utf8"));
let imageBytes = 0;
for (const [name, image] of Object.entries(manifest)) {
  for (const width of image.widths) {
    const file = path.join(root, "images", `${name}-${width}.webp`);
    const meta = await sharp(file).metadata();
    check(meta.width === width && meta.format === "webp", `${name}: incorrect ${width}w candidate`);
    imageBytes += (await stat(file)).size;
  }
}
let jsBytes = 0, gzipBytes = 0;
for (const file of files.filter((file) => file.endsWith(".js"))) {
  const contents = await readFile(file); jsBytes += contents.length; gzipBytes += gzipSync(contents).length;
}
if (failures.length) throw new Error(failures.join("\n"));
console.log(`PASS: ${expectedUrls.length} public pages, ${links} local references, ${Object.keys(manifest).length} photos, ${demoMode ? "demo" : "launch"} SEO.`);
console.log(`All exported JS: ${(jsBytes / 1024).toFixed(0)} KiB raw / ${(gzipBytes / 1024).toFixed(0)} KiB gzip. All image variants: ${(imageBytes / 1024 / 1024).toFixed(2)} MiB.`);
