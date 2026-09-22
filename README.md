# RA Brothers Roofing — website

Demo build for the partner presentation on **Friday 25 September 2026**.
Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.

```bash
npm install
npm run dev      # http://localhost:3000/ra-brothers-roofing-2/
npm run build    # static export into out/
npm start        # preview that export at the same repository base path
npm run lint
npm run typecheck
npm run images   # rebuild public/images/ from images-src/
npm run verify:export # links, assets, image widths, metadata and sitemap
npm run package:infinityfree # upload-ready site + Laravel API for InfinityFree
```

The forms and the admin dashboard are backed by a Laravel 13 API in
**[`backend/`](backend/README.md)**. Its README covers local setup, the database
schema, the API, security, and deploying to InfinityFree and Hostinger.

---

## Pages

| Route | What it is |
|---|---|
| `/` | Home — hero with quick form, services, process, "Is it time?" self-check, what you get, service areas, FAQ, CTA |
| `/services` | All seven services as alternating rows |
| `/services/[slug]` | One page per service (7 pages) |
| `/service-areas` | All 51 towns, searchable and filterable by state |
| `/service-areas/[slug]` | Town landing pages — Salem NH, Windham NH, Methuen MA |
| `/free-estimate` | Four-step estimate form, the main conversion page |
| `/about` | Company and principles; the pending-items list appears only in demo mode |
| `/plan` | **Internal.** Present in demo output; excluded from launch output |
| `/admin/login` | Staff sign-in for the leads dashboard. Never indexed, not in the sitemap; linked from the footer only on builds with an API |
| `/admin` | Leads dashboard: counts, search, filters, details with photos, status, delete, CSV export (`?id=` opens one lead) |

Public pages live in the route group `src/app/(site)/`, which adds the header, footer and
call bar; the folder name does not appear in URLs. `src/app/admin/` has its own chrome.

---

## Hosting

Live at **https://hasolutions401.github.io/ra-brothers-roofing-2/**.

Every push to `main` runs `.github/workflows/deploy.yml`, which builds a static
export (`output: "export"` in `next.config.ts`) and publishes `out/` to GitHub
Pages — the same setup as the other RA Brothers site.

`src/lib/deployment.mjs` derives the base path and canonical origin from
`SITE_URL`, which defaults to the GitHub Pages URL above. Navigation, photos,
social previews, canonicals and sitemap URLs use the same configuration.
It also reads `API_URL`, where the forms send: `/api` when the Laravel API
shares the site's domain (InfinityFree, Hostinger), `http://localhost:8000/api`
in development. GitHub Pages cannot run PHP, so that build leaves `API_URL`
empty and its forms stay in preview mode.
For a custom domain, set `SITE_URL` to its root URL before building and configure
the domain in GitHub Pages. Do not edit individual asset paths.

`npm start` serves only `out/`, including repository paths, trailing-slash
redirects and the site's 404 page. It replaces `next start`, which does not
support static exports. `PORT` changes its default port of 3000.

---

## Turning the demo into a live site

Business details live in **`src/lib/site.ts`**. Deployment mode is a build-time
environment variable, defaulting to demo. For PowerShell:

```powershell
$env:DEMO_MODE = "false"
npm run build
npm run verify:export
Remove-Item Env:DEMO_MODE
# Rebuild to return the preview output to demo mode.
```

Setting it to `false` does all of this at once:

- allows indexing of public pages
- renders no internal plan content, removes the generated `/plan` directory and footer link,
  and scans the exported HTML, data and JavaScript for internal plan markers
- hides the About page's internal pending-items list
- omits unconfirmed hours rather than silently treating them as confirmed
- keeps unconnected forms honest: on a build without `API_URL`, a launch
  submission reports that it was not sent

Then, separately:

1. Confirm the company name, email, service scope and guarantee terms.
   Update `hours` and set `hoursConfirmed: true` only after client confirmation.
   Displayed and structured hours derive from the same entries.
2. **Forms.** With `API_URL` set, both forms send to the Laravel API
   (`backend/`), which stores every request in MySQL for the dashboard.
   Photos are resized on the visitor's device and uploaded with the
   estimate. Rate limits, a honeypot and a minimum fill time block spam.
   A form shows success only after the server has stored it; otherwise the
   answers stay on screen with the reason and the phone number. Optional
   new-lead emails need a host that can send mail (Hostinger, not
   InfinityFree). See `backend/README.md`.

