import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { services } from "@/lib/services";
import { coreTowns, townCount, townPages } from "@/lib/areas";
import { differentiators, faqs, processSteps, warningSigns } from "@/lib/content";
import { asset, PHONE_NH, site } from "@/lib/site";
import { ArrowLink, Button, Eyebrow, SectionHeading } from "@/components/ui";
import {
  IconCheck,
  IconClock,
  IconDocument,
  IconEye,
  IconHome,
  IconPhone,
  IconPin,
  IconTile,
  ServiceIcon,
} from "@/components/icons";
import { QuickForm } from "@/components/quick-form";
import { FaqList } from "@/components/faq-list";
import { Reveal } from "@/components/reveal";
import { CtaBand, StraightAnswer } from "@/components/sections";

/*
 * Trust strip: only promises the client has explicitly approved (free
 * estimates, one-business-day callback, insurance help, satisfaction
 * guarantee). Deliberately no licence numbers, certifications, warranties,
 * ratings, years in business or 24/7 claims — see the About page.
 */
const trust: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Free estimates",
    body: "For repairs too — often from photos, no visit needed.",
    icon: <IconEye />,
  },
  {
    title: "Call back in 1 business day",
    body: "Call or send the form and we get back to you fast.",
    icon: <IconClock />,
  },
  {
    title: "Insurance claim help",
    body: "Storm damage documented and your adjuster met on site.",
    icon: <IconDocument />,
  },
  {
    title: "Satisfaction guarantee",
    body: "Not happy with the work? We make it right.",
    icon: <IconHome />,
  },
];

