import { SiteLink as Link } from "@/components/site-link";
import { notFound } from "next/navigation";
import { serviceBySlug, services } from "@/lib/services";
import { townPages, townCount } from "@/lib/areas";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/sections";
import { IconArrow, IconCheck, IconPin, ServiceIcon } from "@/components/icons";
import { ArrowLink, Button } from "@/components/ui";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return pageMetadata({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}/` });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        image={service.image}
        crumbs={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.name },
        ]}
        title={service.name}
        lede={service.blurb}
      />

      {/* Intro, scope and signals */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <div>
              <p className="max-w-[62ch] text-lg leading-relaxed text-charcoal-900">{service.intro}</p>

              <h2 className="mt-12 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                What the job covers
              </h2>
              <ul className="mt-6 grid gap-x-8 border-t border-mist-200 sm:grid-cols-2">
                {service.includes.map((inc) => (
                  <li
                    key={inc}
                    className="flex items-start gap-3 border-b border-mist-200 py-3.5 text-sm leading-relaxed text-charcoal-700 sm:text-base"
                  >
                    <IconCheck className="mt-1 h-4 w-4 shrink-0 text-accent-600" />
                    {inc}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="self-start rounded-2xl bg-mist-50 p-6 ring-1 ring-mist-200 sm:p-8 lg:sticky lg:top-28">
              <h2 className="text-xl font-bold text-navy-900">Signs this is the right call</h2>
              <ul className="mt-4 space-y-3">
                {service.signals.map((sig) => (
                  <li key={sig} className="flex items-start gap-3 text-sm leading-relaxed text-charcoal-700 sm:text-base">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                    {sig}
                  </li>
                ))}
              </ul>
              <Button href={site.primaryCta.href} arrow className="mt-7 w-full sm:w-auto">
                {site.primaryCta.label}
              </Button>
            </aside>
          </div>
        </div>
      </section>

      {/* Where + other services */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                {service.name} across {townCount} towns
              </h2>
              <p className="mt-3 max-w-[54ch] text-base leading-relaxed text-charcoal-500">
                Southern New Hampshire is the core of our service area, with the
                Northern Massachusetts towns closest to Salem covered by the same
                crew.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {townPages.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/service-areas/${t.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3.5 py-2 text-sm font-semibold text-navy-700 transition hover:border-navy-600 hover:bg-navy-50"
                  >
                    <IconPin className="h-3.5 w-3.5 text-accent-600" />
                    {t.town}, {t.state}
                  </Link>
                ))}
              </div>
              <ArrowLink href="/service-areas" className="mt-5">
                Search all {townCount} towns
              </ArrowLink>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                Other roofing services
              </h2>
              <ul className="mt-6 divide-y divide-mist-200 border-y border-mist-200">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/services/${o.slug}`} className="group flex items-center gap-4 py-3.5">
                      <ServiceIcon name={o.icon} className="h-6 w-6 shrink-0 text-accent-600" />
                      <span className="flex-1 font-semibold text-navy-900 group-hover:text-accent-600">{o.name}</span>
                      <IconArrow className="h-5 w-5 shrink-0 text-mist-300 transition group-hover:translate-x-1 group-hover:text-accent-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title={service.cta}
        initialService={service.name}
        lede="Call during business hours, or start the form and we will call you back within one business day. Many estimates need no visit."
      />
    </>
  );
}
