import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { differentiators } from "@/lib/content";
import { townCount } from "@/lib/areas";
import { services } from "@/lib/services";
import { PageHero, CtaBand } from "@/components/sections";
import { SectionHeading, Eyebrow, Button } from "@/components/ui";
import { IconArrow, IconCheck } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "RA Brothers Roofing is a roofing company serving Southern New Hampshire and Northern Massachusetts. How we work, what we cover, and what we will not claim.",
};

const principles = [
  {
    title: "We say what we know",
    text: "Nothing on this site claims an award, a certification, a customer or a year in business that we do not have. When the licensing, insurance and manufacturer certifications are finalised they will appear here — dated, and not a day before.",
  },
  {
    title: "The estimate is the contract",
    text: "What is written on the estimate is what gets done, at the price on the estimate. The one variable nobody can see in advance is the decking under your shingles, and that is priced per sheet up front so it cannot become a surprise.",
  },
  {
    title: "We work in a tight radius",
    text: `${townCount} towns, centred on Salem. Staying close is not a limitation, it is the whole point — it is what makes it possible to come back out the same week when something needs a second look.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        crumbs={[{ href: "/about", label: "About" }]}
        title="A roofing company, and nothing else"
        lede="RA Brothers Roofing is a new roofing business serving Southern New Hampshire and Northern Massachusetts. We are starting the way we intend to carry on: one trade, a tight service area, and quotes you can actually compare."
      />

      {/* Story */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <Eyebrow tone="accent" className="mb-5">
                Where we stand
              </Eyebrow>
              <p className="max-w-[62ch] text-[18px] leading-[1.7] text-ink">
                Most people only think about their roof twice: when they buy
                the house, and when water comes through the ceiling. In between
                it is the single most expensive thing on the building that
                nobody looks at.
              </p>
              <div className="mt-7 space-y-6">
                <p className="max-w-[64ch] text-[15px] leading-[1.8] text-stone-700">
                  We started RA Brothers Roofing because the gap between a good
                  roofing job and a bad one is almost entirely invisible from
                  the ground. Two crews can put the same shingle on the same
                  house for a similar price, and one roof lasts twenty-two years
                  while the other starts failing at eleven — because of what did
                  or did not happen underneath: the decking, the ice and water
                  shield, the flashing details, the ventilation.
                </p>
                <p className="max-w-[64ch] text-[15px] leading-[1.8] text-stone-700">
                  Our answer to that is documentation. Photographs of what we
                  find, an itemised scope of what we will do, and the per-sheet
                  price of decking replacement written down before anyone gets
                  on a ladder. You should be able to put our estimate next to
                  anyone else&apos;s and see exactly where they differ.
                </p>
                <p className="max-w-[64ch] text-[15px] leading-[1.8] text-stone-700">
                  We work across Southern New Hampshire and the Massachusetts
                  towns closest to Salem, on residential and commercial
                  properties, with residential the main focus while we grow.
                </p>
              </div>
            </div>

            <Reveal className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px]">
              <Image
                src="/images/roofer-safety.jpg"
                alt="Roofing crew member working in safety gear"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white md:py-24">
        <div className="blueprint absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="wrap relative">
          <SectionHeading
            tone="light"
            eyebrow="How we operate"
            title="Three things we hold to"
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] bg-white/10 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 60} className="bg-navy-950 p-8 md:p-9">
                <span className="font-display text-[12px] font-bold tabular-nums tracking-[0.18em] text-copper-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-[18px] leading-snug text-white">
                  {p.title}
                </h3>
                <p className="mt-4 text-[13.5px] leading-[1.8] text-white/55">
                  {p.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-paper py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Working with us"
                title="What you actually get"
              />
              <div className="mt-8">
                <Button href="/free-estimate" variant="dark" arrow>
                  Book a free inspection
                </Button>
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[4px] border border-ink/10 bg-ink/10 sm:grid-cols-2">
              {differentiators.map((d, i) => (
                <Reveal key={d.title} delay={i * 50} className="bg-white p-7">
                  <IconCheck className="h-5 w-5 text-copper-600" />
                  <h3 className="mt-4 text-[16.5px] leading-snug text-ink">
                    {d.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.75] text-stone-600">
                    {d.text}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still to come — honest roadmap */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="In progress"
                title="What is not on this site yet"
                lede="Rather than leave these blank, here is exactly where they stand. Each one goes up the day it is real."
              />
            </div>
            <ul className="space-y-0">
              {[
                ["Licensing & insurance", "Being finalised. Certificates will be listed here and available on request."],
                ["Manufacturer certifications", "Not yet held. We will not display a manufacturer badge we have not earned."],
                ["Customer reviews", "None yet — this is a new company. Real reviews from real customers only, once there are some."],
                ["Project photography", "The photographs on this site are stock. They will be replaced with our own completed work."],
                ["Workmanship warranty", "Terms are still being decided. It will be published in full once it is."],
                ["Financing", "Under consideration. Nothing is being offered until the terms are confirmed."],
              ].map(([title, text]) => (
                <li
                  key={title}
                  className="flex flex-col gap-2 border-t border-ink/10 py-5 last:border-b sm:flex-row sm:gap-8"
                >
                  <span className="shrink-0 font-display text-[14px] font-bold text-ink sm:w-[200px]">
                    {title}
                  </span>
                  <span className="text-[13.5px] leading-[1.7] text-stone-600">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="bg-paper py-14">
        <div className="wrap">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Eyebrow tone="accent" className="mb-3">
                Services
              </Eyebrow>
              <p className="max-w-3xl text-[14px] leading-[1.9] text-stone-600">
                {services.map((s) => s.name).join(" · ")}
              </p>
            </div>
            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center gap-2 font-display text-[13.5px] font-bold text-ink"
            >
              <span className="link-underline">See all services</span>
              <IconArrow className="h-4 w-4 text-copper-600 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
