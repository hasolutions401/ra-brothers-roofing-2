import { SiteLink as Link } from "@/components/site-link";
import { notFound } from "next/navigation";
import { townPageBySlug, townPages, townPageFor } from "@/lib/areas";
import { services } from "@/lib/services";
import { faqs } from "@/lib/content";
import { phoneFor } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/sections";
import { FaqList } from "@/components/faq-list";
import { ArrowLink, Button, SectionHeading } from "@/components/ui";
import { IconArrow, IconPhone, IconPin, ServiceIcon } from "@/components/icons";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return townPages.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const t = townPageBySlug(slug);
  if (!t) return {};
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: `/service-areas/${t.slug}/` });
}

export default async function TownPage({ params }: Params) {
  const { slug } = await params;
  const town = townPageBySlug(slug);
  if (!town) notFound();

  const phone = phoneFor(town.state);
  const others = townPages.filter((t) => t.slug !== town.slug);
  // Town-specific questions first, then the three general ones that apply everywhere.
  const townFaqs = [...town.faqs, ...faqs.slice(0, 3)];

  return (
    <>
      <PageHero
        image={town.image}
        phone={phone}
        eyebrow={`${town.county} · ${town.zip}`}
        crumbs={[
          { href: "/service-areas", label: "Service Areas" },
          { href: `/service-areas/${town.slug}`, label: `${town.town}, ${town.state}` },
        ]}
        title={town.heading}
        lede={`Roof replacement, repair, storm damage and insurance claims, with free estimates, in ${town.town} and the surrounding ${town.state === "NH" ? "Southern New Hampshire" : "Merrimack Valley"} towns.`}
        aside={
          <div className="rounded-2xl border border-white/25 bg-navy-950/40 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">{phone.region} line</p>
            <a
              href={phone.href}
              className="mt-2 flex items-center gap-2.5 whitespace-nowrap text-2xl font-extrabold tabular-nums tracking-tight text-white transition hover:text-accent-300 sm:text-3xl"
            >
              <IconPhone className="h-6 w-6 text-accent-400" />
              {phone.display}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-navy-100">
              Calls from {town.town} are answered on this number during business hours.
            </p>
          </div>
        }
      />

      {/* Local body copy */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                Roofing in {town.town}
              </h2>
              <div className="mt-5 space-y-5">
                {town.body.map((p, i) => (
                  <p
                    key={i}
                    className={`max-w-[64ch] leading-relaxed ${i === 0 ? "text-lg text-charcoal-900" : "text-base text-charcoal-500"}`}
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {/* The form at the bottom of this page already has this town chosen. */}
                <Button href="#estimate-bottom" size="lg" arrow>
                  Free estimate in {town.town}
                </Button>
                <Button href={phone.href} size="lg" variant="outline">
                  <IconPhone className="h-5 w-5 text-accent-600" />
                  <span className="tabular-nums">{phone.display}</span>
                </Button>
              </div>
            </div>

            <aside className="space-y-8 self-start">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">Around {town.town}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal-700">{town.landmarks.join(" · ")}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">Nearby towns we cover</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {town.nearby.map((n) => {
                    const page = townPageFor(n);
                    return (
                      <li key={n}>
                        {page ? (
                          <Link
                            href={`/service-areas/${page.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 px-3 py-1.5 text-sm font-semibold text-navy-700 transition hover:border-navy-600 hover:bg-navy-50"
                          >
                            <IconPin className="h-3.5 w-3.5 text-accent-600" />
                            {n}
                          </Link>
                        ) : (
                          <span className="inline-block py-1.5 pr-2 text-sm text-charcoal-700">{n}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <ArrowLink href="/service-areas" className="mt-4">
                  See the full service area
                </ArrowLink>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">Other town pages</h3>
                <ul className="mt-3 space-y-2">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/service-areas/${o.slug}`}
                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700"
                      >
                        Roofing in {o.town}, {o.state}
                        <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Local roof conditions */}
      <section className="bg-navy-900">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading
            tone="light"
            title={`What wears roofs out in ${town.town}`}
            lede="Every town has its own mix of weather, housing stock and tree cover. These are the three things we look at first here."
          />
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {town.localNotes.map((n) => (
              <div key={n.title} className="border-t-2 border-accent-500 pt-5">
                <h3 className="text-lg font-bold text-white">{n.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services in this town */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading title={`What we do in ${town.town}`} />
          <ul className="mt-8 grid gap-x-10 border-t border-mist-200 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-mist-200">
                <Link href={`/services/${s.slug}`} className="group flex items-center gap-4 py-4">
                  <ServiceIcon name={s.icon} className="h-6 w-6 shrink-0 text-accent-600" />
                  <span className="flex-1">
                    <span className="block font-semibold text-navy-900 group-hover:text-accent-600">{s.name}</span>
                    <span className="block text-sm text-charcoal-500">{s.short}</span>
                  </span>
                  <IconArrow className="h-5 w-5 shrink-0 text-mist-300 transition group-hover:translate-x-1 group-hover:text-accent-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading title={`Roofing in ${town.town}, answered`} />
            </div>
            <FaqList items={townFaqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title={`Free roof estimate in ${town.town}`}
        initialTown={`${town.town}, ${town.state}`}
        lede={`Call ${phone.display} during business hours, or start the form and we will call you back within one business day.`}
      />
    </>
  );
}
