import { ResponsiveImage as Image } from "@/components/responsive-image";
import { services } from "@/lib/services";
import { townCount } from "@/lib/areas";
import { asset } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/sections";
import { IconCheck } from "@/components/icons";
import { ArrowLink } from "@/components/ui";

export const metadata = pageMetadata({
  title: "Roofing Services",
  description:
    "Roof replacement, repair, new installation, storm damage, inspections, maintenance and commercial roofing across Southern New Hampshire and Northern Massachusetts.",
  path: "/services/",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        image="/images/roof-inspection"
        crumbs={[{ href: "/services", label: "Services" }]}
        title="Roofing services for homes and businesses"
        lede={`Roofing is the whole business: seven services across ${townCount} towns in Southern New Hampshire and Northern Massachusetts, each with a free estimate.`}
      />

      {/* Alternating service rows — reads like a catalogue, not a card grid */}
      <div className="bg-white">
        {services.map((s, i) => {
          const flipped = i % 2 === 1;
          return (
            <section
              key={s.slug}
              aria-labelledby={`svc-${s.slug}`}
              className={`border-b border-mist-200 py-14 lg:py-20 ${flipped ? "bg-mist-50" : "bg-white"}`}
            >
              <div className="wrap">
                <div
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                    flipped ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
                    <Image
                      src={asset(s.image)}
                      alt={s.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 34rem, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h2 id={`svc-${s.slug}`} className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                      {s.name}
                    </h2>
                    <p className="mt-3 max-w-[58ch] text-base leading-relaxed text-charcoal-500">{s.intro}</p>

                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {s.includes.slice(0, 4).map((inc) => (
                        <li key={inc} className="flex items-start gap-2.5 text-sm leading-snug text-charcoal-700">
                          <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                          {inc}
                        </li>
                      ))}
                    </ul>

                    <ArrowLink href={`/services/${s.slug}`} className="mt-7">
                      Everything included
                    </ArrowLink>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        <div className="wrap py-10">
          <p className="max-w-[70ch] text-sm leading-relaxed text-charcoal-500">
            We focus on roofing. If you need gutter or siding work alongside a
            roof, mention it when you call and we will point you to someone
            who does it well.
          </p>
        </div>
      </div>

      <CtaBand />
    </>
  );
}
