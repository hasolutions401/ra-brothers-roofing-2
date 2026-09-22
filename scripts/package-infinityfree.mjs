// Builds deploy-build/infinityfree/: an htdocs/ folder ready to upload with
// FTP (the static site at the top, Laravel with production vendor/ in
// htdocs/backend, the .htaccess files and .env), plus database.sql for
// phpMyAdmin. InfinityFree has no SSH or Composer, so everything that needs
// PHP tooling happens here. Settings come from backend/.env.infinityfree.
//
//   npm run package:infinityfree
//
// Needs PHP 8.3+ and Composer on this computer (Laragon has both). Set
// PHP_BIN or COMPOSER_BIN if they are not on PATH; COMPOSER_BIN may be a
// composer.phar. DEMO_MODE=false builds the launch version of the site.
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const backend = path.join(root, "backend");
const envPath = path.join(backend, ".env.infinityfree");
const target = path.join(root, "deploy-build", "infinityfree");
const htdocs = path.join(target, "htdocs");
const php = process.env.PHP_BIN || "php";
const composer = process.env.COMPOSER_BIN || "composer";
const demoMode = process.env.DEMO_MODE || "true";

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const windows = process.platform === "win32";
  const quote = (value) => (windows && /\s/.test(value) ? `"${value}"` : value);
  const result = spawnSync(quote(command), args.map(quote), { stdio: "inherit", shell: windows, ...options });
  if (result.status !== 0) fail(`${command} ${args.join(" ")} failed.`);
}

async function walk(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  }))).flat();
}

// Every .git directory below `dir`, without descending into them.
async function gitDirectories(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return (await Promise.all(entries.filter((entry) => entry.isDirectory()).map((entry) => {
    const child = path.join(dir, entry.name);
    return entry.name === ".git" ? [child] : gitDirectories(child);
  }))).flat();
}

// 1. Settings --------------------------------------------------------------
let envText;
try {
  envText = await readFile(envPath, "utf8");
} catch {
  fail("backend/.env.infinityfree is missing. Copy backend/.env.infinityfree.example to it and fill in the values marked FILL IN.");
}
const env = Object.fromEntries(
  envText.split(/\r?\n/).filter((line) => /^[A-Z_][A-Z0-9_]*=/.test(line)).map((line) => {
    const [key, ...rest] = line.split("=");
    return [key, rest.join("=").trim().replace(/^"(.*)"$/, "$1")];
  }),
);

const setIfEmpty = (key, value) => {
  if (env[key]) return;
  env[key] = value;
  envText = envText.replace(new RegExp(`^${key}=.*$`, "m"), `${key}=${value}`);
};
setIfEmpty("APP_KEY", `base64:${randomBytes(32).toString("base64")}`);
setIfEmpty("SETUP_TOKEN", randomBytes(24).toString("hex"));
await writeFile(envPath, envText);

let siteUrl;
try {
  siteUrl = new URL(env.APP_URL);
} catch {
  fail("APP_URL in backend/.env.infinityfree must be the site's address, e.g. https://rabrothers.infinityfreeapp.com");
}
if (/your-site/.test(env.APP_URL)) fail("Set APP_URL in backend/.env.infinityfree to your InfinityFree address.");
if (siteUrl.pathname !== "/") fail("APP_URL must be the domain root (no path): the site and API are served from the top of htdocs.");
if (/^(if0_00000000|sql000)/.test(env.DB_DATABASE + env.DB_HOST) || !env.DB_PASSWORD) {
  fail("Fill in DB_HOST, DB_DATABASE, DB_USERNAME and DB_PASSWORD from the InfinityFree control panel (MySQL Databases).");
}
if (!/^\S+@\S+\.\S+$/.test(env.ADMIN_EMAIL ?? "") || (env.ADMIN_PASSWORD ?? "").length < 12) {
  fail("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in backend/.env.infinityfree.");
}
if (siteUrl.protocol === "http:" && env.SESSION_SECURE_COOKIE === "true") {
  console.warn("! APP_URL is http:// but SESSION_SECURE_COOKIE=true: admin sign-in only works over https.");
}

// 2. The static site, built for this domain with the API at /api -----------
const buildEnv = { ...process.env, SITE_URL: `${siteUrl.origin}/`, API_URL: "/api", DEMO_MODE: demoMode };
console.log(`\n→ Building the site for ${siteUrl.origin} (DEMO_MODE=${demoMode})`);
run("npm", ["run", "build"], { env: buildEnv });
run("npm", ["run", "verify:export"], { env: buildEnv });

await rm(target, { recursive: true, force: true });
await mkdir(htdocs, { recursive: true });
await cp(path.join(root, "out"), htdocs, { recursive: true });
await cp(path.join(root, "deploy", "infinityfree", "htaccess-root"), path.join(htdocs, ".htaccess"));

