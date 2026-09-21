import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { coreTowns, townCount, townPages } from "@/lib/areas";
import { differentiators, faqs, processSteps, warningSigns } from "@/lib/content";
import { PHONE_NH } from "@/lib/site";
import { Button, Eyebrow, SectionHeading } from "@/components/ui";
import { ServiceIcon, IconArrow, IconCheck, IconPhone, IconPin } from "@/components/icons";
import { QuickForm } from "@/components/quick-form";
import { FaqList } from "@/components/faq-list";
import { Reveal } from "@/components/reveal";
import { CtaBand, StraightAnswer } from "@/components/sections";

export default function HomePage() {
  const [first, ...rest] = services;

  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative isolate min-h-[min(92vh,880px)] overflow-hidden bg-navy-950 pb-16 pt-[120px] md:pb-24 md:pt-[168px]">
        <Image
          src="/images/hero-roofer.jpg"
          alt="Roofer working on an asphalt shingle roof under a clear sky"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[72%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(7,19,34,0.97)_0%,rgba(7,19,34,0.9)_30%,rgba(7,19,34,0.58)_50%,rgba(7,19,34,0.2)_78%,rgba(7,19,34,0.12)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-950 to-transparent"
        />

        <div className="wrap relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_400px] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-9 shrink-0 bg-copper-500" aria-hidden="true" />
                <Eyebrow tone="light">
                  Southern NH &amp; Northern MA
                </Eyebrow>
              </div>

              <h1 className="mt-7 max-w-[15ch] text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[1.02] text-white">
                Roofing built for a New England winter.
              </h1>

              <p className="mt-7 max-w-xl text-[16.5px] leading-[1.75] text-white/70">
                Ice dams, nor&apos;easter wind and twenty freeze-thaw cycles a
                year are what actually take roofs apart around here. We install
                and repair asphalt shingle roofs for that climate — and we tell
                you straight whether yours needs replacing or just fixing.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href="/free-estimate" size="lg" arrow>
                  Get a Free Roof Inspection
                </Button>
                <a
                  href={PHONE_NH.href}
                  className="inline-flex h-[52px] items-center gap-2.5 rounded-[3px] border border-white/28 px-6 font-display text-[14.5px] font-bold text-white transition-colors hover:border-white/65 hover:bg-white/10"
                >
                  <IconPhone className="h-[18px] w-[18px]" />
                  <span className="tabular-nums">{PHONE_NH.display}</span>
                </a>
              </div>

              {/* Factual trust strip — nothing here is a claim we cannot back */}
              <ul className="mt-12 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-4 border-t border-white/12 pt-7 sm:grid-cols-4">
                {[
                  ["Free", "inspections"],
                  ["Written", "itemised quotes"],
                  [`${townCount} towns`, "NH & MA"],
                  ["Residential", "& commercial"],
                ].map(([big, small]) => (
                  <li key={big}>
                    <p className="font-display text-[15px] font-extrabold leading-tight text-white">
                      {big}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-tight text-white/45">
                      {small}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:justify-self-end">
              <QuickForm />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Services */}
      <section className="bg-white py-20 md:py-28">
        <div className="wrap">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="What we do"
              title={
                <>
                  Roofing services for homes
                  <br className="hidden sm:block" /> and businesses
                </>
              }
              lede="Roofing is the whole business — not a sideline behind siding and windows. If your roof needs a nail or a full tear-off, that is the conversation we are set up to have."
            />
            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center gap-2 font-display text-[13.5px] font-bold text-ink"
            >
              <span className="link-underline">All services</span>
              <IconArrow className="h-4 w-4 text-copper-600 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[4px] border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
            {/* Featured card spans two columns on large screens */}
            <Reveal className="relative bg-navy-900 p-8 md:p-10 lg:col-span-2">
              <div className="blueprint absolute inset-0 opacity-50" aria-hidden="true" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-6">
                  <ServiceIcon
                    name={first.icon}
                    className="h-9 w-9 text-copper-400"
                  />
                  <span className="font-display text-[12px] font-bold tabular-nums tracking-[0.18em] text-white/25">
                    01
                  </span>
                </div>
                <h3 className="mt-8 text-[26px] leading-tight text-white md:text-[30px]">
                  {first.name}
                </h3>
                <p className="mt-4 max-w-[46ch] text-[14.5px] leading-[1.75] text-white/60">
                  {first.blurb}
                </p>
                <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                  {first.includes.slice(0, 4).map((i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[13px] leading-snug text-white/70"
                    >
                      <IconCheck className="mt-[3px] h-3.5 w-3.5 shrink-0 text-copper-400" />
                      {i}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${first.slug}`}
                  className="group mt-auto inline-flex items-center gap-2 pt-9 font-display text-[13.5px] font-bold text-white"
                >
                  <span className="link-underline">Roof replacement details</span>
                  <IconArrow className="h-4 w-4 text-copper-400 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            {rest.map((s, i) => (
              <Reveal
                key={s.slug}
                delay={i * 45}
                className="group relative bg-white p-8 transition-colors duration-300 hover:bg-paper"
              >
                <Link href={`/services/${s.slug}`} className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-6">
                    <ServiceIcon
                      name={s.icon}
                      className="h-8 w-8 text-copper-600"
                    />
                    <span className="font-display text-[12px] font-bold tabular-nums tracking-[0.18em] text-ink/20">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-7 text-[19px] leading-tight text-ink">
                    {s.name}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.7] text-stone-600">
                    {s.blurb}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-7 font-display text-[12.5px] font-bold text-copper-600">
                    Learn more
                    <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}

            {/* Fills the last grid cell rather than leaving a hole */}
            <Reveal className="flex flex-col justify-center bg-paper p-8">
              <p className="font-display text-[17px] font-bold leading-snug text-ink">
                Not sure which one you need?
              </p>
              <p className="mt-3 text-[13.5px] leading-[1.7] text-stone-600">
                That is what the inspection is for. We will look, photograph it
                and tell you which of these it actually is.
              </p>
              <Link
                href="/free-estimate"
                className="group mt-6 inline-flex items-center gap-2 font-display text-[12.5px] font-bold text-copper-600"
              >
                Book a free inspection
                <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <p className="mt-6 text-[12.5px] text-stone-500">
            Gutters and siding are not on the list yet. They can be added once
            the crew is confirmed to cover them.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- Process */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white md:py-28">
        <div className="blueprint absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="wrap relative">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <SectionHeading
                tone="light"
                eyebrow="How it works"
                title="Four steps, and no surprises in the middle"
                lede="The part homeowners dread is the unknown — the change order halfway through the job. Here is exactly how we run it."
              />

              <div className="mt-12 space-y-0">
                {processSteps.map((step, i) => (
                  <Reveal
                    key={step.n}
                    delay={i * 70}
                    className="relative flex gap-6 border-t border-white/12 py-7 last:border-b"
                  >
                    <span className="mt-0.5 font-display text-[13px] font-extrabold tabular-nums tracking-[0.16em] text-copper-400">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="text-[17px] leading-snug text-white">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-[54ch] text-[14px] leading-[1.75] text-white/55">
                        {step.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="relative lg:pt-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px]">
                <Image
                  src="/images/roofer-shingles.jpg"
                  alt="Roofer sealing a detail on an asphalt shingle roof"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden max-w-[300px] rounded-[3px] border border-white/12 bg-navy-900/95 p-6 backdrop-blur lg:block">
                <p className="eyebrow mb-3 text-copper-400">On the day</p>
                <p className="text-[13.5px] leading-[1.7] text-white/65">
                  Magnetic sweep of the drive and lawn before we leave, every
                  day — not just at the end of the job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Warning signs */}
      <section className="bg-paper py-20 md:py-28">
        <div className="wrap">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal className="relative">
              <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[4px]">
                <Image
                  src="/images/shingle-dark.jpg"
                  alt="Weathered asphalt shingles showing granule loss"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -right-4 -top-4 hidden rounded-[3px] bg-copper-600 px-5 py-4 md:block">
                <p className="font-display text-[26px] font-extrabold leading-none text-white">
                  18–25
                </p>
                <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-white/75">
                  typical years, asphalt
                </p>
              </div>
            </Reveal>

            <div>
              <SectionHeading
                eyebrow="Is it time?"
                title="Signs you may need a new roof"
                lede="Four or more of these usually means the roof is at the end of its life rather than in need of a patch. One or two is a repair conversation."
              />
              <ul className="mt-9 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {warningSigns.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <IconCheck className="mt-[3px] h-4 w-4 shrink-0 text-copper-600" />
                    <span className="text-[14px] leading-snug text-stone-700">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button href="/free-estimate" variant="dark" arrow>
                  Book a free inspection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Why us */}
      <section className="bg-white py-20 md:py-28">
        <div className="wrap">
          <SectionHeading
            eyebrow="Why RA Brothers"
            title="What you actually get from us"
          />

          <div className="mt-14 grid gap-px overflow-hidden rounded-[4px] border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {differentiators.map((d, i) => (
              <Reveal key={d.title} delay={i * 50} className="bg-white p-8 md:p-10">
                <span className="font-display text-[12px] font-bold tabular-nums tracking-[0.18em] text-copper-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-[19px] leading-snug text-ink">
                  {d.title}
                </h3>
                <p className="mt-3.5 max-w-[48ch] text-[14px] leading-[1.75] text-stone-600">
                  {d.text}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10">
            <StraightAnswer />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Service areas */}
      <section className="bg-paper py-20 md:py-28">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Where we work"
                title="Roofing on both sides of the state line"
                lede={`Salem is the centre of our service area, and we cover ${townCount} towns on both sides of the state line. Northern Massachusetts calls are answered on a separate line.`}
              />

              <div className="mt-9 flex flex-wrap gap-3">
                {townPages.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/service-areas/${t.slug}`}
                    className="group inline-flex items-center gap-2 rounded-[3px] border border-ink/14 bg-white px-4 py-3 font-display text-[13px] font-bold text-ink transition-colors hover:border-ink/40"
                  >
                    <IconPin className="h-[14px] w-[14px] text-copper-600" />
                    {t.town}, {t.state}
                  </Link>
                ))}
                <Link
                  href="/service-areas"
                  className="inline-flex items-center gap-2 rounded-[3px] border border-dashed border-ink/25 px-4 py-3 font-display text-[13px] font-bold text-stone-600 transition-colors hover:border-ink/50 hover:text-ink"
                >
                  All {townCount} towns
                  <IconArrow className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-10 border-t border-ink/10 pt-7">
                <Eyebrow className="mb-4">Core towns</Eyebrow>
                <p className="max-w-lg text-[13.5px] leading-[1.9] text-stone-600">
                  {coreTowns.map((t) => `${t.name}, ${t.state}`).join(" · ")}
                </p>
              </div>
            </div>

            <Reveal className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] lg:aspect-[5/4]">
                <Image
                  src="/images/aerial-neighborhood.jpg"
                  alt="Aerial view of a New England residential neighbourhood"
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-navy-950/55 to-transparent"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- FAQ */}
      <section className="bg-white py-20 md:py-28">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading
                eyebrow="Questions"
                title="Before you call"
                lede="The things people ask us most, answered properly rather than in one line."
              />
              <div className="mt-8">
                <Button href="/free-estimate" variant="outline" arrow>
                  Ask us something else
                </Button>
              </div>
            </div>
            <FaqList items={faqs} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
