import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { townPageBySlug, townPages, townPageFor } from "@/lib/areas";
import { services } from "@/lib/services";
import { faqs } from "@/lib/content";
import { phoneFor } from "@/lib/site";
import { PageHero, CtaBand, StraightAnswer } from "@/components/sections";
import { FaqList } from "@/components/faq-list";
import { Reveal } from "@/components/reveal";
import { Button, Eyebrow, SectionHeading } from "@/components/ui";
import { IconArrow, IconPhone, IconPin, ServiceIcon } from "@/components/icons";

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
        eyebrow={`${town.county} · ${town.zip}`}
        crumbs={[
          { href: "/service-areas", label: "Service Areas" },
          { href: `/service-areas/${town.slug}`, label: `${town.town}, ${town.state}` },
        ]}
        title={town.heading}
        lede={`Roof replacement, repair, storm damage work and free inspections in ${town.town} and the surrounding ${town.state === "NH" ? "Southern New Hampshire" : "Merrimack Valley"} towns.`}
        aside={
          <div className="rounded-[3px] border border-white/15 bg-white/[0.04] p-6">
            <p className="eyebrow text-copper-400">
              {town.state === "NH" ? "New Hampshire line" : "Massachusetts line"}
            </p>
            <a
              href={phone.href}
              className="mt-3 flex items-center gap-2.5 whitespace-nowrap font-display text-[22px] font-extrabold tabular-nums tracking-[-0.02em] text-white transition-colors hover:text-copper-400 sm:text-[26px]"
            >
              <IconPhone className="h-5 w-5 text-copper-400" />
              {phone.display}
            </a>
            <p className="mt-4 text-[12.5px] leading-relaxed text-white/45">
              Calls from {town.town} are answered on this number during
              business hours.
            </p>
          </div>
        }
      />

      {/* Local body copy */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <Eyebrow tone="accent" className="mb-5">
                Roofing in {town.town}
              </Eyebrow>
              <div className="space-y-6">
                {town.body.map((p, i) => (
                  <p
                    key={i}
                    className={`max-w-[64ch] leading-[1.8] text-stone-700 ${
                      i === 0 ? "text-[17px] text-ink" : "text-[15px]"
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href="/free-estimate" arrow>
                  Free inspection in {town.town}
                </Button>
                <a
                  href={phone.href}
                  className="inline-flex h-11 items-center gap-2 rounded-[3px] border border-ink/18 px-5 font-display text-[13.5px] font-bold text-ink transition-colors hover:border-ink/45"
                >
                  <IconPhone className="h-4 w-4" />
                  <span className="tabular-nums">{phone.display}</span>
                </a>
              </div>
            </div>

            <Reveal>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px]">
                <Image
                  src={town.image}
                  alt={town.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-[center_32%]"
                />
              </div>
              <div className="mt-5 rounded-[3px] border border-ink/10 bg-paper px-5 py-4">
                <Eyebrow className="mb-2.5">Areas we cover in {town.town}</Eyebrow>
                <p className="text-[13px] leading-[1.8] text-stone-600">
                  {town.landmarks.join(" · ")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Local roof conditions */}
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white md:py-24">
        <div className="blueprint absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="wrap relative">
          <SectionHeading
            tone="light"
            eyebrow="Local conditions"
            title={`What takes roofs apart in ${town.town}`}
            lede="Every town has its own combination of weather, housing stock and tree cover. These are the three things we look at first here."
          />

          <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] bg-white/10 md:grid-cols-3">
            {town.localNotes.map((n, i) => (
              <Reveal key={n.title} delay={i * 60} className="bg-navy-950 p-8">
                <span className="font-display text-[12px] font-bold tabular-nums tracking-[0.18em] text-copper-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-[17px] leading-snug text-white">
                  {n.title}
                </h3>
                <p className="mt-3.5 text-[13.5px] leading-[1.75] text-white/55">
                  {n.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services in this town */}
      <section className="bg-paper py-16 md:py-24">
        <div className="wrap">
          <SectionHeading
            eyebrow="Services"
            title={`What we do in ${town.town}`}
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group bg-white p-6 transition-colors hover:bg-paper"
              >
                <ServiceIcon name={s.icon} className="h-7 w-7 text-copper-600" />
                <h3 className="mt-5 font-display text-[14.5px] font-bold leading-snug text-ink">
                  {s.name}
                </h3>
                <p className="mt-2 text-[12.5px] leading-snug text-stone-500">
                  in {town.town}, {town.state}
                </p>
                <IconArrow className="mt-4 h-4 w-4 text-stone-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-copper-600" />
              </Link>
            ))}

            {/* Fills the last cell of the grid */}
            <div className="flex flex-col justify-center bg-navy-900 p-6">
              <p className="font-display text-[15px] font-bold leading-snug text-white">
                Somewhere else in {town.town}?
              </p>
              <p className="mt-2.5 text-[12.5px] leading-[1.6] text-white/55">
                If it is roofing and it is in {town.town}, we do it.
              </p>
              <a
                href={phone.href}
                className="mt-4 font-display text-[13px] font-extrabold tabular-nums text-copper-400"
              >
                {phone.display}
              </a>
            </div>
          </div>

          <div className="mt-10">
            <StraightAnswer />
          </div>
        </div>
      </section>

      {/* Nearby + other town pages */}
      <section className="bg-white py-16 md:py-20">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow tone="accent" className="mb-5">
                Nearby
              </Eyebrow>
              <h2 className="text-[24px] leading-tight text-ink">
                We also cover, right next door
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {town.nearby.map((n) => {
                  const page = townPageFor(n);
                  return (
                    <li key={n}>
                      {page ? (
                        <Link
                          href={`/service-areas/${page.slug}`}
                          className="inline-flex items-center gap-2 rounded-[3px] border border-ink/14 px-4 py-2.5 font-display text-[12.5px] font-bold text-ink transition-colors hover:border-ink/40"
                        >
                          <IconPin className="h-[13px] w-[13px] text-copper-600" />
                          {n}
                        </Link>
                      ) : (
                        <span className="inline-flex items-center rounded-[3px] border border-ink/10 bg-paper px-4 py-2.5 text-[12.5px] text-stone-600">
                          {n}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/service-areas"
                className="group mt-7 inline-flex items-center gap-2 font-display text-[13.5px] font-bold text-ink"
              >
                <span className="link-underline">See the full service area</span>
                <IconArrow className="h-4 w-4 text-copper-600 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div>
              <Eyebrow tone="accent" className="mb-5">
                Other town pages
              </Eyebrow>
              <ul>
                {others.map((o) => (
                  <li key={o.slug} className="border-t border-ink/10 last:border-b">
                    <Link
                      href={`/service-areas/${o.slug}`}
                      className="group flex items-center justify-between gap-4 py-5"
                    >
                      <span>
                        <span className="block font-display text-[15px] font-bold text-ink">
                          Roofing in {o.town}, {o.state}
                        </span>
                        <span className="mt-1 block text-[12.5px] text-stone-500">
                          {o.county}
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

      {/* FAQ */}
      <section className="bg-paper py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading
                eyebrow="Questions"
                title={`Roofing in ${town.town}, answered`}
              />
            </div>
            <FaqList items={faqs.slice(0, 6)} />
          </div>
        </div>
      </section>

      <CtaBand
        title={`Free roof inspection in ${town.town}`}
        lede={`Call ${phone.display} during business hours, or start the form and we will call you back to arrange a time.`}
      />
    </>
  );
}