For GitHub Actions, set repository variables `DEMO_MODE` and, if needed,
`SITE_URL`. The workflow defaults to demo and validates the export before
uploading. Demo pages use `noindex`; robots permits crawling so that directive
can be read. A project-level GitHub Pages robots file is not a domain-root
robots policy. **A publicly hosted demo is not private**: anyone with the URL
can view `/plan`. Do not publish confidential information in demo mode.

The build's finalization step also normalizes a Next 16.3.5 Windows issue
that exports navigation segment files into nested directories. This changes
generated output only; Linux deployment uses the same portable script.

---

## Content — where to edit what

| File | Holds |
|---|---|
| `src/lib/site.ts` | Business name, both phone numbers, confirmed/proposed hours |
| `src/lib/deployment.mjs` | Deployment URL, repository path, demo/launch environment |
| `src/lib/services.ts` | All seven services — copy, lists, photo, CTA heading, SEO tags |
| `src/lib/areas.ts` | All 51 towns, plus the full content and FAQs for the 3 town pages |
| `src/lib/content.ts` | Process steps, what-you-get points, FAQs, warning signs |
| `src/lib/seo.ts` | Per-page title / description / canonical / social preview |

**Adding a town page** takes about ten minutes: add an entry to `townPages` in
`src/lib/areas.ts` and set `slug` on that town in the `towns` array. The route,
sitemap entry, menu, internal links and mobile call bar all pick it up.

---

## Photos

Originals live in **`images-src/`** (not deployed). `npm run images` turns each
one into WebP files targeting 640, 1080, 1600 and 2400 px in `public/images/`.
Smaller originals are capped at their natural width, never upscaled.
The generated `src/lib/image-manifest.json` records exact candidate widths.
`ResponsiveImage` and `src/lib/image-loader.ts` use those real widths in native
`srcset`, with a matching preload for hero images and lazy loading elsewhere.
Shared `SiteLink` disables automatic route prefetching so menus do not preload
the entire photo catalogue. Reference a photo in code as
`"/images/<name>"`, without an extension.

The current photographs are Unsplash stock (free licence, commercial use
allowed); `images-src/CREDITS.md` lists each one, where it is used, and the
small edits made (a shirt logo and house numbers blurred). They are
placeholders. Replace them with real job photography as soon as there is some:
drop the JPEGs into `images-src/`, run `npm run images`, and update the paths
in `src/lib/`.

Choose photos appropriate to the service and describe what is visible.
Stock photographs are not evidence of work performed by this business or of
a specific town. Some older credit entries still need their original source
URLs recovered; do not invent photographer attribution or location claims.

---

## Things deliberately left out

Nothing on this site claims anything that is not yet true. There are no
reviews, no years-in-business, no certifications, no workmanship warranty, no
"24/7 emergency service", no project photos presented as our own work, and no
photo is captioned as a particular town. The About page lists each missing
item with its current status in the demo only. Service capabilities, specific
crew procedures and guarantee terms still require client sign-off before launch.

## Design notes

Same direction as the live RA Brothers site
(hasolutions401.github.io/roofing-website): blue buttons, navy dark sections,
neutral greys everywhere else. The details are this site's own.

- **Type:** Archivo, slightly condensed, for headings; Geist for body text.
  Both load via `next/font`.
- **Colour:** navy for dark sections and headings, one blue accent
  (`accent-500`, always with white text, 6.4:1) for anything clickable,
  warm greys for light sections and borders. All tokens are at the top of
  `src/app/globals.css`. Text, input boundaries and focus indicators have been
  reviewed; this does not replace assistive-technology testing.
- **Shape:** tight corners — 6px buttons and inputs, 8px panels and photos,
  set once as radius tokens in `globals.css`.
- **Layout:** sections vary on purpose — lists with hairline rules, split
  heading-and-content layouts, one timeline. Cards are kept for things you
  can click. Numbers appear only on the four-step process, because it is the
  one list that happens in order.
- **Icons:** line icons in `src/components/icons.tsx`, drawn for this site —
  the seven service icons show the trade (shingle courses, hammer, truss,
  wind, ladder, season, flat roof). No icon library, no icon tiles.
- **Motion:** hover/menu transitions respect reduced motion. Form-step scrolling
  also uses an immediate transition when reduced motion is requested.
- **Logo** (`Logo` in `src/components/icons.tsx`) is the live site's roof-line
  mark; `src/app/icon.svg` is the same mark as the browser-tab icon.
