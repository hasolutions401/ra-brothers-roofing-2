import { ResponsiveImage as Image } from "./responsive-image";
import { SiteLink as Link } from "./site-link";
import type { ReactNode } from "react";
import { asset, PHONE_NH, site, type Phone } from "@/lib/site";
import { processSteps } from "@/lib/content";
import { EstimateForm } from "./estimate-form";
import { IconPhone } from "./icons";
import { Button, Eyebrow } from "./ui";
import { BusinessHours } from "./business-hours";

/**
 * Compact photo banner at the top of inner pages. Without an aside
 * the copy is centred; with one (phone cards on the area pages) the copy sits
 * left, the aside sits right, and the hero's own call button is dropped so
 * the number is not shown twice.
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
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: { href: string; label: string }[];
  aside?: ReactNode;
  /** An /images/<name> path. Stock photography — never captioned as our work. */
  image: string;
  /** The line the hero's call button dials. */
  phone?: Phone;
}) {
  const centred = !aside;

  return (
    <section className="page-banner relative isolate flex items-center overflow-hidden bg-navy-950">
      <Image src={asset(image)} alt="" fill priority sizes="100vw" className="object-cover" />
      {/* Dark layer so white text stays readable. 0.6 is the lightest that keeps 4.5:1 on any photo. */}
      <div
        className={`absolute inset-0 ${centred ? "bg-navy-950/65" : "bg-navy-950/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-950/85 lg:via-navy-950/70 lg:to-navy-950/60"}`}
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

          {eyebrow && (
            <Eyebrow tone="light" className="mt-6">
              {eyebrow}
            </Eyebrow>
          )}
          <h1
            className={`${eyebrow ? "mt-3" : "mt-6"} font-extrabold leading-[1.08] tracking-tight ${
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
            <Button href={site.primaryCta.href} arrow>
              {site.primaryCta.label}
            </Button>
            {centred && (
              <Button href={phone.href} variant="outlineLight">
                <IconPhone className="h-4 w-4 text-accent-400" />
                <span className="tabular-nums">Call {phone.display}</span>
              </Button>
            )}
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
  lede = "Call during business hours to talk it through, or start the form and we will call you back within one business day. Many estimates can be done from photos, without a visit.",
  initialTown = "",
  initialService = "",
}: {
  title?: string;
  lede?: string;
  initialTown?: string;
  initialService?: string;
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
            {site.phones.map((p) => (
              <PhoneCard key={p.state} phone={p} />
            ))}
          </div>

          <BusinessHours className="mt-7 text-navy-200 lg:max-w-lg" />
        </div>

        <div className="mt-9 lg:mt-0">
          <EstimateForm key={`${initialTown}-${initialService}`} initialTown={initialTown} initialService={initialService} />
        </div>
      </div>
    </section>
  );
}

/** Honesty note, shown once, on the home page. */
export function StraightAnswer() {
  return (
    <p className="max-w-[68ch] border-l-4 border-accent-500 pl-5 text-base leading-relaxed text-charcoal-700">
      <strong className="font-semibold text-navy-900">We are a new company.</strong> What you get from us is a free
      estimate, an itemised written quote, a clear recommendation (including when your roof does
      not need replacing yet) and a satisfaction guarantee on the work.
    </p>
  );
}

/**
 * The four-step process as a numbered timeline. The one list on the site
 * that is numbered, because it is the one that happens in order.
 */
export function ProcessList({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const onNavy = tone === "dark";
  return (
    <ol className="space-y-8">
      {processSteps.map((step, i) => (
        <li key={step.title} className="relative flex gap-5">
          {i < processSteps.length - 1 && (
            <span
              className={`absolute left-5 top-12 h-[calc(100%-1rem)] w-px ${onNavy ? "bg-navy-700" : "bg-mist-300"}`}
              aria-hidden="true"
            />
          )}
          <span
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-base font-extrabold ${
              onNavy ? "bg-accent-500 text-white" : "border-2 border-accent-500 bg-white text-accent-600"
            }`}
          >
            {i + 1}
          </span>
          <div className="pt-1.5">
            <h3 className={`text-lg font-bold ${onNavy ? "text-white" : "text-navy-900"}`}>{step.title}</h3>
            <p
              className={`mt-1.5 max-w-xl text-sm leading-relaxed sm:text-base ${onNavy ? "text-navy-200" : "text-charcoal-500"}`}
            >
              {step.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
