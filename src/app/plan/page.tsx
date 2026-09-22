import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { townCount, townPages, towns } from "@/lib/areas";
import { services } from "@/lib/services";
import { DEMO_MODE, site } from "@/lib/site";
import { Button, Eyebrow } from "@/components/ui";
import { IconCheck } from "@/components/icons";

// Once DEMO_MODE is off this route renders the 404 page, so its metadata must
// not describe the plan either.
export const metadata: Metadata = DEMO_MODE
  ? {
      title: "Growth Plan — Internal",
      description:
        "Internal growth plan: hosting, Google Business Profile, SEO, Google Ads, insurance work, the AI instant estimate and estimated ongoing costs.",
      robots: { index: false, follow: false },
    }
  : { title: "Page not found", robots: { index: false, follow: false } };

/*
 * The client confirmed on 21 Sep 2026 that "RA Brothers" will NOT be the final
 * company name, so there is deliberately no domain recommendation here.
 */
const nameChecklist = [
  ["The .com is available", "Customers type .com by default. If the .com is taken, treat the name as taken."],
  ["Easy to say over the phone", "Spell it out loud once. If you have to spell it twice, pick another."],
  ["Not tied to one town or state", "You plan to grow beyond Salem, and remote estimates make that possible. A name like \"Salem Roofing\" would cap you."],
  ["Not already trademarked", "Search the USPTO trademark database and the NH and MA business registries before committing."],
  ["Social handles are free", "Facebook, Instagram and the Google Business Profile will all want the same name."],
  ["Leaves room for more services", "\"... Roofing\" is fine today; \"... Roofing & Exteriors\" leaves space for gutters and siding later."],
];

const taglines = [
  "Roofing done right. Priced fair.",
  "A fair price. A roof you can trust.",
  "Honest roofs. Fair prices. Guaranteed.",
  "Done right, or we make it right.",
  "Built for New England weather.",
];

