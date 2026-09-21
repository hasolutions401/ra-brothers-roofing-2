import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { townPageBySlug, townPages, townPageFor } from "@/lib/areas";
import { services } from "@/lib/services";
import { faqs } from "@/lib/content";
import { asset, phoneFor } from "@/lib/site";
import { PageHero, CtaBand, StraightAnswer } from "@/components/sections";
import { FaqList } from "@/components/faq-list";
import { Reveal } from "@/components/reveal";
import { ArrowLink, Button, Eyebrow, SectionHeading } from "@/components/ui";
import { IconArrow, IconPhone, IconPin, IconTile, ServiceIcon } from "@/components/icons";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return townPages.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = townPageBySlug(slug);
  if (!t) return {};
  return { title: t.metaTitle, description: t.metaDescription };
}

export default async function TownPage({ params }: Params) {
  const { slug } = await params;
  const town = townPageBySlug(slug);
  if (!town) notFound();

  const phone = phoneFor(town.state);
  const others = townPages.filter((t) => t.slug !== town.slug);

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
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
              {town.state === "NH" ? "New Hampshire line" : "Massachusetts line"}
            </p>
            <a
              href={phone.href}
              className="mt-2 flex items-center gap-2.5 whitespace-nowrap text-2xl font-extrabold tabular-nums tracking-tight text-white transition hover:text-accent-300 sm:text-3xl"
            >
              <IconPhone className="h-6 w-6 text-accent-400" />
              {phone.display}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-navy-100">
              Calls from {town.town} are answered on this number during
              business hours.
            </p>
          </div>
        }
      />

      {/* Local body copy */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <div>
              <Eyebrow tone="accent" className="mb-4">
                Roofing in {town.town}
              </Eyebrow>
              <div className="space-y-5">
                {town.body.map((p, i) => (
                  <p
                    key={i}
                    className={`max-w-[64ch] leading-relaxed ${
                      i === 0 ? "text-lg text-charcoal-900" : "text-base text-charcoal-500"
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/free-estimate" size="lg" arrow>
                  Free inspection in {town.town}
                </Button>
                <a
                  href={phone.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-navy-200 px-5 py-3.5 text-base font-bold text-navy-900 transition hover:border-navy-400 hover:bg-mist-50"
                >
                  <IconPhone className="h-5 w-5 text-accent-600" />
                  <span className="tabular-nums">{phone.display}</span>
                </a>
              </div>
            </div>

            <Reveal>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={asset(town.image)}
                  alt={town.imageAlt}
                  width={1000}
                  height={1250}
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  className="h-72 w-full object-cover object-[center_32%] sm:h-96 lg:h-[30rem]"
                />
              </div>
              <div className="mt-4 rounded-2xl border border-mist-200 bg-mist-50 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  Areas we cover in {town.town}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{town.landmarks.join(" · ")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Local roof conditions */}
      <section className="bg-navy-900">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading
            tone="light"
            eyebrow="Local conditions"
            title={`What takes roofs apart in ${town.town}`}
            lede="Every town has its own combination of weather, housing stock and tree cover. These are the three things we look at first here."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {town.localNotes.map((n, i) => (
              <Reveal key={n.title} delay={i * 60} className="rounded-2xl bg-navy-800 p-6 ring-1 ring-white/10 sm:p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-base font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{n.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{n.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services in this town */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading eyebrow="Services" title={`What we do in ${town.town}`} />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex flex-col rounded-2xl border border-mist-200 bg-white p-5 transition hover:border-navy-200 hover:shadow-lg"
              >
                <IconTile size="sm">
                  <ServiceIcon name={s.icon} />
                </IconTile>
                <h3 className="mt-4 text-base font-bold text-navy-900">{s.name}</h3>
                <p className="mt-1 flex-1 text-sm text-charcoal-500">
                  in {town.town}, {town.state}
                </p>
                <IconArrow className="mt-4 h-4 w-4 text-navy-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent-600" />
              </Link>
            ))}

            {/* Fills the last cell of the grid */}
            <div className="flex flex-col justify-center rounded-2xl bg-navy-900 p-5">
              <p className="text-base font-bold text-white">Somewhere else in {town.town}?</p>
              <p className="mt-2 text-sm leading-relaxed text-navy-200">
                If it is roofing and it is in {town.town}, we do it.
              </p>
              <a
                href={phone.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold tabular-nums text-accent-400 hover:text-accent-300"
              >
                <IconPhone className="h-4 w-4" />
                {phone.display}
              </a>
            </div>
          </div>

          <div className="mt-6">
            <StraightAnswer />
          </div>
        </div>
      </section>

      {/* Nearby + other town pages */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow tone="accent" className="mb-2">
                Nearby
              </Eyebrow>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                We also cover, right next door
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {town.nearby.map((n) => {
                  const page = townPageFor(n);
                  return (
                    <li key={n}>
                      {page ? (
                        <Link
                          href={`/service-areas/${page.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 px-3.5 py-2 text-sm font-semibold text-navy-700 transition hover:border-navy-600 hover:bg-navy-50"
                        >
                          <IconPin className="h-3.5 w-3.5 text-accent-600" />
                          {n}
                        </Link>
                      ) : (
                        <span className="inline-flex items-center rounded-lg bg-mist-100 px-3.5 py-2 text-sm text-charcoal-500">
                          {n}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <ArrowLink href="/service-areas" className="mt-6">
                See the full service area
              </ArrowLink>
            </div>

            <div>
              <Eyebrow tone="accent" className="mb-2">
                Other town pages
              </Eyebrow>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                More local pages
              </h2>
              <ul className="mt-6 grid gap-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/service-areas/${o.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-mist-200 bg-white p-5 transition hover:border-navy-200 hover:shadow-lg"
                    >
                      <span>
                        <span className="block text-base font-bold text-navy-900">
                          Roofing in {o.town}, {o.state}
                        </span>
                        <span className="mt-0.5 block text-sm text-charcoal-500">{o.county}</span>
                      </span>
                      <IconArrow className="h-5 w-5 shrink-0 text-navy-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading eyebrow="Questions" title={`Roofing in ${town.town}, answered`} />
            </div>
            <FaqList items={faqs.slice(0, 6)} />
          </div>
        </div>
      </section>

      <CtaBand
        title={`Free roof inspection in ${town.town}`}
        lede={`Call ${phone.display} during business hours, or start the form — we call back within one business day.`}
      />
    </>
  );
}
