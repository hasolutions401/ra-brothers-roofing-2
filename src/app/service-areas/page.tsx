import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { nhTowns, maTowns, townCount, townPages } from "@/lib/areas";
import { PHONE_MA, PHONE_NH } from "@/lib/site";
import { PageHero, CtaBand } from "@/components/sections";
import { AreaExplorer } from "@/components/area-explorer";
import { SectionHeading, Eyebrow } from "@/components/ui";
import { IconArrow, IconPin } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Service Areas — Southern NH & Northern MA",
  description: `Roofing across ${townCount} towns in Southern New Hampshire and Northern Massachusetts, centred on Salem NH. Roof replacement, repair, storm damage and inspections.`,
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Where we work"
        crumbs={[{ href: "/service-areas", label: "Service Areas" }]}
        title={`${townCount} towns, two states, one crew`}
        lede="Salem, New Hampshire is where we are based and where most of our work is. From there we cover the Southern NH corridor down into the Massachusetts towns closest to the line — and we would rather say no to a job three hours away than do it badly."
        aside={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[PHONE_NH, PHONE_MA].map((p) => (
              <a
                key={p.state}
                href={p.href}
                className="rounded-[3px] border border-white/15 bg-white/[0.04] px-5 py-4 transition-colors hover:border-white/40"
              >
                <p className="eyebrow text-copper-400">{p.region}</p>
                <p className="mt-2 whitespace-nowrap font-display text-[19px] font-extrabold tabular-nums text-white xl:text-[20px]">
                  {p.display}
                </p>
              </a>
            ))}
          </div>
        }
      />

      {/* Core map band */}
      <section className="bg-white py-16 md:py-20">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
            <Reveal className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px]">
              <Image
                src="/images/aerial-neighborhood.jpg"
                alt="Aerial view of a residential neighbourhood in New England"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-tr from-navy-950/70 via-navy-950/15 to-transparent"
              />
              <div className="absolute bottom-6 left-6 max-w-[260px]">
                <p className="eyebrow mb-2 text-copper-400">Base town</p>
                <p className="font-display text-[26px] font-extrabold leading-none text-white">
                  Salem, NH
                </p>
                <p className="mt-2.5 text-[12.5px] leading-snug text-white/70">
                  Most of our work is within about thirty minutes of here.
                </p>
              </div>
            </Reveal>

            <div>
              <SectionHeading
                eyebrow="Two states, one crew"
                title="How the coverage actually works"
              />
              <div className="mt-8 space-y-6">
                <div className="border-l-2 border-copper-500 pl-6">
                  <h3 className="font-display text-[15px] font-bold text-ink">
                    New Hampshire — {nhTowns.length} towns
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.75] text-stone-600">
                    Our primary market, running from the Massachusetts border up
                    the I-93 and Route 3 corridors through Derry, Londonderry
                    and Nashua to Manchester and Goffstown.
                  </p>
                  <a
                    href={PHONE_NH.href}
                    className="mt-3 inline-block font-display text-[14px] font-extrabold tabular-nums text-copper-600"
                  >
                    {PHONE_NH.display}
                  </a>
                </div>
                <div className="border-l-2 border-ink/15 pl-6">
                  <h3 className="font-display text-[15px] font-bold text-ink">
                    Massachusetts — {maTowns.length} towns
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.75] text-stone-600">
                    The Merrimack Valley towns closest to Salem — Methuen,
                    Lawrence, Andover, Haverhill and Lowell — plus the ring of
                    towns behind them. Massachusetts enquiries go to a separate
                    line.
                  </p>
                  <a
                    href={PHONE_MA.href}
                    className="mt-3 inline-block font-display text-[14px] font-extrabold tabular-nums text-copper-600"
                  >
                    {PHONE_MA.display}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Town pages */}
      <section className="bg-paper py-16 md:py-20">
        <div className="wrap">
          <SectionHeading
            eyebrow="Town pages"
            title="Local detail, town by town"
            lede="We are building a page for each town with what we actually see on roofs there. Three are live; the rest follow as the business grows."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {townPages.map((t, i) => (
              <Reveal key={t.slug} delay={i * 60}>
                <Link
                  href={`/service-areas/${t.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-ink/10 bg-white transition-colors hover:border-ink/25"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={t.image}
                      alt={t.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow text-copper-600">
                      {t.county} · {t.zip}
                    </p>
                    <h3 className="mt-3 text-[19px] leading-tight text-ink">
                      {t.town}, {t.state}
                    </h3>
                    <p className="mt-3 flex-1 text-[13.5px] leading-[1.7] text-stone-600">
                      {t.localNotes[0].title} · {t.localNotes[1].title}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-display text-[12.5px] font-bold text-copper-600">
                      Roofing in {t.town}
                      <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full searchable list */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <SectionHeading
            eyebrow="Full service area"
            title={`Every town we cover`}
            lede="Search or filter the list. Towns with a pin have their own page."
          />
          <div className="mt-10">
            <AreaExplorer />
          </div>

          <div className="mt-14 rounded-[3px] border border-ink/10 bg-paper px-6 py-7 md:px-8">
            <Eyebrow className="mb-3">Expanding</Eyebrow>
            <p className="max-w-[70ch] text-[14.5px] leading-[1.8] text-stone-700">
              This list is deliberately tight. We would rather be twenty
              minutes from your house when something needs looking at than
              claim half of New England and take three days to get there. As
              the crew grows, the area grows with it.
            </p>
            <p className="mt-4 flex items-center gap-2 text-[13.5px] text-stone-600">
              <IconPin className="h-4 w-4 text-copper-600" />
              Just outside the list? Call anyway — we will give you a straight
              answer.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
