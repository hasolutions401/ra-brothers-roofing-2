// Builds deploy-build/alwaysdata/www/: the static site at the top, Laravel
// with production vendor/ in www/backend, and the .htaccess files. It holds
// no secrets: the server keeps its own backend/.env and backend/storage/
// (customer photos, logs, sessions), which a deploy never touches.
//
//   npm run package:alwaysdata
//
// .github/workflows/deploy-alwaysdata.yml runs this and uploads the result
// with rsync. SITE_URL defaults to the alwaysdata address; DEMO_MODE to
// true (search engines kept out) until launch.
import { spawnSync } from "node:child_process";
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const backend = path.join(root, "backend");
const target = path.join(root, "deploy-build", "alwaysdata");
const www = path.join(target, "www");
const composer = process.env.COMPOSER_BIN || "composer";
const siteUrl = process.env.SITE_URL || "https://rabrothersroofing.alwaysdata.net/";
const demoMode = process.env.DEMO_MODE || "true";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32", ...options });
  if (result.status !== 0) {
    console.error(`\n✗ ${command} ${args.join(" ")} failed.\n`);
    process.exit(1);
  }
}

if (new URL(siteUrl).pathname !== "/") {
  console.error("\n✗ SITE_URL must be the domain root: the site and API are served from the top of www/.\n");
  process.exit(1);
}

// 1. The static site, built for this domain with the API at /api ----------
const buildEnv = { ...process.env, SITE_URL: siteUrl, API_URL: "/api", DEMO_MODE: demoMode, INCLUDE_PLAN: "false" };
console.log(`\n→ Building the site for ${siteUrl} (DEMO_MODE=${demoMode})`);
run("npm", ["run", "build"], { env: buildEnv });
run("npm", ["run", "verify:export"], { env: buildEnv });

await rm(target, { recursive: true, force: true });
await mkdir(www, { recursive: true });
await cp(path.join(root, "out"), www, { recursive: true });
await cp(path.join(root, "deploy", "alwaysdata", "htaccess-root"), path.join(www, ".htaccess"));

// 2. Laravel: source only, then production dependencies --------------------
// Never copied: secrets, local data, tests, development tooling, and
// storage/ (the server's own, including customer photos).
const skip = [
  /^vendor(\/|$)/, /^node_modules(\/|$)/, /^tests(\/|$)/, /^storage(\/|$)/, /^\.phpunit\.(cache|result\.cache)(\/|$)/,
  /^\.env/, /^phpunit\.xml$/, /^\.editorconfig$/, /^\.gitattributes$/, /^\.gitignore$/, /^README\.md$/,
  /^database\/.*\.sqlite/, /^bootstrap\/cache\/.+\.php$/,
];
const backendOut = path.join(www, "backend");
await cp(backend, backendOut, {
  recursive: true,
  filter: (source) => {
    const relative = path.relative(backend, source).replaceAll(path.sep, "/");
    return relative === "" || !skip.some((pattern) => pattern.test(relative));
  },
});
await cp(path.join(root, "deploy", "alwaysdata", "htaccess-backend"), path.join(backendOut, ".htaccess"));
await cp(path.join(root, "deploy", "alwaysdata", "htaccess-backend-public"), path.join(backendOut, "public", ".htaccess"));

console.log("\n→ Installing Laravel's production dependencies");
run(composer, ["install", "--no-dev", "--optimize-autoloader", "--no-interaction", "--prefer-dist", "--no-progress"], { cwd: backendOut });

// When a dist download fails (GitHub rate limits, proxies) Composer falls
// back to git clones, leaving each package's history in vendor/.
async function removeGitData(dir) {
  let removed = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const item = path.join(dir, entry.name);
    if (entry.name === ".git") {
      await rm(item, { recursive: true, force: true, maxRetries: 3 });
      removed++;
    } else if (entry.isDirectory()) {
      removed += await removeGitData(item);
    }
  }
  return removed;
}
const gitData = await removeGitData(path.join(backendOut, "vendor"));
if (gitData) console.log(`→ Removed ${gitData} .git item(s) left by Composer source installs`);

// 3. Checks ------------------------------------------------------------------
async function walk(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  }))).flat();
}
const files = await walk(www);
const forbidden = files.filter((file) => {
  const relative = path.relative(www, file).replaceAll(path.sep, "/");
  return relative.split("/").includes(".git") || /^backend\/(\.env|storage\/)/.test(relative) || /^plan\//.test(relative);
});
if (forbidden.length) {
  console.error(`\n✗ These must never be deployed:\n  ${forbidden.slice(0, 10).map((f) => path.relative(www, f)).join("\n  ")}\n`);
  process.exit(1);
}

console.log(`\n✓ Ready: ${path.relative(root, www)} (${files.length} files)\n`);
