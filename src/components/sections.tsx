import Link from "next/link";
import type { ReactNode } from "react";
import { DEMO_MODE, PHONE_MA, PHONE_NH, site } from "@/lib/site";
import { EstimateForm } from "./estimate-form";
import { Eyebrow } from "./ui";

/** Compact navy hero used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: { href: string; label: string }[];
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-16 pt-[128px] text-white md:pb-20 md:pt-[172px]">
      <div className="blueprint absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-navy-700/25 blur-[120px]"
      />
      <div className="wrap relative">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[12px] text-white/40">
              <li>
                <Link href="/" className="transition-colors hover:text-white/80">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <Link
                    href={c.href}
                    className="transition-colors hover:text-white/80"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          className={
            aside
              ? "grid items-end gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16"
              : ""
          }
        >
          <div className="max-w-3xl">
            <Eyebrow tone="light" className="mb-5">
              {eyebrow}
            </Eyebrow>
            <h1 className="text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-white">
              {title}
            </h1>
            {lede && (
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.75] text-white/60">
                {lede}
              </p>
            )}
          </div>
          {aside && <div>{aside}</div>}
        </div>
      </div>
    </section>
  );
}

/** Full-width conversion band with the multi-step form. */
export function CtaBand({
  title = "Get your free roof inspection",
  lede = "Call during business hours to talk through what you are seeing, or start the form and we will call you back to arrange a time.",
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 md:py-28">
      <div className="blueprint absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -left-40 -bottom-20 h-[480px] w-[480px] rounded-full bg-navy-600/20 blur-[130px]"
      />
      <div className="wrap relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.08] text-white">
              {title}
            </h2>
            <p className="mt-6 max-w-lg text-[15.5px] leading-[1.8] text-white/60">
              {lede}
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {[PHONE_NH, PHONE_MA].map((p) => (
                <a
                  key={p.state}
                  href={p.href}
                  className="group rounded-[3px] border border-white/15 bg-white/[0.04] px-5 py-5 transition-colors hover:border-white/40 hover:bg-white/[0.07]"
                >
                  <p className="eyebrow text-copper-400">{p.region}</p>
                  <p className="mt-2.5 whitespace-nowrap font-display text-[19px] font-extrabold tabular-nums tracking-[-0.02em] text-white sm:text-[22px]">
                    {p.display}
                  </p>
                </a>
              ))}
            </div>

            <div className="mt-10">
              <dl className="max-w-md">
                {site.hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3"
                  >
                    <dt className="text-[13.5px] text-white/70">{h.day}</dt>
                    <dd className="text-[13.5px] tabular-nums text-white/45">
                      {h.time}
                    </dd>
                  </div>
                ))}
              </dl>
              {DEMO_MODE && (
                <p className="mt-4 max-w-md text-[11.5px] leading-relaxed text-white/35">
                  {site.hoursNote}
                </p>
              )}
            </div>
          </div>

          <div>
            <EstimateForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Small honesty panel — turned into a selling point rather than a caveat. */
export function StraightAnswer() {
  return (
    <div className="rounded-[3px] border-l-2 border-copper-500 bg-paper px-6 py-6">
      <p className="eyebrow mb-3 text-copper-600">Straight answer</p>
      <p className="max-w-[64ch] text-[14.5px] leading-[1.8] text-stone-700">
        RA Brothers Roofing is a new company, and we would rather say that
        plainly than borrow someone else&apos;s reviews. What we will give you
        is a documented inspection, an itemised written quote, and a straight
        recommendation — including telling you when your roof does not need
        replacing yet.
      </p>
    </div>
  );
}
