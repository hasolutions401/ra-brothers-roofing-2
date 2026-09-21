import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { nhTowns, maTowns, townCount, townPages } from "@/lib/areas";
import { asset, PHONE_MA, PHONE_NH } from "@/lib/site";
import { PageHero, PhoneCard, CtaBand } from "@/components/sections";
import { AreaExplorer } from "@/components/area-explorer";
import { SectionHeading } from "@/components/ui";
import { IconPhone, IconPin } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Service Areas — Southern NH & Northern MA",
  description: `Roofing across ${townCount} towns in Southern New Hampshire and Northern Massachusetts, centred on Salem NH. Roof replacement, repair, storm damage and inspections.`,
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        image="/images/aerial-winter.jpg"
        eyebrow="Where we work"
        crumbs={[{ href: "/service-areas", label: "Service Areas" }]}
        title={`${townCount} towns across Southern NH and Northern MA`}
        lede="We are starting from Salem, New Hampshire, covering the Southern NH corridor and the Massachusetts towns closest to the line. Free estimates are often done from photos, so wherever you are on this list you will not wait long for a price."
        aside={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[PHONE_NH, PHONE_MA].map((p) => (
              <PhoneCard key={p.state} phone={p} />
            ))}
          </div>
        }
      />

      {/* Core map band */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
            <Reveal className="relative overflow-hidden rounded-2xl">
              <Image
                src={asset("/images/aerial-neighborhood.jpg")}
                alt="Aerial view of a residential neighbourhood in New England"
                width={1600}
                height={1000}
                sizes="(min-width: 1024px) 36rem, 100vw"
                className="h-64 w-full object-cover sm:h-80 lg:h-[24rem]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-tr from-navy-950/75 via-navy-950/20 to-transparent"
              />
              <div className="absolute bottom-6 left-6 max-w-[16rem]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-400">Base town</p>
                <p className="mt-1.5 text-2xl font-extrabold leading-none text-white">Salem, NH</p>
                <p className="mt-2 text-sm leading-snug text-navy-100">
                  Where we started — and where most of our work is today.
                </p>
              </div>
            </Reveal>

            <div>
              <SectionHeading eyebrow="Two states, two phone lines" title="How the coverage works" />
              <div className="mt-7 grid gap-4">
                <div className="rounded-2xl border border-mist-200 bg-white p-6">
                  <h3 className="text-base font-bold text-navy-900">New Hampshire — {nhTowns.length} towns</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
                    Our primary market, running from the Massachusetts border up
                    the I-93 and Route 3 corridors through Derry, Londonderry
                    and Nashua to Manchester and Goffstown.
                  </p>
                  <a
                    href={PHONE_NH.href}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold tabular-nums text-accent-600 hover:text-accent-700"
                  >
                    <IconPhone className="h-4 w-4" />
                    {PHONE_NH.display}
                  </a>
                </div>
                <div className="rounded-2xl border border-mist-200 bg-white p-6">
                  <h3 className="text-base font-bold text-navy-900">Massachusetts — {maTowns.length} towns</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
                    The Merrimack Valley towns closest to Salem — Methuen,
                    Lawrence, Andover, Haverhill and Lowell — plus the ring of
                    towns behind them. Massachusetts enquiries go to a separate
                    line.
                  </p>
                  <a
                    href={PHONE_MA.href}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold tabular-nums text-accent-600 hover:text-accent-700"
                  >
                    <IconPhone className="h-4 w-4" />
                    {PHONE_MA.display}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Town pages */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading
            eyebrow="Town pages"
            title="Local detail, town by town"
            lede="We are building a page for each town with what we actually see on roofs there. Three are live; the rest follow as the business grows."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {townPages.map((t, i) => (
              <Reveal key={t.slug} delay={i * 60}>
                <Link
                  href={`/service-areas/${t.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white transition hover:border-navy-200 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={asset(t.image)}
                      alt={t.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 24rem"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-accent-600">
                      {t.county} · {t.zip}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-navy-900">
                      {t.town}, {t.state}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-500">
                      {t.localNotes[0].title} · {t.localNotes[1].title}
                    </p>
                    <span className="mt-5 text-sm font-bold text-navy-600 transition group-hover:text-navy-900">
                      Roofing in {t.town} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full searchable list */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading
            eyebrow="Full service area"
            title="Every town we cover"
            lede="Search or filter the list. Towns with a pin have their own page."
          />
          <div className="mt-8">
            <AreaExplorer />
          </div>

          <div className="mt-10 rounded-2xl border border-mist-200 bg-mist-50 p-6 sm:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">Growing</h3>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-charcoal-500">
              This is where we are starting, not where we plan to stop. New
              towns are added as the company grows — and because many
              estimates can be done remotely, being just outside the list
              does not always mean we cannot help.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy-900">
              <IconPin className="h-4 w-4 shrink-0 text-accent-600" />
              Just outside the list? Call anyway — we will give you a straight answer.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
