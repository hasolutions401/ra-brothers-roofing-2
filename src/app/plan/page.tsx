import type { Metadata } from "next";
import Link from "next/link";
import { townCount, townPages, towns } from "@/lib/areas";
import { services } from "@/lib/services";
import { Eyebrow } from "@/components/ui";
import { IconArrow, IconCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Growth Plan — Internal",
  description:
    "Internal plan for RA Brothers Roofing: hosting, Google Business Profile, SEO, Google Ads, lead handling and estimated ongoing costs.",
  robots: { index: false, follow: false },
};

/** Checked against Verisign RDAP on 20 September 2026. Re-check before buying. */
const domains = [
  { name: "rabrothersroofing.com", status: "available", note: "First choice — exact business name, .com", best: true },
  { name: "rabrothersroofing.net", status: "available", note: "Defensive registration only" },
  { name: "rabrothersroof.com", status: "available", note: "Shorter, but drops the -ing" },
  { name: "rabrothersroofingnh.com", status: "available", note: "State-specific; limits later MA expansion" },
  { name: "rabrosroofing.com", status: "available", note: "Informal; harder to say over the phone" },
  { name: "rabroofing.com", status: "taken", note: "Already registered by someone else" },
  { name: "salemnhroofing.com", status: "available", note: "Keyword domain — only as an Ads landing page, never as the main site" },
];

const phases = [
  {
    n: "Phase 0",
    when: "Before launch",
    cost: "≈ $20 one-off",
    items: [
      "Register rabrothersroofing.com",
      "Set up business email on the domain",
      "Decide the legal entity name and confirm hours",
      "Finalise licensing and insurance; add certificates to the site",
      "Replace stock photography with photos of real completed jobs",
    ],
  },
  {
    n: "Phase 1",
    when: "Launch week",
    cost: "≈ $27 / month",
    items: [
      "Deploy the site and point the domain at it",
      "Connect the estimate form to email and SMS notifications",
      "Create and verify the Google Business Profile",
      "Install Google Search Console and Analytics",
      "Turn on search-engine indexing (currently switched off)",
    ],
  },
  {
    n: "Phase 2",
    when: "Months 1 – 3",
    cost: "$1,500 – 3,000 / month",
    items: [
      "Start Google Ads on the three core services in the core towns",
      "Photograph every completed job — this is the asset everything else runs on",
      "Ask every finished customer for a Google review, the same day",
      "Build out town pages beyond the first three",
      "List the business in the main directories and trade sites",
    ],
  },
  {
    n: "Phase 3",
    when: "Months 3 – 12",
    cost: "Scales with revenue",
    items: [
      "Expand to a page per town across all " + townCount + " towns",
      "Add a real project gallery with before and after photography",
      "Add reviews to the site once there is a genuine body of them",
      "Add gutters and siding pages if the crew takes that work on",
      "Consider call tracking to measure which channel produces which job",
    ],
  },
];

const costs = [
  {
    item: "Domain name",
    lean: "$12 / yr",
    rec: "$12 / yr",
    note: "Buy at cost from Cloudflare or Namecheap. Do not buy hosting bundled with it.",
  },
  {
    item: "Website hosting",
    lean: "$0",
    rec: "$0 – 20 / mo",
    note: "This site deploys free on Vercel, Netlify or Cloudflare Pages. A paid plan only becomes necessary at real traffic volume.",
  },
  {
    item: "Business email",
    lean: "$7 / mo",
    rec: "$7 / mo per person",
    note: "Google Workspace. Worth it — it also underpins the Google Business Profile.",
  },
  {
    item: "Form and SMS notifications",
    lean: "$0",
    rec: "$0 – 20 / mo",
    note: "Free tiers cover early volume comfortably.",
  },
  {
    item: "Google Business Profile",
    lean: "$0",
    rec: "$0",
    note: "Free, and the highest-return item on this entire list.",
  },
  {
    item: "Google Ads",
    lean: "$0",
    rec: "$1,500 – 3,000 / mo",
    note: "Optional but this is where the volume comes from early. Roofing is a high-cost keyword category.",
  },
  {
    item: "Call tracking",
    lean: "$0",
    rec: "$0 – 50 / mo",
    note: "Only once you are spending on Ads and need to know which channel the call came from.",
  },
  {
    item: "SEO tools",
    lean: "$0",
    rec: "$0",
    note: "Search Console is free and sufficient for the first year. Skip the $130/mo tools.",
  },
];

const adsNumbers = [
  ["Typical cost per click, roofing, Boston / Southern NH", "$15 – 60"],
  ["Form or call conversion rate on a focused landing page", "6 – 12% of clicks"],
  ["Resulting cost per lead", "$150 – 500"],
  ["Lead to signed job, typical for a new company", "20 – 30%"],
  ["Resulting cost per job won", "$600 – 2,000"],
  ["Average residential replacement ticket, New England", "$12,000 – 25,000"],
];

