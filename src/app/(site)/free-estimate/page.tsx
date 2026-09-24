import { ResponsiveImage as Image } from "@/components/responsive-image";
import { asset, site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { EstimateForm } from "@/components/estimate-form";
import { PhoneCard, ProcessList } from "@/components/sections";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { IconCheckCircle, IconClock } from "@/components/icons";
import { BusinessHours, hoursLabel } from "@/components/business-hours";

export const metadata = pageMetadata({
  title: "Free Roof Estimate",
  description:
    "Request a free roof estimate in Southern New Hampshire or Northern Massachusetts, often from photos with no visit needed. Call back within one business day, insurance claim help, satisfaction guarantee.",
  path: "/free-estimate/",
});

const promises = [
  "Always free, for repairs as well as replacements",
  "Often done from your photos, with no visit needed",
  "A call back within one business day",
  "An itemized written estimate you can compare line for line",
  "Help with your insurance claim if it is storm damage",
  "Every job backed by a satisfaction guarantee",
];

export default function FreeEstimatePage() {
  return (
    <>
      <section className="page-hero relative isolate flex items-center overflow-hidden bg-navy-950">
        {/* Stock photo. Never captioned as our own work. */}
        <Image src={asset("/images/home-cape")} alt="" fill priority sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-0 bg-navy-950/75 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-950/85 lg:via-navy-950/75 lg:to-navy-950/50"
          aria-hidden="true"
        />

        <div className="wrap relative grid gap-8 py-10 lg:grid-cols-[1fr_minmax(0,32rem)] lg:items-start lg:gap-x-12 lg:gap-y-6 lg:py-16">
          <div className="lg:pt-4">
            <Eyebrow tone="light">Free estimate · no obligation</Eyebrow>

            <h1 className="mt-3 max-w-[15ch] text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Find out what your roof needs
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-100 sm:text-lg">
              Four short steps, and we call you back within one business day.
              Add a few photos and we can often price the job without a visit.
              Nothing here commits you to anything.
            </p>

          </div>
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <EstimateForm headingLevel={2} anchorId="estimate-form" />
          </div>
          <div className="lg:col-start-1 lg:row-start-2">
            <ul className="space-y-2.5">
              {promises.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-navy-100 sm:text-base">
                  <IconCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-lg">
              {site.phones.map((p) => (
                <PhoneCard key={p.state} phone={p} />
              ))}
            </div>

            <div className="mt-7 lg:max-w-lg">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent-400">
                <IconClock className="h-4 w-4" />
                {hoursLabel}
              </p>
              <BusinessHours className="mt-3 text-navy-200" />
            </div>
          </div>

        </div>
      </section>

      {/* What happens next */}
      <section className="bg-white">
        <div className="wrap py-14 lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 lg:py-20">
          <SectionHeading
            title="What happens next"
            lede="The sequence from your inquiry to the finished job."
          />
          <div className="mt-10 lg:mt-0">
            <ProcessList tone="light" />
          </div>
        </div>
      </section>
    </>
  );
}
