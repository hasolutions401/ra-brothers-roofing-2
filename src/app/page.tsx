import { ResponsiveImage as Image } from "@/components/responsive-image";
import { SiteLink as Link } from "@/components/site-link";
import { services } from "@/lib/services";
import { coreTowns, states, townCount, townPages } from "@/lib/areas";
import { differentiators, faqs } from "@/lib/content";
import { asset, PHONE_NH, site } from "@/lib/site";
import { ArrowLink, Button, Eyebrow, SectionHeading } from "@/components/ui";
import { IconArrow, IconPhone, IconPin, ServiceIcon } from "@/components/icons";
import { QuickForm } from "@/components/quick-form";
import { FaqList } from "@/components/faq-list";
import { SignsChecklist } from "@/components/signs-checklist";
import { CtaBand, ProcessList, StraightAnswer } from "@/components/sections";

/*
 * The four promises the client has explicitly approved (free estimates,
 * one-business-day callback, insurance help, satisfaction guarantee).
 * Deliberately no licence numbers, certifications, warranties, ratings,
 * years in business or 24/7 claims — see the About page.
 */
const promises = [
  { title: "Free estimates", body: "For repairs too, and often from your photos with no visit." },
  { title: "Call back in one business day", body: "Call or send the form and you will hear from us." },
  { title: "Insurance claim help", body: "Storm damage documented and your adjuster met on site." },
  { title: "Satisfaction guarantee", body: "Not happy with the work? We come back and make it right." },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="page-hero relative isolate flex items-center overflow-hidden bg-navy-950">
        {/* Stock photo (see images-src/CREDITS.md). Never captioned as our own work. */}
        <Image
          src={asset("/images/roofer-tear-off")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[45%_center]"
        />
        {/*
          Dark layer so the white text stays readable. Full strength on phones;
          from lg up the form card covers the right side, so it eases off there.
        */}
        <div
          className="absolute inset-0 bg-navy-950/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-950/85 lg:via-navy-950/70 lg:to-navy-950/45"
          aria-hidden="true"
        />

        <div className="wrap relative py-12 lg:grid lg:grid-cols-[1fr_minmax(0,27rem)] lg:items-center lg:gap-12 lg:py-16">
          <div>
            <Eyebrow tone="light">Southern NH &amp; Northern MA</Eyebrow>

            <h1 className="mt-3 max-w-[16ch] text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Roofing built for a New England winter.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-navy-100 sm:text-lg">
              Ice dams, nor&apos;easter wind and months of freeze and thaw are
              what wear roofs out around here. We install and repair asphalt
              shingle roofs for that climate, and we tell you whether yours needs
              replacing or just a repair.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href={site.primaryCta.href} size="lg" arrow>
                {site.primaryCta.label}
              </Button>
              <Button href={PHONE_NH.href} size="lg" variant="outlineLight">
                <IconPhone className="h-5 w-5 text-accent-400" />
                <span className="tabular-nums">Call {PHONE_NH.display}</span>
              </Button>
            </div>
          </div>

          {/* The form. On phones it stacks under the headline. */}
          <div className="mt-9 lg:mt-0">
            <QuickForm />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Promises */}
      <section aria-label="What every customer gets" className="border-b border-mist-200 bg-mist-50">
        <ul className="wrap grid grid-cols-1 gap-x-8 gap-y-5 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:py-10">
          {promises.map((p) => (
            <li key={p.title} className="border-l-2 border-accent-500 pl-4">
              <p className="font-display text-base font-bold text-navy-900">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-charcoal-500">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------ Services */}
      <section id="services" className="scroll-mt-24 bg-white">
        <div className="wrap py-14 lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 lg:py-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              title="Roofing is the whole business"
              lede="Not a sideline behind siding and windows. Whether your roof needs one nail or a full tear-off, that is the conversation we are set up to have."
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-charcoal-500">
              Not sure which of these you need? That is what the free estimate
              is for: we look, photograph it and tell you.
            </p>
            <ArrowLink href="/services" className="mt-5">
              All roofing services
            </ArrowLink>
          </div>

          <ul className="mt-10 divide-y divide-mist-200 border-y border-mist-200 lg:mt-0">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex items-start gap-4 py-5 transition sm:gap-5"
                >
                  <ServiceIcon name={s.icon} className="mt-0.5 h-7 w-7 shrink-0 text-accent-600" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-bold text-navy-900 group-hover:text-accent-600">
                      {s.name}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-charcoal-500">{s.blurb}</span>
                  </span>
                  <IconArrow className="mt-1.5 h-5 w-5 shrink-0 text-mist-300 transition group-hover:translate-x-1 group-hover:text-accent-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------- Process */}
      <section className="bg-navy-900">
        <div className="wrap py-14 lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 lg:py-20">
          <SectionHeading
            tone="light"
            title="Four steps, and no surprises in the middle"
            lede="The part homeowners dread is the unknown: the change order halfway through the job. This is how we run it instead."
          />
          <div className="mt-10 lg:mt-0">
            <ProcessList />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Warning signs */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start lg:gap-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[4/5]">
              <Image
                src={asset("/images/gutter-rain")}
                alt="Rain running off the edge of an asphalt shingle roof"
                fill
                sizes="(min-width: 1024px) 26rem, 100vw"
                className="object-cover"
              />
            </div>

            <div className="mt-8 lg:mt-0">
              <SectionHeading
                title="Is it time for a new roof?"
                lede="Age is only part of the picture. Tick what you have noticed so you can describe it when you call. An inspection can establish the cause and extent of the problem."
              />
              <div className="mt-6">
                <SignsChecklist />
              </div>
              <Button href={site.primaryCta.href} size="lg" className="mt-6">
                {site.primaryCta.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Why us */}
      <section className="bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading title="What you get from us" />

          <div className="mt-9 grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:mt-12">
            {differentiators.map((d) => (
              <div key={d.title} className="border-t-2 border-navy-900 pt-5">
                <h3 className="text-xl font-bold text-navy-900">{d.title}</h3>
                <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-charcoal-500 sm:text-base">{d.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <StraightAnswer />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Service areas */}
      <section id="service-areas" className="scroll-mt-24 bg-white">
        <div className="wrap py-14 lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 lg:py-20">
          <div>
            <SectionHeading
              title="Both sides of the state line"
              lede={`Salem is the centre of our service area, and we cover ${townCount} towns across Southern New Hampshire and Northern Massachusetts. Each state has its own phone line.`}
            />
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
            </div>
            <ArrowLink href="/service-areas" className="mt-5">
              Search all {townCount} towns
            </ArrowLink>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-0">
            {states.map((st) => (
              <div key={st.code} className="border-t-2 border-navy-900 pt-5">
                <h3 className="text-xl font-bold text-navy-900">{st.name}</h3>
                <a
                  href={st.phone.href}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold tabular-nums text-accent-600 hover:text-accent-700"
                >
                  <IconPhone className="h-4 w-4" />
                  {st.phone.display}
                </a>
                <p className="mt-4 text-sm leading-7 text-charcoal-700">
                  {coreTowns
                    .filter((t) => t.state === st.code)
                    .map((t) => t.name)
                    .join(" · ")}
                </p>
                <p className="mt-2 text-sm text-charcoal-500">
                  and {st.towns.length - coreTowns.filter((t) => t.state === st.code).length} more towns
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- FAQ */}
      <section id="faq" className="scroll-mt-24 bg-mist-50">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading title="Before you call" lede="The questions homeowners ask us most." />
              <p className="mt-6 text-sm text-charcoal-500">Something else on your mind?</p>
              <Button href={PHONE_NH.href} variant="outline" className="mt-3">
                <IconPhone className="h-4 w-4 text-accent-600" />
                <span className="tabular-nums">Call {PHONE_NH.display}</span>
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
