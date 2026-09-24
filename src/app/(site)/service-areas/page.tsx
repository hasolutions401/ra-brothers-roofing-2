import { ResponsiveImage as Image } from "@/components/responsive-image";
import { SiteLink as Link } from "@/components/site-link";
import { states, townCount, townPages } from "@/lib/areas";
import { asset, site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero, PhoneCard, CtaBand } from "@/components/sections";
import { AreaExplorer } from "@/components/area-explorer";
import { SectionHeading } from "@/components/ui";
import { IconArrow, IconPhone } from "@/components/icons";

export const metadata = pageMetadata({
  title: "Service Areas in Southern NH & MA",
  description: `Roofing across ${townCount} towns in Southern New Hampshire and Northern Massachusetts, centered on Salem NH. Roof replacement, repair, storm damage and inspections.`,
  path: "/service-areas/",
});

const coverage = {
  NH: "Our primary market, running from the Massachusetts border up the I-93 and Route 3 corridors through Derry, Londonderry and Nashua to Manchester and Goffstown.",
  MA: "The Merrimack Valley towns closest to Salem, including Methuen, Lawrence, Andover, Haverhill and Lowell, plus the ring of towns behind them.",
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        image="/images/aerial-winter"
        crumbs={[{ href: "/service-areas", label: "Service Areas" }]}
        title={`${townCount} towns across Southern NH and Northern MA`}
        lede="We are based in Salem, New Hampshire, and cover the Southern NH corridor and the Massachusetts towns closest to the line. Many estimates are done from photos, so wherever you are on this list you will not wait long for a price."
        aside={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {site.phones.map((p) => (
              <PhoneCard key={p.state} phone={p} />
            ))}
          </div>
        }
      />

      {/* How coverage works */}
      <section className="bg-white">
        <div className="wrap py-14 lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 lg:py-20">
          <SectionHeading
            title="Two states, two phone lines"
            lede="Call the line for the state you are in and you reach the person who schedules that side of the border."
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-0">
            {states.map((st) => (
              <div key={st.code} className="border-t-2 border-navy-900 pt-5">
                <h3 className="text-xl font-bold text-navy-900">
                  {st.name} <span className="font-sans text-base font-semibold text-charcoal-500">· {st.towns.length} towns</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{coverage[st.code]}</p>
                <a
                  href={st.phone.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold tabular-nums text-accent-600 hover:text-accent-700"
                >
                  <IconPhone className="h-4 w-4" />
                  {st.phone.display}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Town pages */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading
            title="Local detail, town by town"
            lede="Roofing considerations for Salem, Windham and Methuen, including roof layouts, tree cover and questions to ask before work starts."
          />

          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {townPages.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/service-areas/${t.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white transition hover:border-navy-200 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={asset(t.image)}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 24rem, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold text-charcoal-500">
                      {t.county} · {t.zip}
                    </p>
                    <h3 className="mt-1.5 text-xl font-bold text-navy-900">
                      {t.town}, {t.state}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-500">
                      {t.localNotes.map((n) => n.title).join(" · ")}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-600">
                      Roofing in {t.town}
                      <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Full searchable list */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading
            title="Every town we cover"
            lede="Search or filter the list. Towns with a pin have their own page."
          />
          <div className="mt-8">
            <AreaExplorer />
          </div>
          <p className="mt-8 max-w-[70ch] text-sm leading-relaxed text-charcoal-500">
            This is where we are starting, not where we plan to stop. Because
            many estimates can be done remotely, being just outside the list
            does not always mean we cannot help, so call and ask.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
