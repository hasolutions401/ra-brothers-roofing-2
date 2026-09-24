# RA Brothers Roofing — website

Demo build for the partner presentation on **Friday 25 September 2026**.
Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.

```bash
npm install
npm run dev      # http://localhost:3000/
npm run build    # static export into out/
npm start        # preview that export
npm run lint
npm run typecheck
npm run images   # rebuild public/images/ from images-src/
npm run verify:export # links, assets, image widths, metadata and sitemap
npm run package:alwaysdata # upload-ready site + Laravel API (used by the deploy workflow)
```

The forms and the admin dashboard are backed by a Laravel 13 API in
**[`backend/`](backend/README.md)**. Its README covers local setup, the database
schema, the API, security and maintenance.

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
| `/about` | Company, principles and the satisfaction guarantee terms (`site.guarantee`) |
| `/privacy` | Privacy notice for both forms; linked beside each send button and in the footer |
| `/plan` | **Internal.** Only in `npm run dev`, or a build with `INCLUDE_PLAN=true`. Never deployed |
| `/admin/login` | Staff sign-in for the leads dashboard. Never indexed, not in the sitemap; linked from the footer only on builds with an API |
| `/admin` | Leads dashboard: counts, search, filters, details with photos, status, delete, CSV export (`?id=` opens one lead) |

Public pages live in the route group `src/app/(site)/`, which adds the header, footer and
call bar; the folder name does not appear in URLs. `src/app/admin/` has its own chrome.

---

## Hosting

Live at **https://rabrothersroofing.alwaysdata.net** (site, forms and admin
dashboard).

### Deploying to alwaysdata

Every push to `main` runs `.github/workflows/deploy-alwaysdata.yml`. It runs
the API tests, builds the site with `npm run package:alwaysdata`, uploads it
over SSH with rsync, then runs the database migrations and refreshes Laravel's
caches. It never touches the server's `backend/.env` or `backend/storage/`
(customer photos). It finishes by checking `/api/health`, that `/plan/`
returns 404, and that the security headers are present.

One-time setup: in GitHub, open **Settings → Secrets and variables → Actions**
and add the repository secret **`ALWAYSDATA_SSH_PASSWORD`**: the password of
the alwaysdata account's SSH user (alwaysdata admin → **Remote access → SSH**;
make sure password login is enabled there). Or, instead, add
`ALWAYSDATA_SSH_KEY`, a private key whose public key is in `~/.ssh/authorized_keys`
on the server. Until one of them is set, the workflow skips with a warning.
The defaults assume the account `rabrothersroofing` with the site in `~/www/htdocs`;
change them with the repository variables listed at the top of the workflow.
To preview what would change without changing anything, run the workflow by
hand from the Actions tab with **dry run** ticked.

The site's root on alwaysdata is `www/htdocs/`: the static site at its top,
Laravel in `www/htdocs/backend/`. The workflow checks that `www/htdocs/backend/.env`
exists before uploading, and refuses to run otherwise.
`backend/.env.alwaysdata.example` documents that file's settings, including
alwaysdata SMTP for new-lead emails.

### Build settings

The site is a static export (`output: "export"` in `next.config.ts`).
`src/lib/deployment.mjs` derives the canonical origin from `SITE_URL`, which
defaults to the alwaysdata address above. Navigation, photos, social previews,
canonicals and sitemap URLs use the same configuration. It also reads
`API_URL`, where the forms send: `/api` on alwaysdata, where the Laravel API
shares the site's domain, `http://localhost:8000/api` in development. Without
`API_URL` the forms stay in preview mode.
For a custom domain, set the repository variable `ALWAYSDATA_SITE_URL` to its
root URL and add the domain to the site in alwaysdata. Do not edit individual
asset paths.

`npm start` serves only `out/`, including trailing-slash redirects and the
site's 404 page. It replaces `next start`, which does not
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

- allows indexing of public pages (sitemap and robots point at `SITE_URL`)
- keeps unconnected forms honest: on a build without `API_URL`, a launch
  submission reports that it was not sent

In every build, demo or launch:

- `/plan` is left out, and the export is scanned for internal plan content.
  A publicly hosted demo is not private, so nothing internal is ever deployed.
- Unconfirmed hours are never shown; visitors see "call either number" and
  the one-business-day callback instead. No "coming soon" placeholders appear.

Then, separately:

1. **Client to confirm** (all in `src/lib/site.ts`): the company name, a
   business email (`email`; it appears in the footer and privacy notice once
   set), the hours (`hours`, then `hoursConfirmed: true`), the guarantee
   wording (`guarantee`), which promises its written terms are on every
   estimate, and the privacy notice's retention period (`privacy.retention`).
   Also confirm that every advertised service, including commercial membrane
   work, is something the crew delivers.
2. **Forms.** With `API_URL` set, both forms send to the Laravel API
   (`backend/`), which stores every request in MySQL for the dashboard.
   Photos are resized on the visitor's device and uploaded with the
   estimate. Rate limits, a honeypot and a minimum fill time block spam.
   A form shows success only after the server has stored it; otherwise the
   answers stay on screen with the reason and the phone number. Optional
   new-lead emails go through alwaysdata SMTP. See `backend/README.md`.
3. **Test lead delivery end to end** after every mail or hosting change:
   run `php artisan leads:test-email` on the server, then send both forms
   (the full one with a photo) from a phone. Check each appears in the
   dashboard with its photo, the team's new-lead email arrives, and, with
   `LEAD_CONFIRM_CUSTOMER=true`, the customer's confirmation arrives.

For the live site, set the repository variables `ALWAYSDATA_DEMO_MODE` and, if
needed, `ALWAYSDATA_SITE_URL`. The deploy defaults to demo and validates the
export before uploading. Demo pages use `noindex`; robots permits crawling so that directive
can be read. `noindex` keeps pages out of search; it does not make them
private.

The build's finalization step also normalizes a Next 16.3.5 Windows issue
that exports navigation segment files into nested directories. This changes
generated output only; Linux deployment uses the same portable script.

---

## Content — where to edit what

| File | Holds |
|---|---|
| `src/lib/site.ts` | Business name, both phone numbers, confirmed/proposed hours |
| `src/lib/deployment.mjs` | Deployment URL, API address, demo/launch environment |
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
"24/7 emergency service" (the storm page and FAQ say how urgent leaks are
handled instead), no project photos presented as our own work, and no
photo is captioned as a particular town. Items not yet real (licensing and
insurance certificates, reviews, warranty, financing) are simply absent
rather than listed as pending. Service capabilities and guarantee terms still
require client sign-off before launch. American spelling throughout.

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