export default function PlanPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 pb-16 pt-[128px] text-white md:pb-20 md:pt-[172px]">
        <div className="blueprint absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="wrap relative">
          <span className="inline-flex rounded-[2px] border border-copper-400/45 px-3 py-1.5 font-display text-[10.5px] font-bold uppercase tracking-[0.18em] text-copper-400">
            Internal — not linked from the public site
          </span>
          <h1 className="mt-7 max-w-[20ch] text-[clamp(2rem,4.6vw,3.2rem)] leading-[1.05] text-white">
            Growth plan for RA Brothers Roofing
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.8] text-white/60">
            How this website becomes a business that shows up when someone in
            Salem searches for a roofer at nine on a Sunday night — what it
            costs, in what order, and what has to happen before any of it works.
          </p>
          <p className="mt-6 text-[12.5px] text-white/35">
            Prepared for the partner presentation · 25 September 2026 · All
            figures are market estimates to be verified, not quotes.
          </p>
        </div>
      </section>

      {/* Where it stands */}
      <Section n="01" title="Where the website stands today">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Eyebrow tone="accent" className="mb-4">
              Built and working
            </Eyebrow>
            <ul className="space-y-2.5">
              {[
                `Home, Services, ${services.length} individual service pages`,
                `Service Areas page with all ${townCount} towns, searchable`,
                `${townPages.length} town landing pages (Salem NH, Windham NH, Methuen MA)`,
                "Free estimate page with a four-step enquiry form",
                "About page, mobile navigation, always-visible call button",
                "Two phone lines — NH number on NH pages, MA number on MA pages",
                "Search-engine structured data, sitemap and metadata",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <IconCheck className="mt-[3px] h-4 w-4 shrink-0 text-copper-600" />
                  <span className="text-[14px] leading-snug text-stone-700">{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow className="mb-4">Waiting on you</Eyebrow>
            <ul className="space-y-2.5">
              {[
                "Domain purchase and business email",
                "Confirmed business hours",
                "Licensing and insurance certificates",
                "Photos of real completed jobs to replace the stock images",
                "Decision on workmanship warranty terms",
                "Decision on financing",
                "A physical or service-area address for the Google listing",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" />
                  <span className="text-[14px] leading-snug text-stone-700">{i}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-[3px] border-l-2 border-copper-500 bg-paper px-5 py-4 text-[13px] leading-[1.7] text-stone-600">
              Indexing by Google is currently switched off site-wide, so nothing
              goes public by accident before you are ready. It is one line to
              turn on at launch.
            </p>
          </div>
        </div>
      </Section>

      {/* Domain */}
      <Section n="02" title="Domain name" tone="paper">
        <p className="max-w-[70ch] text-[15px] leading-[1.8] text-stone-700">
          The good news: the exact-match .com is free. I checked all of these
          against the registry on 20 September 2026 — availability can change,
          so re-check the day you buy.
        </p>

        <div className="mt-9 overflow-hidden rounded-[4px] border border-ink/10 bg-white">
          {domains.map((d) => (
            <div
              key={d.name}
              className={`flex flex-col gap-2 border-b border-ink/8 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-6 ${
                d.best ? "bg-copper-50" : ""
              }`}
            >
              <span className="w-[230px] shrink-0 font-display text-[14px] font-bold text-ink">
                {d.name}
              </span>
              <span
                className={`inline-flex w-[92px] shrink-0 justify-center rounded-[2px] px-2 py-1 font-display text-[10.5px] font-bold uppercase tracking-[0.12em] ${
                  d.status === "available"
                    ? "bg-copper-600 text-white"
                    : "bg-ink/10 text-stone-500"
                }`}
              >
                {d.status}
              </span>
              <span className="text-[13px] leading-snug text-stone-600">
                {d.note}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-[70ch] text-[14px] leading-[1.8] text-stone-600">
          <strong className="font-semibold text-ink">
            Recommendation: buy rabrothersroofing.com
          </strong>{" "}
          and register the .net alongside it purely so nobody else takes it.
          Avoid building the business on a keyword domain like
          salemnhroofing.com — it pins the brand to one town, and Google stopped
          rewarding exact-match keyword domains a long time ago.
        </p>
      </Section>

      {/* Google Business Profile */}
      <Section n="03" title="Google Business Profile — do this first">
        <p className="max-w-[70ch] text-[15px] leading-[1.8] text-stone-700">
          For a local roofing company this matters more than the website and
          more than Ads. It is what puts you in the map pack — the three
          businesses shown above the normal search results — and it is free.
          Expect four to six weeks between creating it and seeing any traction,
          which is why it should be done on day one rather than day sixty.
        </p>

        <div className="mt-9 grid gap-px overflow-hidden rounded-[4px] border border-ink/10 bg-ink/10 md:grid-cols-2">
          {[
            ["Set it up as a service-area business", "You do not need a storefront. Set the service area to the towns you cover rather than publishing a home address."],
            ["Verification takes time", "Google may post a physical postcard with a code. Start this early; it is the step that blocks everything else."],
            ["Categories matter", "Primary category: Roofing Contractor. Add secondary categories only for work you actually do."],
            ["Photos, constantly", "Profiles with regularly added job photos get materially more calls. Photograph every job from the ground, the roof and the finished result."],
            ["Reviews are the ranking lever", "Ask every customer the same day the job finishes, with a direct link. Ten honest reviews beats a hundred from a competitor two towns away."],
            ["Keep hours accurate", "Hours drive whether Google shows the call button. Confirm the real ones before launch."],
          ].map(([t, d]) => (
            <div key={t} className="bg-white p-6">
              <h3 className="font-display text-[14.5px] font-bold text-ink">{t}</h3>
              <p className="mt-2.5 text-[13.5px] leading-[1.7] text-stone-600">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SEO */}
      <Section n="04" title="Getting found in Google search" tone="paper">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="max-w-[64ch] text-[15px] leading-[1.8] text-stone-700">
              Ranking for a generic term like &ldquo;roofing company&rdquo; is
              not realistic, and chasing it is where most local marketing budgets
              get wasted. Ranking for{" "}
              <em className="text-ink">roofing company in Salem NH</em> or{" "}
              <em className="text-ink">roof replacement Windham NH</em> is very
              realistic, and those are the people who actually call.
            </p>
            <p className="mt-5 max-w-[64ch] text-[15px] leading-[1.8] text-stone-700">
              That is why the site is built around a page per town and a page
              per service. Three town pages are live as examples; the same
              template scales to all {towns.length} towns, and each one is a
              separate shot at a separate search.
            </p>

            <div className="mt-8 rounded-[3px] border border-ink/10 bg-white p-6">
              <Eyebrow tone="accent" className="mb-4">
                Already built in
              </Eyebrow>
              <ul className="space-y-2">
                {[
                  "A unique title and description on every page",
                  "Local business structured data with the full service area",
                  "Automatic sitemap and robots file",
                  "Fast image loading and mobile-first layout",
                  "Internal links between towns, services and nearby towns",
                  "Genuinely local page content, not the same paragraph with the town swapped",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <IconCheck className="mt-[3px] h-3.5 w-3.5 shrink-0 text-copper-600" />
                    <span className="text-[13.5px] leading-snug text-stone-700">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <Eyebrow className="mb-5">Realistic timeline</Eyebrow>
            <ol className="space-y-0">
              {[
                ["Weeks 1 – 4", "Google finds and indexes the site. Almost no traffic. This is normal."],
                ["Months 2 – 3", "Long-tail town and service searches start appearing. First organic calls, usually a trickle."],
                ["Months 4 – 6", "Map pack visibility improves as reviews accumulate. Organic becomes a real channel."],
                ["Months 6 – 12", "Town pages compound. This is the point where the early work starts paying for itself."],
              ].map(([when, what]) => (
                <li key={when} className="border-t border-ink/12 py-5 last:border-b">
                  <p className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-copper-600">
                    {when}
                  </p>
                  <p className="mt-2.5 text-[14px] leading-[1.7] text-stone-700">
                    {what}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[13px] leading-[1.7] text-stone-600">
              SEO is slow and cheap. Ads are fast and expensive. Early on you
              want both — Ads to get the phone ringing while the organic side
              builds underneath it.
            </p>
          </div>
        </div>
      </Section>

      {/* Ads */}
      <Section n="05" title="Google Ads">
        <p className="max-w-[70ch] text-[15px] leading-[1.8] text-stone-700">
          Worth being blunt: roofing is one of the most expensive categories in
          Google Ads, because a single job is worth five figures and every
          contractor in the Merrimack Valley knows it. Below $1,000 a month you
          will not gather enough data to optimise anything. These are market
          ranges to plan against, not promises.
        </p>

        <div className="mt-9 overflow-hidden rounded-[4px] border border-ink/10">
          {adsNumbers.map(([k, v], i) => (
            <div
              key={k}
              className={`flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                i % 2 === 0 ? "bg-white" : "bg-paper"
              }`}
            >
              <span className="text-[14px] text-stone-700">{k}</span>
              <span className="font-display text-[15px] font-extrabold tabular-nums text-ink">
                {v}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-ink/10 bg-ink/10 md:grid-cols-3">
          {[
            ["Start narrow", "Three campaigns only: roof replacement, roof repair, storm damage. Salem, Windham, Methuen, Derry and Londonderry. Widen once something is working."],
            ["Send clicks to the right page", "An ad for roof repair in Methuen should land on the Methuen page, not the home page. That alone moves conversion rate several points."],
            ["Answer the phone", "Contractors lose more Ads money to unanswered calls than to bad targeting. A $40 click that rings out is a $40 click wasted."],
          ].map(([t, d]) => (
            <div key={t} className="bg-white p-7">
              <h3 className="font-display text-[14.5px] font-bold text-ink">{t}</h3>
              <p className="mt-3 text-[13.5px] leading-[1.75] text-stone-600">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Costs */}
      <Section n="06" title="What it costs to run" tone="paper">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-ink/15">
                <th className="py-4 pr-6 font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-stone-500">
                  Item
                </th>
                <th className="py-4 pr-6 font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-stone-500">
                  Minimum
                </th>
                <th className="py-4 pr-6 font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-stone-500">
                  Recommended
                </th>
                <th className="py-4 font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-stone-500">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {costs.map((c) => (
                <tr key={c.item} className="border-b border-ink/10 align-top">
                  <td className="py-4 pr-6 font-display text-[13.5px] font-bold text-ink">
                    {c.item}
                  </td>
                  <td className="py-4 pr-6 text-[13.5px] tabular-nums text-stone-700">
                    {c.lean}
                  </td>
                  <td className="py-4 pr-6 text-[13.5px] font-semibold tabular-nums text-ink">
                    {c.rec}
                  </td>
                  <td className="py-4 text-[13px] leading-[1.65] text-stone-600">
                    {c.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Bare minimum", "≈ $8 / month", "Domain and email only. The site is live, nothing is being spent to get traffic to it."],
            ["Sensible start", "≈ $30 / month", "Domain, email, hosting headroom and notifications. Google Business Profile doing the heavy lifting for free."],
            ["With Ads", "$1,500 – 3,000 / month", "Everything above plus a Google Ads budget large enough to produce usable data."],
          ].map(([t, amount, d], i) => (
            <div
              key={t}
              className={`rounded-[4px] border p-6 ${
                i === 1
                  ? "border-copper-500 bg-white"
                  : "border-ink/12 bg-white"
              }`}
            >
              <Eyebrow tone={i === 1 ? "accent" : "dark"} className="mb-3">
                {t}
              </Eyebrow>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink">
                {amount}
              </p>
              <p className="mt-3 text-[13px] leading-[1.7] text-stone-600">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Phases */}
      <Section n="07" title="Order of operations">
        <div className="grid gap-px overflow-hidden rounded-[4px] border border-ink/10 bg-ink/10 lg:grid-cols-4">
          {phases.map((p) => (
            <div key={p.n} className="bg-white p-7">
              <p className="font-display text-[12px] font-bold uppercase tracking-[0.16em] text-copper-600">
                {p.n}
              </p>
              <p className="mt-2 font-display text-[16px] font-bold text-ink">
                {p.when}
              </p>
              <p className="mt-1.5 text-[13px] font-semibold tabular-nums text-stone-500">
                {p.cost}
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-ink/10 pt-5">
                {p.items.map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-copper-500" />
                    <span className="text-[13px] leading-snug text-stone-600">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* The one thing */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white md:py-24">
        <div className="blueprint absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="wrap relative">
          <Eyebrow tone="light" className="mb-6">
            If you only do one thing
          </Eyebrow>
          <h2 className="max-w-[22ch] text-[clamp(1.8rem,3.6vw,2.7rem)] leading-[1.1] text-white">
            Photograph every job and ask every customer for a review.
          </h2>
          <p className="mt-7 max-w-2xl text-[15.5px] leading-[1.8] text-white/60">
            Everything else on this page is infrastructure. Real photographs of
            your own work and a steady flow of honest Google reviews are the two
            assets that make a new roofing company look established — and they
            are the only two things on this list that no amount of money can buy
            quickly. Start collecting both from the very first job.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="group inline-flex h-12 items-center gap-2 rounded-[3px] bg-copper-600 px-6 font-display text-[13.5px] font-bold text-white hover:bg-copper-700"
            >
              Back to the website
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  n,
  title,
  children,
  tone = "white",
}: {
  n: string;
  title: string;
  children: React.ReactNode;
  tone?: "white" | "paper";
}) {
  return (
    <section className={tone === "paper" ? "bg-paper" : "bg-white"}>
      <div className="wrap border-t border-ink/10 py-16 md:py-20">
        <div className="mb-10 flex items-baseline gap-5">
          <span className="font-display text-[12px] font-bold tabular-nums tracking-[0.2em] text-copper-600">
            {n}
          </span>
          <h2 className="text-[clamp(1.5rem,2.8vw,2.1rem)] leading-tight text-ink">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
