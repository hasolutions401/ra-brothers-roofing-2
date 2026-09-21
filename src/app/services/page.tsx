import type { Metadata } from "next";
import Image from "next/image";
import { services } from "@/lib/services";
import { townCount } from "@/lib/areas";
import { asset } from "@/lib/site";
import { PageHero, CtaBand } from "@/components/sections";
import { Reveal } from "@/components/reveal";
import { IconCheck, IconTile, ServiceIcon } from "@/components/icons";
import { ArrowLink, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Roofing Services",
  description:
    "Roof replacement, repair, new installation, storm damage, inspections, maintenance and commercial roofing across Southern New Hampshire and Northern Massachusetts.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        image="/images/roofer-shingles.jpg"
        eyebrow="What we do"
        crumbs={[{ href: "/services", label: "Services" }]}
        title="Roofing services for homes and businesses"
        lede={`Roofing is the whole business. Seven services, ${townCount} towns, and one person who stays on your job from the inspection through to the final clean-up.`}
      />

      {/* Alternating service rows — reads like a catalogue, not a card grid */}
      <section className="bg-white">
        {services.map((s, i) => {
          const flipped = i % 2 === 1;
          return (
            <Reveal
              key={s.slug}
              as="article"
              className={`border-b border-mist-200 py-14 lg:py-20 ${flipped ? "bg-mist-50" : "bg-white"}`}
            >
              <div className="wrap">
                <div
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                    flipped ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={asset(s.image)}
                      alt={s.imageAlt}
                      width={1200}
                      height={825}
                      sizes="(min-width: 1024px) 34rem, 100vw"
                      className="h-60 w-full object-cover sm:h-80 lg:h-[24rem]"
                    />
                    <span className="absolute left-4 top-4 rounded-lg bg-navy-900/85 px-3 py-1.5 text-xs font-bold tabular-nums tracking-wider text-white backdrop-blur">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <IconTile>
                      <ServiceIcon name={s.icon} />
                    </IconTile>
                    <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                      {s.name}
                    </h2>
                    <p className="mt-3 max-w-[58ch] text-base leading-relaxed text-charcoal-500">{s.intro}</p>

                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {s.includes.slice(0, 4).map((inc) => (
                        <li key={inc} className="flex items-start gap-2.5 text-sm leading-snug text-charcoal-700">
                          <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                          {inc}
                        </li>
                      ))}
                    </ul>

                    <ArrowLink href={`/services/${s.slug}`} className="mt-7">
                      Everything included in {s.name.toLowerCase()}
                    </ArrowLink>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      {/* Not offered yet — honest about scope */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
            <SectionHeading eyebrow="Scope" title="What we do not do — yet" />
            <div className="rounded-2xl border border-mist-200 bg-mist-50 p-6 sm:p-8">
              <p className="text-base leading-relaxed text-charcoal-500">
                Gutters and siding are the obvious next additions, and plenty
                of roofing companies list them from day one whether or not they
                have the crew. We would rather put them on the site the week we
                can actually do them properly.
              </p>
              <p className="mt-4 text-base leading-relaxed text-charcoal-500">
                If you need gutter or siding work alongside a roof, say so when
                you call — we will tell you honestly where that stands and, if
                we cannot help yet, point you at someone who can.
              </p>
              <div className="mt-6 border-t border-mist-200 pt-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">Currently offered</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {services.map((s) => (
                    <li
                      key={s.slug}
                      className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy-700"
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