export default function HomePage() {
  const [first, ...rest] = services;

  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="page-hero relative isolate flex items-center overflow-hidden bg-navy-950">
        {/* Stock photo (see public/images/CREDITS.md). Never captioned as our own work. */}
        <Image
          src={asset("/images/hero-roofer.jpg")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center]"
        />
        {/*
          Dark layer so the white text stays readable. Full strength on phones;
          from lg up the form card covers the right side, so it fades out there.
        */}
        <div
          className="absolute inset-0 bg-navy-950/65 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-950/80 lg:via-navy-950/65 lg:to-navy-950/35"
          aria-hidden="true"
        />

        <div className="wrap relative py-12 lg:grid lg:grid-cols-[1fr_minmax(0,27rem)] lg:items-center lg:gap-12 lg:py-16">
          <div>
            <Eyebrow tone="light">Southern NH &amp; Northern MA</Eyebrow>

            <h1 className="mt-3 text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Roofing built for
              <span className="block text-accent-400">a New England winter.</span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-100 sm:text-lg">
              Ice dams, nor&apos;easter wind and twenty freeze-thaw cycles a
              year are what actually take roofs apart around here. We install
              and repair asphalt shingle roofs for that climate — and we tell
              you straight whether yours needs replacing or just fixing.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href="/free-estimate" size="lg" arrow>
                Get a Free Roof Inspection
              </Button>
              <a
                href={PHONE_NH.href}
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/25 px-5 py-3.5 text-base font-bold text-white transition hover:bg-white/10"
              >
                <IconPhone className="h-5 w-5 text-accent-400" />
                <span className="tabular-nums">Call {PHONE_NH.display}</span>
              </a>
            </div>
            <p className="mt-4 text-sm font-medium text-navy-100">
              Free estimates · {site.callback}
            </p>
          </div>

          {/* The form. On phones it stacks under the headline. */}
          <div className="mt-9 lg:mt-0">
            <QuickForm />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Trust strip */}
      <section className="border-b border-mist-200 bg-mist-50">
        <div className="wrap grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-12">
          {trust.map((item) => (
            <div key={item.title} className="flex gap-3.5">
              <IconTile size="sm">
                {item.icon}
              </IconTile>
              <div>
                <h3 className="text-sm font-bold text-navy-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-charcoal-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ Services */}
      <section id="services" className="scroll-mt-24 bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="What we do"
              title="Roofing services for homes and businesses"
              lede="Roofing is the whole business — not a sideline behind siding and windows. If your roof needs a nail or a full tear-off, that is the conversation we are set up to have."
            />
            <ArrowLink href="/services" className="shrink-0">
              All services
            </ArrowLink>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {/* Featured card spans two columns on large screens */}
            <Reveal className="flex flex-col rounded-2xl bg-navy-900 p-6 sm:col-span-2 sm:p-8">
              <IconTile tone="glass">
                <ServiceIcon name={first.icon} />
              </IconTile>
              <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-white">{first.name}</h3>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-navy-100 sm:text-base">
                {first.blurb}
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {first.includes.slice(0, 4).map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-snug text-navy-100">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                    {i}
                  </li>
                ))}
              </ul>
              <ArrowLink href={`/services/${first.slug}`} tone="light" className="mt-auto pt-7">
                Roof replacement details
              </ArrowLink>
            </Reveal>

            {rest.map((s, i) => (
              <Reveal
                key={s.slug}
                delay={i * 45}
                as="article"
                className="group relative flex flex-col rounded-2xl border border-mist-200 bg-white p-6 transition hover:border-navy-200 hover:shadow-lg"
              >
                <IconTile>
                  <ServiceIcon name={s.icon} />
                </IconTile>
                <h3 className="mt-4 text-lg font-bold text-navy-900">
                  <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0 after:rounded-2xl">
                    {s.name}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-500">{s.blurb}</p>
                <span className="mt-4 text-sm font-bold text-navy-600 transition group-hover:text-navy-900">
                  Learn more →
                </span>
              </Reveal>
            ))}

            {/* Fills the last grid cell rather than leaving a hole */}
            <Reveal className="flex flex-col justify-center rounded-2xl border border-mist-200 bg-mist-50 p-6">
              <p className="text-lg font-bold text-navy-900">Not sure which one you need?</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
                That is what the inspection is for. We will look, photograph it
                and tell you which of these it actually is.
              </p>
              <ArrowLink href="/free-estimate" className="mt-4">
                Book a free inspection
              </ArrowLink>
            </Reveal>
          </div>

          <p className="mt-8 rounded-xl bg-mist-50 p-4 text-sm leading-relaxed text-charcoal-500">
            <strong className="font-semibold text-navy-900">Gutters and siding</strong> are
            not on the list yet. They can be added once the crew is confirmed to
            cover them.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- Process */}
      <section className="bg-navy-900">
        <div className="wrap py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-12">
            <div>
              <SectionHeading
                tone="light"
                eyebrow="How it works"
                title="Four steps, and no surprises in the middle"
                lede="The part homeowners dread is the unknown — the change order halfway through the job. Here is exactly how we run it."
              />

              <ol className="mt-9 space-y-7">
                {processSteps.map((step, i) => (
                  <Reveal key={step.n} as="li" delay={i * 70} className="relative flex gap-4 sm:gap-5">
                    {/* Connector line between the numbers, hidden on the last item. */}
                    {i < processSteps.length - 1 && (
                      <span
                        className="absolute left-5 top-12 h-[calc(100%+0.5rem)] w-px bg-navy-700 sm:left-6"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500 text-base font-extrabold text-white sm:h-12 sm:w-12 sm:text-lg">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-base font-bold text-white sm:text-lg">{step.title}</h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-navy-200 sm:text-base">
                        {step.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            {/* Stock photo. Not captioned as our own project. */}
            <div className="relative mt-10 lg:mt-14">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={asset("/images/roofer-shingles.jpg")}
                  alt="Roofer sealing a detail on an asphalt shingle roof"
                  width={1200}
                  height={1500}
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  className="h-64 w-full object-cover sm:h-80 lg:h-[30rem]"
                />
              </div>
              <div className="mt-4 rounded-2xl bg-navy-800 p-5 ring-1 ring-white/10 lg:absolute lg:-bottom-6 lg:-left-8 lg:mt-0 lg:max-w-[17rem] lg:shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-400">On the day</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-100">
                  Magnetic sweep of the drive and lawn before we leave, every
                  day — not just at the end of the job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Warning signs */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-14">
            <Reveal className="relative">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={asset("/images/shingle-dark.jpg")}
                  alt="Weathered asphalt shingles showing granule loss"
                  width={1200}
                  height={960}
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="h-56 w-full object-cover sm:h-80 lg:h-[26rem]"
                />
              </div>
              <div className="absolute right-4 top-4 rounded-xl bg-accent-500 px-4 py-3 shadow-lg">
                <p className="text-2xl font-extrabold leading-none text-white">18–25</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/85">
                  typical years, asphalt
                </p>
              </div>
            </Reveal>

            <div className="mt-8 lg:mt-0">
              <SectionHeading
                eyebrow="Is it time?"
                title="Signs you may need a new roof"
                lede="Four or more of these usually means the roof is at the end of its life rather than in need of a patch. One or two is a repair conversation."
              />
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {warningSigns.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal-700">
                    <IconCheck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent-600" />
                    {s}
                  </li>
                ))}
              </ul>
              <Button href="/free-estimate" size="lg" className="mt-7">
                Book a free inspection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Why us */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading eyebrow="Why choose us" title="What you actually get from us" />

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:mt-12">
            {differentiators.map((d, i) => (
              <Reveal
                key={d.title}
                delay={i * 50}
                className="rounded-2xl border border-mist-200 bg-white p-6 sm:p-8"
              >
                <IconTile className="text-lg font-extrabold">{i + 1}</IconTile>
                <h3 className="mt-4 text-lg font-bold text-navy-900">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500 sm:text-base">{d.text}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-6">
            <StraightAnswer />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Service areas */}
      <section id="service-areas" className="scroll-mt-24 bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
            <div>
              <SectionHeading
                eyebrow="Where we work"
                title="Roofing on both sides of the state line"
                lede={`Salem is the centre of our service area, and we cover ${townCount} towns on both sides of the state line. Northern Massachusetts calls are answered on a separate line.`}
              />

              <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-navy-900">Town pages</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {townPages.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/service-areas/${t.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 px-3.5 py-2 text-sm font-semibold text-navy-700 transition hover:border-navy-600 hover:bg-navy-50"
                  >
                    <IconPin className="h-3.5 w-3.5 text-accent-600" />
                    {t.town}, {t.state}
                  </Link>
                ))}
                <Link
                  href="/service-areas"
                  className="inline-flex items-center rounded-lg border border-dashed border-navy-200 px-3.5 py-2 text-sm font-semibold text-charcoal-500 transition hover:border-navy-600 hover:text-navy-900"
                >
                  All {townCount} towns →
                </Link>
              </div>
            </div>

            <Reveal className="mt-8 overflow-hidden rounded-2xl lg:mt-0">
              <Image
                src={asset("/images/aerial-neighborhood.jpg")}
                alt="Aerial view of a New England residential neighbourhood"
                width={1600}
                height={1200}
                sizes="(min-width: 1024px) 36rem, 100vw"
                className="h-52 w-full object-cover sm:h-72 lg:h-[22rem]"
              />
            </Reveal>
          </div>

          {/* The core area, given the visual weight. */}
          <div className="mt-8 rounded-2xl bg-navy-900 p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-lg font-bold text-white sm:text-xl">Core towns</h3>
              <span className="text-sm font-semibold text-accent-400">around Salem, NH</span>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {(["NH", "MA"] as const).map((state) => (
                <div key={state}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400">
                    {state === "NH" ? "New Hampshire" : "Massachusetts"}
                  </h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {coreTowns
                      .filter((t) => t.state === state)
                      .map((t) => (
                        <li
                          key={t.name}
                          className="rounded-lg bg-navy-800 px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          {t.name}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- FAQ */}
      <section id="faq" className="scroll-mt-24 bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Questions"
                title="Before you call"
                lede="The things people ask us most, answered properly rather than in one line."
              />
              <Button href="/free-estimate" variant="outline" arrow className="mt-7">
                Ask us something else
              </Button>
            </div>
            <FaqList items={faqs} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