const phases = [
  {
    n: "Stage 0",
    when: "Before launch",
    cost: "≈ $20 one-off",
    items: [
      "Choose the final company name (RA Brothers is a working name)",
      "Check trademark and domain, then register the .com",
      "Set up business email on the domain",
      "Confirm hours and write the satisfaction guarantee terms",
      "Finalise licensing and insurance; add certificates to the site",
      "Replace stock photography with photos of real completed jobs",
    ],
  },
  {
    n: "Stage 1",
    when: "Launch week",
    cost: "≈ $30 / month",
    items: [
      "Deploy the site and point the domain at it",
      "Connect the estimate form to email and SMS notifications",
      "Create and verify the Google Business Profile",
      "Install Google Search Console and Analytics",
      "Turn on search-engine indexing (currently switched off)",
    ],
  },
  {
    n: "Stage 2",
    when: "Months 1 – 3",
    cost: "$500 – 1,000 / month to start",
    items: [
      "Test Google Ads with a small budget on storm damage, replacement and repair",
      "Apply for Google Local Services Ads once licensing and insurance are in place",
      "Photograph every completed job — this is the asset everything else runs on",
      "Ask every finished customer for a Google review, the same day",
      "Build out town pages beyond the first three",
      "List the business in the main directories and trade sites",
    ],
  },
  {
    n: "Stage 3",
    when: "Months 3 – 12",
    cost: "Scales with revenue",
    items: [
      "Build Phase 2: the AI instant estimate, once crew pricing is in",
      "Raise the Ads budget in steps as cost per job becomes clear",
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
    rec: "$500 – 1,000 / mo to start",
    note: "A test budget to learn which searches and towns turn into jobs. Scale up once cost per job is known — more budget does mean more calls.",
  },
  {
    item: "Google Local Services Ads",
    lean: "$0",
    rec: "Pay per lead",
    note: "You pay for a lead, not a click, and appear above normal ads. Needs licence, insurance and background checks first, so it comes after licensing.",
  },
  {
    item: "Insurance estimating software",
    lean: "$0",
    rec: "Monthly subscription",
    note: "Most insurers price roofs in Xactimate. Writing scopes in the same software makes supplements much easier. Check current pricing when insurance work starts.",
  },
  {
    item: "AI estimate: roof measurement data",
    lean: "$0",
    rec: "Small cost per lookup",
    note: "Phase 2 only. Aerial roof measurements are billed per address looked up; priced properly when the feature is built.",
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
  ["Resulting cost per lead", "$125 – 1,000"],
  ["Lead to signed job, typical for a new company", "20 – 30%"],
  ["Resulting cost per job won", "$420 – 5,000"],
  ["Average residential replacement ticket, New England", "$12,000 – 25,000"],
];

export default function PlanPage() {
  // Internal. Only built while DEMO_MODE is on, so it disappears from the
  // live site together with the footer link, not just the link.
  if (!DEMO_MODE) notFound();

  return (
    <div data-internal-plan>
      {/* Hero */}
      <section className="bg-navy-900 text-white">
        <div className="wrap py-14 lg:py-20">
          <span className="inline-flex rounded-lg border border-accent-400/45 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-400">
            Internal · demo build only
          </span>
          {!site.nameIsFinal && (
            <span className="ml-2 inline-flex rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              Working name
            </span>
          )}
          <h1 className="mt-5 max-w-[20ch] text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            Growth plan for {site.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
            How this website becomes a business that shows up when someone in
            Salem searches for a roofer at nine on a Sunday night — what it
            costs, in what order, and what has to happen before any of it works.
          </p>
          <p className="mt-5 text-sm text-navy-200">
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
                "Two phone lines: the MA number on Massachusetts pages, NH everywhere else",
                "Search-engine structured data, sitemap and metadata",
                "Remote-estimate option and photo upload in the estimate form",
                "Storm Damage & Insurance Claims page and an insurance question in the form",
                "Call-back-in-one-business-day and satisfaction guarantee on the key pages",
                "Company name set in one file, so renaming the whole site is a one-line change",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                  <span className="text-sm leading-snug text-charcoal-700">{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow tone="muted" className="mb-4">Waiting on you</Eyebrow>
            <ul className="space-y-2.5">
              {[
                "The final company name (RA Brothers is a working name)",
                "Domain and business email, after the name is final",
                "Roof types: asphalt only, or metal and flat roofs too?",
                "Where estimate requests go: text, email or both, and to which number",
                "Written terms for the satisfaction guarantee",
                "Crew pricing for the AI instant estimate",
                "Confirmed business hours",
                "Licensing and insurance certificates",
                "Photos of real completed jobs to replace the stock images",
                "Decision on workmanship warranty terms",
                "Decision on financing",
                "A physical or service-area address for the Google listing",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-mist-300" />
                  <span className="text-sm leading-snug text-charcoal-700">{i}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-mist-50 px-5 py-4 ring-1 ring-mist-200 text-sm leading-relaxed text-charcoal-500">
              Search indexing is disabled for this demo. Anyone with its URL
              can still view it, including this plan. The launch build removes
              the plan from the deployed output.
            </p>
          </div>
        </div>
      </Section>

      {/* Name & domain */}
      <Section n="02" title="Company name and domain" tone="paper">
        <p className="max-w-[70ch] text-base leading-relaxed text-charcoal-700">
          You have told me {site.short} will not be the final name, so{" "}
          <strong className="font-semibold text-navy-900">
            do not buy a domain yet.
          </strong>{" "}
          The whole site reads its name from one file, so the rename is quick
          whenever you decide. When you have a shortlist, send it over and I will
          check every name against the domain registry the same day.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nameChecklist.map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-mist-200 bg-white p-6">
              <div className="flex items-start gap-2.5">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                <h3 className="text-base font-bold text-navy-900">{t}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{d}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-12 text-lg font-bold text-navy-900">Tagline ideas</h3>
        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-charcoal-500">
          You do not have a slogan yet. A few directions, all built on what you
          told me matters: fair price, trust and the guarantee. Best chosen
          together with the final name.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {taglines.map((t) => (
            <li key={t} className="rounded-xl bg-navy-900 px-5 py-4 text-base font-bold text-white">
              &ldquo;{t}&rdquo;
            </li>
          ))}
        </ul>
      </Section>

      {/* Google Business Profile */}
      <Section n="03" title="Google Business Profile — do this first">
        <p className="max-w-[70ch] text-base leading-relaxed text-charcoal-700">
          For a local roofing company this matters more than the website and
          more than Ads. It is what puts you in the map pack — the three
          businesses shown above the normal search results — and it is free.
          Expect four to six weeks between creating it and seeing any traction,
          which is why it should be done on day one rather than day sixty.
        </p>

        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {[
            ["Set it up as a service-area business", "You do not need a storefront. Set the service area to the towns you cover rather than publishing a home address."],
            ["Verification takes time", "Google may post a physical postcard with a code. Start this early; it is the step that blocks everything else."],
            ["Categories matter", "Primary category: Roofing Contractor. Add secondary categories only for work you actually do."],
            ["Photos, constantly", "Profiles with regularly added job photos get materially more calls. Photograph every job from the ground, the roof and the finished result."],
            ["Reviews are the ranking lever", "Ask every customer the same day the job finishes, with a direct link. Ten honest reviews beats a hundred from a competitor two towns away."],
            ["Keep hours accurate", "Hours drive whether Google shows the call button. Confirm the real ones before launch."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-mist-200 bg-white p-6">
              <h3 className="text-base font-bold text-navy-900">{t}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-charcoal-500">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SEO */}
      <Section n="04" title="Getting found in Google search" tone="paper">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="max-w-[64ch] text-base leading-relaxed text-charcoal-700">
              Ranking for a generic term like &ldquo;roofing company&rdquo; is
              not realistic, and chasing it is where most local marketing budgets
              get wasted. Ranking for{" "}
              <em className="text-navy-900">roofing company in Salem NH</em> or{" "}
              <em className="text-navy-900">roof replacement Windham NH</em> is very
              realistic, and those are the people who actually call.
            </p>
            <p className="mt-5 max-w-[64ch] text-base leading-relaxed text-charcoal-700">
              That is why the site is built around a page per town and a page
              per service. Three town pages are live as examples; the same
              template scales to all {towns.length} towns, and each one is a
              separate shot at a separate search.
            </p>

            <div className="mt-8 rounded-xl border border-mist-200 bg-white p-6">
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
                    <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-600" />
                    <span className="text-sm leading-snug text-charcoal-700">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <Eyebrow tone="muted" className="mb-5">Realistic timeline</Eyebrow>
            <ol className="space-y-0">
              {[
                ["Weeks 1 – 4", "Google finds and indexes the site. Almost no traffic. This is normal."],
                ["Months 2 – 3", "Long-tail town and service searches start appearing. First organic calls, usually a trickle."],
                ["Months 4 – 6", "Map pack visibility improves as reviews accumulate. Organic becomes a real channel."],
                ["Months 6 – 12", "Town pages compound. This is the point where the early work starts paying for itself."],
              ].map(([when, what]) => (
                <li key={when} className="border-t border-mist-200 py-5 last:border-b">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent-600">
                    {when}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-charcoal-700">
                    {what}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm leading-relaxed text-charcoal-500">
              SEO is slow and cheap. Ads are fast and expensive. Early on you
              want both — Ads to get the phone ringing while the organic side
              builds underneath it.
            </p>
          </div>
        </div>
      </Section>

      {/* Ads */}
      <Section n="05" title="Google Ads">
        <p className="max-w-[70ch] text-base leading-relaxed text-charcoal-700">
          Starting small is the right call while you learn the market, and you
          are right that a large budget usually means lots of calls. Worth being
          blunt about the maths, though: roofing is one of the most expensive
          categories in Google Ads, because a single job is worth five figures.
          A small budget buys a handful of leads a month and, more importantly,
          the data on which searches and towns actually turn into jobs. These
          are market ranges to plan against, not promises.
        </p>

        <div className="mt-9 overflow-hidden rounded-2xl border border-mist-200">
          {adsNumbers.map(([k, v], i) => (
            <div
              key={k}
              className={`flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                i % 2 === 0 ? "bg-white" : "bg-mist-50"
              }`}
            >
              <span className="text-sm text-charcoal-700">{k}</span>
              <span className="text-base font-extrabold tabular-nums text-navy-900">
                {v}
              </span>
            </div>
          ))}
        </div>

        <h3 className="mt-10 text-lg font-bold text-navy-900">
          What each budget roughly buys
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            ["$500 / month", "≈ 8 – 33 clicks", "≈ 1 – 4 leads", "Enough to test and learn, not to fill a schedule."],
            ["$1,000 / month", "≈ 16 – 66 clicks", "≈ 1 – 8 leads", "A realistic next step once the test shows what converts."],
            ["$2,500 / month", "≈ 40 – 165 clicks", "≈ 3 – 20 leads", "Where Ads starts to feel like a steady source of work."],
          ].map(([budget, clicks, leads, note]) => (
            <div key={budget} className="rounded-2xl border border-mist-200 bg-white p-6">
              <p className="text-2xl font-extrabold text-navy-900">{budget}</p>
              <p className="mt-3 text-sm font-semibold text-charcoal-700">{clicks}</p>
              <p className="text-sm font-semibold text-accent-600">{leads}</p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-charcoal-500">
          Based on $15 – 60 per click and 6 – 12% of clicks becoming a lead.
          With a small budget, Google Local Services Ads is often the better
          first spend, because you pay per lead rather than per click. It needs
          your licence and insurance in place before Google will approve you.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Start narrow", "Three campaigns only: storm damage and insurance claims, roof replacement, roof repair. Salem, Windham, Methuen, Derry and Londonderry. Widen once something is working."],
            ["Send clicks to the right page", "An ad for roof repair in Methuen should land on the Methuen page, not the home page. That alone moves conversion rate several points."],
            ["Answer the phone", "Contractors lose more Ads money to unanswered calls than to bad targeting. A $40 click that rings out is a $40 click wasted."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-mist-200 bg-white p-6">
              <h3 className="text-base font-bold text-navy-900">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Insurance work */}
      <Section n="06" title="Insurance work" tone="paper">
        <p className="max-w-[70ch] text-base leading-relaxed text-charcoal-700">
          You said you would love to do insurance work, and it is profitable:
          the insurer pays for the scope, and storm jobs tend to be full
          replacements. The site now leads with it: a Storm Damage &amp;
          Insurance Claims page, insurance in the trust strip and FAQ, and an
          &ldquo;Is this an insurance claim?&rdquo; question in the form so
          those leads are flagged the moment they arrive. A few rules keep it
          safe:
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Help the claim, do not negotiate it", "Documenting damage, writing the scope, meeting the adjuster and submitting supplements for missed roofing items is normal contractor work. Negotiating the claim itself on the homeowner's behalf is public adjusting, which needs a separate licence in both NH and MA. The site copy is written to stay on the right side of that line."],
            ["Never waive or \"cover\" the deductible", "Offers like \"we'll pay your deductible\" or \"free roof\" are treated as insurance fraud. Keep them out of ads, door-knocking and sales conversations."],
            ["Use a proper agreement", "Insurance jobs usually run on a contingency agreement signed before the adjuster visit. Have a lawyer in each state review yours before the first job."],
            ["Be ready for storms", "Keep a storm-damage ad campaign built and paused, and switch it on the day after a major wind or hail event. That is when this work arrives."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-mist-200 bg-white p-6">
              <h3 className="text-base font-bold text-navy-900">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-charcoal-500">
          General guidance, not legal advice. Confirm the specifics with a
          lawyer in each state.
        </p>
      </Section>

      {/* AI instant estimate */}
      <Section n="07" title="Phase 2: the AI instant estimate">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <p className="max-w-[64ch] text-base leading-relaxed text-charcoal-700">
              The long-term goal you described: estimates that do not need
              someone at the property, so the business is not limited to where
              you can drive. The site is already set up for it: the form asks
              whether the customer wants a remote estimate and takes photos.
              Phase 2 turns that into an instant price.
            </p>
            <ol className="mt-6 space-y-4">
              {[
                ["Customer enters their address", "On the estimate page, instead of waiting for a call."],
                ["The roof is measured from aerial data", "Roof area and pitch come from satellite and aerial imagery services, so nobody climbs a ladder."],
                ["Your pricing turns it into a range", "Price per square, tear-off, pitch and extras: the numbers your crews give you."],
                ["They see a price range instantly", "Then book, upload photos, or ask to talk. You get the lead with the measurements attached."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-base font-bold text-navy-900">{t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal-500">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-mist-200 bg-mist-50 p-6">
              <h3 className="text-base font-bold text-navy-900">What I need from your crews</h3>
              <ul className="mt-3 space-y-2">
                {[
                  "Price per square for each roof type you will install",
                  "Tear-off cost per layer, and disposal",
                  "Surcharge for steep pitches, and at what pitch it starts",
                  "Decking replacement per sheet",
                  "Extras: chimney flashing, skylights, vents, ice and water shield",
                  "Minimum job charge and permit costs",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-charcoal-700">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-mist-200 bg-white p-6">
              <h3 className="text-base font-bold text-navy-900">Honest limits</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
                It gives a range, not a binding quote. Nobody can see rotten
                decking or an interior leak from above, and heavy tree cover
                makes measurements less reliable, so the final price is
                confirmed before work starts. Growing into new areas also means
                local crews and the right registration in each state
                (Massachusetts, for example, requires Home Improvement
                Contractor registration for residential work).
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Costs */}
      <Section n="08" title="What it costs to run" tone="paper">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-mist-300">
                <th className="py-4 pr-6 text-xs font-bold uppercase tracking-wider text-charcoal-500">
                  Item
                </th>
                <th className="py-4 pr-6 text-xs font-bold uppercase tracking-wider text-charcoal-500">
                  Minimum
                </th>
                <th className="py-4 pr-6 text-xs font-bold uppercase tracking-wider text-charcoal-500">
                  Recommended
                </th>
                <th className="py-4 text-xs font-bold uppercase tracking-wider text-charcoal-500">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {costs.map((c) => (
                <tr key={c.item} className="border-b border-mist-200 align-top">
                  <td className="py-4 pr-6 text-sm font-bold text-navy-900">
                    {c.item}
                  </td>
                  <td className="py-4 pr-6 text-sm tabular-nums text-charcoal-700">
                    {c.lean}
                  </td>
                  <td className="py-4 pr-6 text-sm font-semibold tabular-nums text-navy-900">
                    {c.rec}
                  </td>
                  <td className="py-4 text-sm leading-relaxed text-charcoal-500">
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
            ["With a test Ads budget", "$500 – 1,000 / month", "Everything above plus a small Google Ads budget to learn what works before scaling it up."],
          ].map(([t, amount, d], i) => (
            <div
              key={t}
              className={`rounded-2xl border p-6 ${
                i === 1
                  ? "border-accent-500 ring-1 ring-accent-500 bg-white"
                  : "border-mist-200 bg-white"
              }`}
            >
              <Eyebrow tone={i === 1 ? "accent" : "muted"} className="mb-3">
                {t}
              </Eyebrow>
              <p className="text-2xl font-extrabold leading-none text-navy-900">
                {amount}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Phases */}
      <Section n="09" title="Order of operations">
        <div className="grid gap-4 lg:grid-cols-4">
          {phases.map((p) => (
            <div key={p.n} className="rounded-2xl border border-mist-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-accent-600">
                {p.n}
              </p>
              <p className="mt-2 text-lg font-bold text-navy-900">
                {p.when}
              </p>
              <p className="mt-1.5 text-sm font-semibold tabular-nums text-charcoal-500">
                {p.cost}
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-mist-200 pt-5">
                {p.items.map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                    <span className="text-sm leading-snug text-charcoal-500">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* The one thing */}
      <section className="bg-navy-800 text-white">
        <div className="wrap py-14 lg:py-20">
          <Eyebrow tone="light" className="mb-2">
            If you only do one thing
          </Eyebrow>
          <h2 className="max-w-[22ch] text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            Photograph every job and ask every customer for a review.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100">
            Everything else on this page is infrastructure. Real photographs of
            your own work and a steady flow of honest Google reviews are the two
            assets that make a new roofing company look established — and they
            are the only two things on this list that no amount of money can buy
            quickly. Start collecting both from the very first job.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/" arrow>
              Back to the website
            </Button>
          </div>
        </div>
      </section>
    </div>
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
    <section className={tone === "paper" ? "bg-mist-50" : "bg-white"}>
      <div className="wrap py-14 lg:py-20">
        <div className="mb-8 flex items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-sm font-extrabold tabular-nums text-accent-400">
            {n}
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
