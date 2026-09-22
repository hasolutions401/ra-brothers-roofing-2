import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { basePath } from "../src/lib/deployment.mjs";

const root = path.resolve("out");
await stat(path.join(root, "index.html"));
const port = Number(process.env.PORT || 3000);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json" };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    if (basePath && pathname === basePath) {
      response.writeHead(308, { Location: `${basePath}/${url.search}` }); response.end(); return;
    }
    if (basePath && !pathname.startsWith(`${basePath}/`)) throw new Error("Outside base path");
    let file = path.resolve(root, `.${pathname.slice(basePath.length)}`);
    if (file !== root && !file.startsWith(root + path.sep)) throw new Error("Outside export");
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith("/")) { response.writeHead(308, { Location: `${pathname}/${url.search}` }); response.end(); return; }
      file = path.join(file, "index.html");
    }
    response.writeHead(200, { "Content-Type": `${types[path.extname(file)] || "application/octet-stream"}`, "Cache-Control": "no-store" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { "Content-Type": "text/html", "Cache-Control": "no-store" });
    response.end(await readFile(path.join(root, "404.html")));
  }
}).listen(port, "127.0.0.1", () => console.log(`Static preview: http://127.0.0.1:${port}${basePath}/`));
