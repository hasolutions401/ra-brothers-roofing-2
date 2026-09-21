import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { asset, DEMO_MODE, PHONE_MA, PHONE_NH, site, type Phone } from "@/lib/site";
import { EstimateForm } from "./estimate-form";
import { IconPhone } from "./icons";
import { Eyebrow } from "./ui";

/**
 * Full-screen photo banner at the top of every inner page, as on the live
 * site. Without an aside the copy is centred; with one (phone cards on the
 * area pages) the copy sits left and the aside sits right.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  aside,
  image,
  phone = PHONE_NH,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: { href: string; label: string }[];
  aside?: ReactNode;
  /** A /public/images path. Stock photography — never captioned as our work. */
  image: string;
  /** The line the hero's call button dials. */
  phone?: Phone;
}) {
  const centred = !aside;

  return (
    <section className="page-hero relative isolate flex items-center overflow-hidden bg-navy-950">
      <Image src={asset(image)} alt="" fill priority sizes="100vw" className="object-cover" />
      {/* Dark layer so white text stays readable. 0.6 is the lightest that keeps 4.5:1 on any photo. */}
      <div
        className={`absolute inset-0 ${centred ? "bg-navy-950/60" : "bg-navy-950/65 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-950/80 lg:via-navy-950/65 lg:to-navy-950/60"}`}
        aria-hidden="true"
      />

      <div
        className={`wrap relative py-16 text-white ${
          centred
            ? "max-w-4xl text-center"
            : "lg:grid lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-center lg:gap-12"
        }`}
      >
        <div>
          {crumbs && (
            <nav aria-label="Breadcrumb" className="text-sm text-navy-100">
              <ol className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${centred ? "justify-center" : ""}`}>
                <li>
                  <Link href="/" className="underline underline-offset-4 hover:text-white">
                    Home
                  </Link>
                </li>
                {crumbs.map((c, i) => {
                  const last = i === crumbs.length - 1;
                  return (
                    <li key={c.href} className="flex items-center gap-3">
                      <span aria-hidden="true">/</span>
                      {last ? (
                        <span aria-current="page" className="text-white">
                          {c.label}
                        </span>
                      ) : (
                        <Link href={c.href} className="underline underline-offset-4 hover:text-white">
                          {c.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          <Eyebrow tone="light" className="mt-6">
            {eyebrow}
          </Eyebrow>
          <h1
            className={`mt-3 font-extrabold leading-[1.1] tracking-tight ${
              centred ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl"
            }`}
          >
            {title}
          </h1>
          {lede && (
            <p
              className={`mt-5 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg ${centred ? "mx-auto" : ""}`}
            >
              {lede}
            </p>
          )}

          <div className={`mt-8 flex flex-wrap gap-3 ${centred ? "justify-center" : ""}`}>
            <Link
              href={site.primaryCta.href}
              className="rounded-xl bg-accent-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-accent-600"
            >
              {site.primaryCta.label}
            </Link>
            <a
              href={phone.href}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3.5 text-sm font-bold transition hover:bg-white/10"
            >
              <IconPhone className="h-4 w-4 text-accent-400" />
              Call {phone.display}
            </a>
          </div>
        </div>

        {aside && <div className="mt-10 lg:mt-0">{aside}</div>}
      </div>
    </section>
  );
}

/** Phone card on navy — used in the CTA band and the area-page heroes. */
export function PhoneCard({ phone }: { phone: Phone }) {
  return (
    <a
      href={phone.href}
      className="block rounded-xl border border-white/25 bg-white/5 px-5 py-4 backdrop-blur-sm transition hover:bg-white/10"
    >
      <span className="block text-xs font-semibold uppercase tracking-wider text-accent-400">
        {phone.region}
      </span>
      <span className="mt-1 block whitespace-nowrap text-lg font-extrabold tabular-nums text-white">
        {phone.display}
      </span>
    </a>
  );
}

/** Closing conversion band with the multi-step form. Every page ends with it. */
export function CtaBand({
  title = "Get your free roof estimate",
  lede = "Call during business hours to talk through what you are seeing, or start the form — we call back within one business day. Many estimates can be done from photos, without a visit.",
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section id="estimate-bottom" className="scroll-mt-24 bg-navy-800">
      <div className="wrap py-14 lg:grid lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-12 lg:py-20">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-navy-100">{lede}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:max-w-lg">
            {[PHONE_NH, PHONE_MA].map((p) => (
              <PhoneCard key={p.state} phone={p} />
            ))}
          </div>

          {DEMO_MODE && <p className="mt-7 text-xs text-navy-200">{site.hoursNote}</p>}
          <dl className="mt-3 space-y-1.5 text-sm text-navy-200 lg:max-w-lg">
            {site.hours.map((h) => (
              <div key={h.day} className="flex justify-between gap-4 border-b border-navy-700 pb-1.5">
                <dt>{h.day}</dt>
                <dd className="text-navy-100">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-9 lg:mt-0">
          <EstimateForm />
        </div>
      </div>
    </section>
  );
}

/** Small honesty panel — turned into a selling point rather than a caveat. */
export function StraightAnswer() {
  return (
    <div className="rounded-2xl border border-mist-200 bg-mist-50 p-6 sm:p-7">
      <Eyebrow tone="accent" className="mb-2">
        Straight answer
      </Eyebrow>
      <p className="max-w-[64ch] text-sm leading-relaxed text-charcoal-500 sm:text-base">
        <strong className="font-semibold text-navy-900">
          We are a new company,
        </strong>{" "}
        and we would rather say that plainly than borrow someone else&apos;s
        reviews. What we will give you is a free estimate, an itemised written
        quote, a straight recommendation — including telling you when your roof
        does not need replacing yet — and a satisfaction guarantee on the work.
      </p>
    </div>
  );
}
