import type { Metadata } from "next";
import Image from "next/image";
import { DEMO_MODE, PHONE_MA, PHONE_NH, site } from "@/lib/site";
import { processSteps } from "@/lib/content";
import { townCount } from "@/lib/areas";
import { EstimateForm } from "@/components/estimate-form";
import { StraightAnswer } from "@/components/sections";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { IconCheck, IconClock, IconPhone } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Free Roof Inspection & Estimate",
  description:
    "Request a free roof inspection and written estimate in Southern New Hampshire or Northern Massachusetts. No obligation, itemised pricing, photographs of anything we flag.",
};

const promises = [
  "A documented inspection with photographs of anything we flag",
  "An itemised written estimate you can compare line for line",
  "The per-sheet cost of replacement decking, before we start",
  "A straight recommendation — including when to do nothing",
];

export default function FreeEstimatePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950 pb-20 pt-[128px] text-white md:pb-28 md:pt-[176px]">
        <Image
          src="/images/home-gray.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-30"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(7,19,34,0.97)_0%,rgba(7,19,34,0.93)_45%,rgba(7,19,34,0.8)_100%)]"
        />
        <div className="blueprint absolute inset-0 -z-10 opacity-50" aria-hidden="true" />

        <div className="wrap relative">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-9 shrink-0 bg-copper-500" aria-hidden="true" />
                <Eyebrow tone="light">Free inspection · no obligation</Eyebrow>
              </div>

              <h1 className="mt-7 max-w-[16ch] text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.05] text-white">
                Find out what your roof actually needs
              </h1>

              <p className="mt-6 max-w-xl text-[16px] leading-[1.8] text-white/65">
                Four short questions and we will call you back to arrange a
                time. Nothing on this page commits you to anything — plenty of
                the roofs we look at turn out to be fine.
              </p>

              <ul className="mt-9 space-y-3.5">
                {promises.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <IconCheck className="mt-[3px] h-4 w-4 shrink-0 text-copper-400" />
                    <span className="text-[14.5px] leading-snug text-white/75">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-11 grid gap-3 sm:grid-cols-2">
                {[PHONE_NH, PHONE_MA].map((p) => (
                  <a
                    key={p.state}
                    href={p.href}
                    className="rounded-[3px] border border-white/15 bg-white/[0.04] px-5 py-5 transition-colors hover:border-white/40 hover:bg-white/[0.07]"
                  >
                    <p className="eyebrow text-copper-400">{p.region}</p>
                    <p className="mt-2.5 flex items-center gap-2 whitespace-nowrap font-display text-[19px] font-extrabold tabular-nums tracking-[-0.02em] text-white xl:text-[21px]">
                      <IconPhone className="h-[18px] w-[18px] text-white/40" />
                      {p.display}
                    </p>
                  </a>
                ))}
              </div>

              <div className="mt-8 border-t border-white/12 pt-7">
                <div className="flex items-center gap-2.5">
                  <IconClock className="h-4 w-4 text-copper-400" />
                  <Eyebrow tone="light">Business hours</Eyebrow>
                </div>
                <dl className="mt-4 max-w-sm">
                  {site.hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5"
                    >
                      <dt className="text-[13.5px] text-white/70">{h.day}</dt>
                      <dd className="text-[13.5px] tabular-nums text-white/45">
                        {h.time}
                      </dd>
                    </div>
                  ))}
                </dl>
                {DEMO_MODE && (
                  <p className="mt-3.5 max-w-sm text-[11.5px] leading-relaxed text-white/35">
                    {site.hoursNote}
                  </p>
                )}
              </div>
            </div>

            <div className="lg:pt-2">
              <EstimateForm />
            </div>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <SectionHeading
            eyebrow="After you send it"
            title="What happens next"
            lede={`We cover ${townCount} towns, so the drive is rarely long. Here is the sequence from your enquiry to the finished job.`}
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 55} className="bg-white p-8">
                <span className="font-display text-[12px] font-bold tabular-nums tracking-[0.18em] text-copper-600">
                  {s.n}
                </span>
                <h3 className="mt-5 text-[16.5px] leading-snug text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-[1.75] text-stone-600">
                  {s.text}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <StraightAnswer />
          </div>
        </div>
      </section>
    </>
  );
}
