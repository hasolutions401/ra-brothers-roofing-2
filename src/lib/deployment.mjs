// Build-time configuration shared by Next, export verification and preview.
// SITE_URL includes the repository path; use a root URL for a custom domain.
const url = new URL(process.env.SITE_URL || "https://hasolutions401.github.io/ra-brothers-roofing-2/");
if (!/^https?:$/.test(url.protocol) || url.search || url.hash) {
  throw new Error("SITE_URL must be an HTTP(S) URL without a query or fragment.");
}
if (process.env.DEMO_MODE && !["true", "false"].includes(process.env.DEMO_MODE)) {
  throw new Error("DEMO_MODE must be true or false.");
}
export const basePath = url.pathname.replace(/\/$/, "");
export const siteUrl = `${url.origin}${basePath}`;
export const demoMode = process.env.DEMO_MODE !== "false";

// API_URL is where the Laravel API answers: "/api" when it shares the site's
// domain (InfinityFree, Hostinger), or a full URL in local development. Left
// empty (GitHub Pages), the forms stay in preview mode and send nothing.
const api = (process.env.API_URL || "").trim().replace(/\/$/, "");
if (api && !/^\/[^/]/.test(api) && !/^https?:\/\/[^/]+(\/.*)?$/.test(api)) {
  // Git Bash turns "/api" into a Windows path; use PowerShell or MSYS_NO_PATHCONV=1.
  throw new Error(`API_URL must be a path such as "/api" or an HTTP(S) URL, not "${api}".`);
}
export const apiUrl = api;
