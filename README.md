# RA Brothers Roofing — website

Demo build for the partner presentation on **Friday 25 September 2026**.
Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
npm run typecheck
```

---

## Pages

| Route | What it is |
|---|---|
| `/` | Home — hero, services, process, warning signs, why us, service areas, FAQ, CTA |
| `/services` | All seven services as alternating rows |
| `/services/[slug]` | One page per service (7 pages) |
| `/service-areas` | All 51 towns, searchable and filterable by state |
| `/service-areas/[slug]` | Town landing pages — Salem NH, Windham NH, Methuen MA |
| `/free-estimate` | Four-step enquiry form, the main conversion page |
| `/about` | Company, principles, and an honest "not yet in place" list |
| `/plan` | **Internal.** Growth plan for the partner meeting — not in the public nav |

`/plan` is linked only from the footer, behind the demo flag, so it disappears
from the live site the moment `DEMO_MODE` is turned off.

---

## Turning the demo into a live site

Everything provisional lives in one file: **`src/lib/site.ts`**.

```ts
export const DEMO_MODE = true;   //  ← set to false at launch
```

Setting it to `false` does all of this at once:

- removes every "preview form — not connected yet" notice
- removes the "proposed hours — pending confirmation" notes
- removes the internal Growth Plan link from the footer
- switches the estimate form's confirmation to the real thank-you message

Then, separately:

1. **`src/lib/site.ts`** — set `url` to the real domain, fill in `email`,
   confirm `hours`.
2. **`src/app/layout.tsx`** — delete the `robots: { index: false, follow: false }`
   line from `metadata`. The whole site is deliberately hidden from Google
   until then.
3. **Connect the form.** `src/components/estimate-form.tsx` and
   `src/components/quick-form.tsx` currently just set local state. Point them
   at an email/SMS endpoint (Resend, Formspree, a route handler — whatever you
   pick).

---

## Content — where to edit what

| File | Holds |
|---|---|
| `src/lib/site.ts` | Business name, both phone numbers, hours, demo flag |
| `src/lib/services.ts` | All seven services — copy, bullets, images, SEO tags |
| `src/lib/areas.ts` | All 51 towns, plus the full content for the 3 town pages |
| `src/lib/content.ts` | Process steps, differentiators, FAQs, warning signs |

**Adding a town page** takes about ten minutes: add an entry to `townPages` in
`src/lib/areas.ts` and set `slug` on that town in the `towns` array. The route,
sitemap entry, nav dropdown and internal links all pick it up automatically.

---

## Things deliberately left out

Nothing on this site claims anything that is not yet true. There are no
reviews, no years-in-business, no certifications, no workmanship warranty, no
"24/7 emergency service", no project photos presented as our own work. The
About page lists each of these openly with its current status.

The photographs are Unsplash stock (free licence, commercial use allowed).
They are placeholders — replace `public/images/` with real job photography as
soon as there is some.

## Design notes

- **Type:** Archivo (display) + Inter (body), loaded via `next/font`.
- **Colour:** deep navy / charcoal / stone as requested, plus one warm copper
  accent for calls-to-action. All tokens are at the top of
  `src/app/globals.css` — to go all-blue, change the `--color-copper-*` values
  there and nothing else.
- **Icons** are hand-drawn SVGs in `src/components/icons.tsx`, built around a
  gable shape so the set reads as one family. No icon library.