// 3. Laravel: source only, then production dependencies --------------------
// Never copied: local secrets, local data (SQLite, logs, sessions, cache,
// customer photos), tests and development tooling. Of storage/ and
// bootstrap/cache/ only Laravel's empty folder skeleton is copied.
const skip = [
  /^vendor(\/|$)/, /^node_modules(\/|$)/, /^tests(\/|$)/, /^\.phpunit\.(cache|result\.cache)(\/|$)/,
  /^\.env/, /^phpunit\.xml$/, /^\.editorconfig$/, /^\.gitattributes$/, /^\.gitignore$/, /^README\.md$/,
  /^database\/.*\.sqlite/,
];
const skeleton = new Set([
  "storage", "storage/app", "storage/app/private", "storage/app/public", "storage/framework",
  "storage/framework/cache", "storage/framework/cache/data", "storage/framework/sessions",
  "storage/framework/views", "storage/logs", "bootstrap/cache",
]);
const backendOut = path.join(htdocs, "backend");
await cp(backend, backendOut, {
  recursive: true,
  filter: (source) => {
    const relative = path.relative(backend, source).replaceAll(path.sep, "/");
    if (relative === "") return true;
    if (skip.some((pattern) => pattern.test(relative))) return false;
    if (/^(storage|bootstrap\/cache)(\/|$)/.test(relative)) {
      return skeleton.has(relative) || (path.basename(relative) === ".gitignore" && skeleton.has(path.dirname(relative)));
    }
    return true;
  },
});
await writeFile(path.join(backendOut, ".env"), envText);
await cp(path.join(root, "deploy", "infinityfree", "htaccess-backend"), path.join(backendOut, ".htaccess"));
await cp(path.join(root, "deploy", "infinityfree", "htaccess-backend-public"), path.join(backendOut, "public", ".htaccess"));

// No --optimize-autoloader: InfinityFree silently drops PHP files over 1 MB,
// and the optimized class map can exceed that.
console.log("\n→ Installing Laravel's production dependencies");
const composerCommand = composer.endsWith(".phar") ? [php, [composer]] : [composer, []];
run(composerCommand[0], [...composerCommand[1], "install", "--no-dev", "--no-interaction", "--prefer-dist", "--no-progress"], { cwd: backendOut });

// Composer falls back to installing from source whenever a dist download
// fails (GitHub API rate limits are the usual cause). Those installs are git
// clones, so each package keeps a .git directory: hundreds of megabytes of
// repository history, uploaded to a web host that must never serve it.
// Dist installs have none, so on a normal run this removes nothing.
const repos = await gitDirectories(path.join(backendOut, "vendor"));
if (repos.length) {
  await Promise.all(repos.map((dir) => rm(dir, { recursive: true, force: true })));
  console.log(`  Removed ${repos.length} .git director${repos.length === 1 ? "y" : "ies"} left by source installs.`);
}

// 4. database.sql for phpMyAdmin (kept OUTSIDE htdocs: it holds the admin's
// password hash). Generating it needs no database connection.
run(php, ["artisan", "deploy:schema-sql", path.join(target, "database.sql")], { cwd: backendOut });
await rm(path.join(backendOut, "storage", "logs", "laravel.log"), { force: true });

// 5. Checks ------------------------------------------------------------------
const files = await walk(htdocs);
const sizes = await Promise.all(files.map(async (file) => (await stat(file)).size));
const oversized = files.filter((file, i) => file.endsWith(".php") && sizes[i] > 1_000_000);
if (oversized.length) {
  fail(`InfinityFree drops PHP files over 1 MB, and these are larger:\n  ${oversized.map((f) => path.relative(htdocs, f)).join("\n  ")}`);
}
const megabytes = (sizes.reduce((a, b) => a + b, 0) / 1024 / 1024).toFixed(1);

console.log(`
✓ Ready: ${path.relative(root, htdocs)} (${files.length} files, ${megabytes} MB)
  InfinityFree allows about 30,000 files per account; this uses ${files.length}.

Next:
  1. Upload the CONTENTS of ${path.relative(root, htdocs)} into htdocs with FileZilla
     (include hidden files such as .htaccess and .env).
  2. Open ${siteUrl.origin}/api/setup and enter this setup token:
       ${env.SETUP_TOKEN}
     (or import ${path.relative(root, path.join(target, "database.sql"))} in phpMyAdmin instead).
  3. Check ${siteUrl.origin}/api/health says "ok", then sign in at ${siteUrl.origin}/admin/login/.
  4. Clear SETUP_TOKEN in backend/.env.infinityfree and re-upload htdocs/backend/.env.

Full guide: backend/README.md, "Deploy to InfinityFree".
`);
