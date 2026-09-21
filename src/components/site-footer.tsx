import Link from "next/link";
import { services } from "@/lib/services";
import { townPages, townCount } from "@/lib/areas";
import { DEMO_MODE, PHONE_MA, PHONE_NH, site } from "@/lib/site";
import { Logo } from "./icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-950 text-white">
      <div className="blueprint absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="wrap relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.15fr] lg:gap-10 lg:py-20">
          {/* Brand */}
          <div>
            <Logo tone="light" />
            <p className="mt-6 max-w-[34ch] text-[13.5px] leading-[1.75] text-white/55">
              Residential and commercial roofing across Southern New Hampshire
              and Northern Massachusetts. Call to discuss a free inspection or
              estimate and confirm the scope for your property.
            </p>
            <div className="rule-accent-dark mt-7 max-w-[180px]" />
          </div>

          {/* Services */}
          <div>
            <h3 className="eyebrow mb-5 text-white/45">Services</h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="link-underline text-[13.5px] text-white/70 transition-colors hover:text-white"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="eyebrow mb-5 text-white/45">Service Areas</h3>
            <ul className="space-y-3">
              {townPages.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/service-areas/${t.slug}`}
                    className="link-underline text-[13.5px] text-white/70 transition-colors hover:text-white"
                  >
                    {t.town}, {t.state}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/service-areas"
                  className="font-display text-[13px] font-bold text-copper-400 hover:text-copper-200"
                >
                  See all {townCount} towns →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="eyebrow mb-5 text-white/45">Contact</h3>
            <div className="space-y-4">
              {[PHONE_NH, PHONE_MA].map((p) => (
                <div key={p.state}>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">
                    {p.region}
                  </p>
                  <a
                    href={p.href}
                    className="font-display text-[18px] font-extrabold tabular-nums tracking-[-0.01em] text-white transition-colors hover:text-copper-400"
                  >
                    {p.display}
                  </a>
                </div>
              ))}

              <div className="pt-1">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">
                  Email
                </p>
                {site.email ? (
                  <a
                    href={`mailto:${site.email}`}
                    className="text-[13.5px] text-white/70 hover:text-white"
                  >
                    {site.email}
                  </a>
                ) : (
                  <p className="text-[13px] text-white/45">{site.emailNote}</p>
                )}
              </div>
            </div>

            <h3 className="eyebrow mb-4 mt-9 text-white/45">Hours</h3>
            <dl className="space-y-2">
              {site.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex items-baseline justify-between gap-4 border-b border-white/8 pb-2"
                >
                  <dt className="text-[13px] text-white/70">{h.day}</dt>
                  <dd className="text-[13px] tabular-nums text-white/45">
                    {h.time}
                  </dd>
                </div>
              ))}
            </dl>
            {DEMO_MODE && (
              <p className="mt-3 text-[11.5px] leading-relaxed text-white/35">
                {site.hoursNote}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { href: "/services", label: "Services" },
                { href: "/service-areas", label: "Service Areas" },
                { href: "/about", label: "About" },
                { href: "/free-estimate", label: "Free Estimate" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[12.5px] text-white/55 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
              {DEMO_MODE && (
                <Link
                  href="/plan"
                  className="rounded-[2px] border border-copper-400/40 px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-copper-400 transition-colors hover:bg-copper-400/10"
                >
                  Growth plan · internal
                </Link>
              )}
            </nav>
            <p className="text-[12px] text-white/35">
              © {year} {site.legal}. All rights reserved.
            </p>
          </div>

          <p className="mt-6 max-w-4xl text-[11.5px] leading-relaxed text-white/25">
            Serving Salem, Windham, Pelham, Derry, Londonderry, Atkinson,
            Plaistow, Hudson, Nashua and Manchester NH · Methuen, Lawrence,
            Andover, North Andover, Haverhill and Lowell MA · Asphalt shingle
            roof replacement, roof repair, storm damage and inspections.
          </p>
        </div>
      </div>
    </footer>
  );
}
