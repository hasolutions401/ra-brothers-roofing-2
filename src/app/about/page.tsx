import type { Metadata } from "next";
import Image from "next/image";
import { differentiators } from "@/lib/content";
import { services } from "@/lib/services";
import { asset } from "@/lib/site";
import { PageHero, CtaBand } from "@/components/sections";
import { ArrowLink, Button, Eyebrow, SectionHeading } from "@/components/ui";
import { IconCheck, IconTile } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "A group of friends who started a roofing company to give homeowners in Southern New Hampshire and Northern Massachusetts a fair price, a trusted service and a satisfaction guarantee.",
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
    title: "If you are not satisfied, we make it right",
    text: "Every job is backed by a satisfaction guarantee. If something about the work is not right, tell us and we will come back and put it right. That is the whole reason the company exists.",
  },
];

/*
 * Everything the business cannot claim yet, with where each item stands.
 * Add new pending items here rather than quietly leaving them off the site.
 */
const notYet = [
  ["Licensing & insurance", "Being finalised. Certificates will be listed here and available on request."],
  ["Manufacturer certifications", "Not yet held. We will not display a manufacturer badge we have not earned."],
  ["Customer reviews", "None yet — this is a new company. Real reviews from real customers only, once there are some."],
  ["Project photography", "The photographs on this site are stock. They will be replaced with our own completed work."],
  ["Satisfaction guarantee — written terms", "We offer it; the written terms (what it covers and for how long) will be published here before launch."],
  ["Workmanship warranty", "Separate from the guarantee. Length and terms are still being decided and will be published in full once they are."],
  ["Financing", "Under consideration. Nothing is being offered until the terms are confirmed."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/images/home-victorian.jpg"
        eyebrow="About us"
        crumbs={[{ href: "/about", label: "About" }]}
        title="Friends who wanted roofing done right"
        lede="We are a new roofing company serving Southern New Hampshire and Northern Massachusetts, started by a group of friends with one idea: people deserve a fair price, a service they can trust, and a guarantee that the job will be done right."
      />

      {/* Story */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div>
              <Eyebrow tone="accent" className="mb-4">
                Our story
              </Eyebrow>
              <p className="max-w-[62ch] text-lg leading-relaxed text-charcoal-900 sm:text-xl">
                We are friends first. Between us we had all heard the same
                stories — the quote that doubled halfway through the job, the
                roofer who stopped answering the phone, the homeowner who had no
                idea whether they had been treated fairly.
              </p>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-charcoal-500">
                <p className="max-w-[64ch]">
                  So we came together to build the roofing company we would
                  want to hire ourselves: honest about what a roof actually
                  needs, clear about what it costs before anything starts, and
                  quick to pick up the phone. A free estimate, a fair price in
                  writing, and a call back within one business day.
                </p>
                <p className="max-w-[64ch]">
                  And because trust has to be earned rather than claimed, every
                  job comes with a satisfaction guarantee. If you are not happy
                  with the work, we will make it right.
                </p>
                <p className="max-w-[64ch]">
                  We are starting in Southern New Hampshire and the
                  Massachusetts towns closest to Salem — residential first,
                  commercial too — and we plan to grow from here.
                </p>
              </div>
            </div>

            <Reveal className="overflow-hidden rounded-2xl">
              <Image
                src={asset("/images/roofer-safety.jpg")}
                alt="Roofing crew member working in safety gear"
                width={1000}
                height={1250}
                sizes="(min-width: 1024px) 30rem, 100vw"
                className="h-72 w-full object-cover sm:h-96 lg:h-full lg:min-h-[32rem]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-navy-900">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading tone="light" eyebrow="How we operate" title="Three things we hold to" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 60} className="rounded-2xl bg-navy-800 p-6 ring-1 ring-white/10 sm:p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-base font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14">
            <div>
              <SectionHeading eyebrow="Working with us" title="What you actually get" />
              <Button href="/free-estimate" size="lg" arrow className="mt-7">
                Book a free inspection
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {differentiators.map((d, i) => (
                <Reveal
                  key={d.title}
                  delay={i * 50}
                  className="rounded-2xl border border-mist-200 bg-white p-6"
                >
                  <IconTile size="sm">
                    <IconCheck />
                  </IconTile>
                  <h3 className="mt-4 text-base font-bold text-navy-900">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{d.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still to come — honest roadmap */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <SectionHeading
              eyebrow="In progress"
              title="What is not on this site yet"
              lede="Rather than leave these blank, here is exactly where they stand. Each one goes up the day it is real."
            />
            <ul className="divide-y divide-mist-200 rounded-2xl border border-mist-200 bg-white">
              {notYet.map(([title, text]) => (
                <li key={title} className="flex flex-col gap-1.5 p-5 sm:flex-row sm:gap-6">
                  <span className="shrink-0 text-sm font-bold text-navy-900 sm:w-48">{title}</span>
                  <span className="text-sm leading-relaxed text-charcoal-500">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="border-t border-mist-200 bg-mist-50">
        <div className="wrap py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">Services</h2>
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
            <ArrowLink href="/services" className="shrink-0">
              See all services
            </ArrowLink>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
