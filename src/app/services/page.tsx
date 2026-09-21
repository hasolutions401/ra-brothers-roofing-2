import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { townCount } from "@/lib/areas";
import { PageHero, CtaBand } from "@/components/sections";
import { Reveal } from "@/components/reveal";
import { IconArrow, IconCheck, ServiceIcon } from "@/components/icons";
import { Eyebrow, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Roofing Services",
  description:
    "Roof replacement, repair, new installation, storm damage, inspections, maintenance and commercial roofing across Southern New Hampshire and Northern Massachusetts.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
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
              className="border-b border-ink/8 py-16 md:py-20"
            >
              <div className="wrap">
                <div
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                    flipped ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[4px]">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-cover"
                    />
                    <span className="absolute left-0 top-0 bg-navy-950/85 px-4 py-2.5 font-display text-[11.5px] font-bold tabular-nums tracking-[0.2em] text-white backdrop-blur">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <ServiceIcon
                      name={s.icon}
                      className="h-9 w-9 text-copper-600"
                    />
                    <h2 className="mt-6 text-[clamp(1.5rem,2.6vw,2.05rem)] leading-tight text-ink">
                      {s.name}
                    </h2>
                    <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.8] text-stone-700">
                      {s.intro}
                    </p>

                    <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                      {s.includes.slice(0, 4).map((inc) => (
                        <li
                          key={inc}
                          className="flex items-start gap-2.5 text-[13.5px] leading-snug text-stone-600"
                        >
                          <IconCheck className="mt-[3px] h-3.5 w-3.5 shrink-0 text-copper-600" />
                          {inc}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${s.slug}`}
                      className="group mt-8 inline-flex items-center gap-2 font-display text-[13.5px] font-bold text-ink"
                    >
                      <span className="link-underline">
                        Everything included in {s.name.toLowerCase()}
                      </span>
                      <IconArrow className="h-4 w-4 text-copper-600 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      {/* Not offered yet — honest about scope */}
      <section className="bg-paper py-16 md:py-20">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <SectionHeading
              eyebrow="Scope"
              title="What we do not do — yet"
            />
            <div>
              <p className="max-w-[62ch] text-[15px] leading-[1.8] text-stone-700">
                Gutters and siding are the obvious next additions, and plenty
                of roofing companies list them from day one whether or not they
                have the crew. We would rather put them on the site the week we
                can actually do them properly.
              </p>
              <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.8] text-stone-700">
                If you need gutter or siding work alongside a roof, say so when
                you call — we will tell you honestly where that stands and, if
                we cannot help yet, point you at someone who can.
              </p>
              <div className="mt-8 border-t border-ink/10 pt-6">
                <Eyebrow className="mb-3">Currently offered</Eyebrow>
                <p className="text-[13.5px] leading-[1.9] text-stone-600">
                  {services.map((s) => s.name).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
