import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceBySlug, services } from "@/lib/services";
import { townPages, townCount } from "@/lib/areas";
import { processSteps } from "@/lib/content";
import { PageHero, CtaBand, StraightAnswer } from "@/components/sections";
import { IconArrow, IconCheck, IconPin, ServiceIcon } from "@/components/icons";
import { Button, Eyebrow, SectionHeading } from "@/components/ui";
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
        eyebrow="Roofing service"
        crumbs={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.name },
        ]}
        title={service.name}
        lede={service.blurb}
      />

      {/* Intro + image */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <ServiceIcon
                name={service.icon}
                className="h-10 w-10 text-copper-600"
              />
              <p className="mt-7 max-w-[62ch] text-[17px] leading-[1.75] text-ink">
                {service.intro}
              </p>
              <div className="mt-9">
                <StraightAnswer />
              </div>
            </div>
            <Reveal className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Included + signals */}
      <section className="bg-paper py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Included"
                title="What the job covers"
              />
              <ul className="mt-9 space-y-0">
                {service.includes.map((inc, i) => (
                  <li
                    key={inc}
                    className="flex items-start gap-4 border-t border-ink/10 py-4 last:border-b"
                  >
                    <span className="mt-0.5 font-display text-[11.5px] font-bold tabular-nums tracking-[0.16em] text-copper-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14.5px] leading-[1.6] text-stone-700">
                      {inc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading
                eyebrow="When you need it"
                title="Signs this is the right call"
              />
              <ul className="mt-9 grid gap-3">
                {service.signals.map((sig) => (
                  <li
                    key={sig}
                    className="flex items-start gap-3 rounded-[3px] border border-ink/10 bg-white px-5 py-4"
                  >
                    <IconCheck className="mt-[3px] h-4 w-4 shrink-0 text-copper-600" />
                    <span className="text-[14px] leading-snug text-stone-700">
                      {sig}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/free-estimate" variant="dark" arrow>
                  Get this quoted
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process recap */}
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white md:py-24">
        <div className="blueprint absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="wrap relative">
          <SectionHeading
            tone="light"
            eyebrow="How it runs"
            title="From the first call to the final sweep"
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div key={step.n} className="bg-navy-950 p-7">
                <span className="font-display text-[12px] font-bold tabular-nums tracking-[0.18em] text-copper-400">
                  {step.n}
                </span>
                <h3 className="mt-5 text-[16px] leading-snug text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.7] text-white/50">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where + other services */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow tone="accent" className="mb-5">
                Where we do it
              </Eyebrow>
              <h2 className="text-[26px] leading-tight text-ink">
                {service.name} across {townCount} towns
              </h2>
              <p className="mt-4 max-w-[54ch] text-[14.5px] leading-[1.8] text-stone-600">
                Southern New Hampshire is the core of our service area, with
                the Northern Massachusetts towns closest to Salem covered from
                the same crew.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {townPages.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/service-areas/${t.slug}`}
                    className="inline-flex items-center gap-2 rounded-[3px] border border-ink/14 px-4 py-2.5 font-display text-[12.5px] font-bold text-ink transition-colors hover:border-ink/40"
                  >
                    <IconPin className="h-[13px] w-[13px] text-copper-600" />
                    {t.town}, {t.state}
                  </Link>
                ))}
                <Link
                  href="/service-areas"
                  className="inline-flex items-center gap-2 rounded-[3px] border border-dashed border-ink/25 px-4 py-2.5 font-display text-[12.5px] font-bold text-stone-600 hover:border-ink/50 hover:text-ink"
                >
                  All towns
                  <IconArrow className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div>
              <Eyebrow tone="accent" className="mb-5">
                Also available
              </Eyebrow>
              <h2 className="text-[26px] leading-tight text-ink">
                Other roofing services
              </h2>
              <ul className="mt-7">
                {others.map((o) => (
                  <li key={o.slug} className="border-t border-ink/10 last:border-b">
                    <Link
                      href={`/services/${o.slug}`}
                      className="group flex items-center gap-4 py-5"
                    >
                      <ServiceIcon
                        name={o.icon}
                        className="h-6 w-6 shrink-0 text-copper-600"
                      />
                      <span className="flex-1">
                        <span className="block font-display text-[15px] font-bold text-ink">
                          {o.name}
                        </span>
                        <span className="mt-1 block text-[13px] leading-snug text-stone-500">
                          {o.blurb.split(" — ")[0]}
                        </span>
                      </span>
                      <IconArrow className="h-4 w-4 shrink-0 text-stone-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-copper-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title={`Get ${service.name.toLowerCase()} quoted`}
        lede="Call during business hours, or start the form and we will call you back to arrange the inspection."
      />
    </>
  );
}
