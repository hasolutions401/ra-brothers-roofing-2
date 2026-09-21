import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceBySlug, services } from "@/lib/services";
import { townPages, townCount } from "@/lib/areas";
import { processSteps } from "@/lib/content";
import { asset } from "@/lib/site";
import { PageHero, CtaBand, StraightAnswer } from "@/components/sections";
import { IconArrow, IconCheck, IconPin, IconTile, ServiceIcon } from "@/components/icons";
import { ArrowLink, Button, Eyebrow, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        image={service.image}
        eyebrow="Roofing service"
        crumbs={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.name },
        ]}
        title={service.name}
        lede={service.blurb}
      />

      {/* Intro + image */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div>
              <IconTile>
                <ServiceIcon name={service.icon} />
              </IconTile>
              <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-charcoal-700">{service.intro}</p>
              <div className="mt-8">
                <StraightAnswer />
              </div>
            </div>
            <Reveal className="overflow-hidden rounded-2xl">
              <Image
                src={asset(service.image)}
                alt={service.imageAlt}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 32rem, 100vw"
                className="h-64 w-full object-cover sm:h-80 lg:h-full lg:min-h-[26rem]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Included + signals */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionHeading eyebrow="Included" title="What the job covers" />
              <ul className="mt-8 grid gap-3">
                {service.includes.map((inc, i) => (
                  <li
                    key={inc}
                    className="flex items-start gap-4 rounded-2xl border border-mist-200 bg-white px-5 py-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-extrabold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm leading-relaxed text-charcoal-700 sm:text-base">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading eyebrow="When you need it" title="Signs this is the right call" />
              <ul className="mt-8 grid gap-3">
                {service.signals.map((sig) => (
                  <li
                    key={sig}
                    className="flex items-start gap-3 rounded-2xl border border-mist-200 bg-white px-5 py-4"
                  >
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                    <span className="text-sm leading-relaxed text-charcoal-700 sm:text-base">{sig}</span>
                  </li>
                ))}
              </ul>
              <Button href="/free-estimate" size="lg" arrow className="mt-7">
                Get this quoted
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process recap */}
      <section className="bg-navy-900">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading tone="light" eyebrow="How it runs" title="From the first call to the final sweep" />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <li key={step.n} className="rounded-2xl bg-navy-800 p-6 ring-1 ring-white/10">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-base font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Where + other services */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow tone="accent" className="mb-2">
                Where we do it
              </Eyebrow>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                {service.name} across {townCount} towns
              </h2>
              <p className="mt-3 max-w-[54ch] text-base leading-relaxed text-charcoal-500">
                Southern New Hampshire is the core of our service area, with
                the Northern Massachusetts towns closest to Salem covered from
                the same crew.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
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
                  All towns →
                </Link>
              </div>
            </div>

            <div>
              <Eyebrow tone="accent" className="mb-2">
                Also available
              </Eyebrow>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                Other roofing services
              </h2>
              <ul className="mt-6 grid gap-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/services/${o.slug}`}
                      className="group flex items-center gap-4 rounded-2xl border border-mist-200 bg-white p-4 transition hover:border-navy-200 hover:shadow-lg"
                    >
                      <IconTile size="sm">
                        <ServiceIcon name={o.icon} />
                      </IconTile>
                      <span className="flex-1">
                        <span className="block text-base font-bold text-navy-900">{o.name}</span>
                        <span className="mt-0.5 block text-sm leading-snug text-charcoal-500">
                          {o.blurb.split(" — ")[0]}
                        </span>
                      </span>
                      <IconArrow className="h-5 w-5 shrink-0 text-navy-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent-600" />
                    </Link>
                  </li>
                ))}
              </ul>
              <ArrowLink href="/services" className="mt-5">
                All roofing services
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title={`Get ${service.name.toLowerCase()} quoted`}
        lede="Call during business hours, or start the form — we call back within one business day, and many estimates need no visit."
      />
    </>
  );
}
