import { readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { demoMode, includePlan } from "../src/lib/deployment.mjs";

const out = path.resolve("out");
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  }))).flat();
}

// Next 16.3.5 on Windows exports segment names as nested directories.
// The browser requests dot-separated filenames on both Windows and Linux.
// Normalize the generated artifacts, without changing Next or source routes.
let normalized = 0;
for (const file of await files(out)) {
  const parts = path.relative(out, file).split(path.sep);
  const start = parts.findIndex((part) => part.startsWith("__next."));
  if (start !== -1 && start < parts.length - 1 && file.endsWith(".txt")) {
    const target = path.join(out, ...parts.slice(0, start), parts.slice(start).join("."));
    await rename(file, target);
    normalized++;
  }
}

if (!includePlan) {
  // This directory contains only the generated /plan route. A rendering
  // guard alone leaves a 404 artifact at its old address; do not deploy it.
  // Demo builds are public too, so this applies to them as well.
  const plan = path.resolve(out, "plan");
  if (path.dirname(plan) !== out) throw new Error("Invalid plan output path");
  await rm(plan, { recursive: true, force: true });
  for (const file of await files(out)) {
    if (!/\.(html|txt|js|json|xml|map)$/.test(file)) continue;
    const text = await readFile(file, "utf8");
    if (/data-internal-plan|Prepared for the partner presentation|Crew pricing for the AI instant estimate|Growth plan for/.test(text)) {
      throw new Error(`Internal plan content leaked into ${path.relative(out, file)}`);
    }
  }
}

// Used only by the local preview command, excluded from deployed artifacts.
await writeFile(path.resolve(".next/export-review.json"), JSON.stringify({ demoMode, includePlan, normalized }));
console.log(`Export finalized: ${demoMode ? "demo" : "launch"}, ${includePlan ? "WITH the internal plan (do not deploy)" : "no internal plan"}, ${normalized} segment filenames normalized.`);
