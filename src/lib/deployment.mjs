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
