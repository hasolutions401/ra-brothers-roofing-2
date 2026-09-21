import type { Metadata } from "next";
import Image from "next/image";
import { asset, DEMO_MODE, PHONE_MA, PHONE_NH, site } from "@/lib/site";
import { processSteps } from "@/lib/content";
import { EstimateForm } from "@/components/estimate-form";
import { PhoneCard, StraightAnswer } from "@/components/sections";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { IconCheckCircle, IconClock } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Free Roof Inspection & Estimate",
  description:
    "Request a free roof estimate in Southern New Hampshire or Northern Massachusetts — often from photos, no visit needed. Call back within one business day, insurance claim help, satisfaction guarantee.",
};

const promises = [
  "Always free — for repairs as well as replacements",
  "Often done from your photos, with no visit needed",
  "A call back within one business day",
  "An itemised written estimate you can compare line for line",
  "Help with your insurance claim if it is storm damage",
  "Every job backed by a satisfaction guarantee",
];

export default function FreeEstimatePage() {
  return (
    <>
      <section className="page-hero relative isolate flex items-center overflow-hidden bg-navy-950">
        {/* Stock photo. Never captioned as our own work. */}
        <Image src={asset("/images/home-gray.jpg")} alt="" fill priority sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-0 bg-navy-950/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-950/85 lg:via-navy-950/70 lg:to-navy-950/45"
          aria-hidden="true"
        />

        <div className="wrap relative py-12 lg:grid lg:grid-cols-[1fr_minmax(0,32rem)] lg:items-start lg:gap-12 lg:py-16">
          <div className="lg:pt-4">
            <Eyebrow tone="light">Free estimate · no obligation</Eyebrow>

            <h1 className="mt-3 text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Find out what your roof
              <span className="block text-accent-400">actually needs</span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-100 sm:text-lg">
              Four short steps, and we call you back within one business
              day. Add a few photos and we can often price the job without a
              visit. Nothing here commits you to anything.
            </p>

            <ul className="mt-6 space-y-2.5">
              {promises.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-navy-100 sm:text-base">
                  <IconCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-lg">
              {[PHONE_NH, PHONE_MA].map((p) => (
                <PhoneCard key={p.state} phone={p} />
              ))}
            </div>

            <div className="mt-7 lg:max-w-lg">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-400">
                <IconClock className="h-4 w-4" />
                Business hours
              </p>
              <dl className="mt-3 space-y-1.5 text-sm text-navy-200">
                {site.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-4 border-b border-white/15 pb-1.5">
                    <dt>{h.day}</dt>
                    <dd className="text-navy-100">{h.time}</dd>
                  </div>
                ))}
              </dl>
              {DEMO_MODE && <p className="mt-3 text-xs text-navy-200">{site.hoursNote}</p>}
            </div>
          </div>

          <div className="mt-9 lg:mt-0">
            <EstimateForm />
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <SectionHeading
            eyebrow="After you send it"
            title="What happens next"
            lede="Here is the sequence from your enquiry to the finished job."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <Reveal
                key={s.n}
                as="li"
                delay={i * 55}
                className="rounded-2xl border border-mist-200 bg-white p-6 transition hover:border-navy-200 hover:shadow-lg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-base font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{s.text}</p>
              </Reveal>
            ))}
          </ol>

          <div className="mt-8">
            <StraightAnswer />
          </div>
        </div>
      </section>
    </>
  );
}
