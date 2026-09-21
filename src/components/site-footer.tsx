import Link from "next/link";
import { services } from "@/lib/services";
import { townPages, townCount } from "@/lib/areas";
import { DEMO_MODE, PHONE_MA, PHONE_NH, site } from "@/lib/site";
import { Logo } from "./icons";

const heading = "text-sm font-bold uppercase tracking-wider text-white";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="wrap py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label={`${site.name} — home`} className="text-white">
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
              Residential and commercial roofing across Southern New Hampshire
              and Northern Massachusetts. Call to discuss a free inspection or
              estimate and confirm the scope for your property.
            </p>
          </div>

          {/* Services */}
          <div>
            <h2 className={heading}>Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-navy-200 transition hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h2 className={heading}>Service Areas</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {townPages.map((t) => (
                <li key={t.slug}>
                  <Link href={`/service-areas/${t.slug}`} className="text-navy-200 transition hover:text-white">
                    {t.town}, {t.state}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/service-areas" className="font-semibold text-accent-400 transition hover:text-accent-300">
                  See all {townCount} towns →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className={heading}>Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {[PHONE_NH, PHONE_MA].map((p) => (
                <li key={p.state}>
                  <span className="block text-xs uppercase tracking-wide text-navy-400">{p.region}</span>
                  <a href={p.href} className="font-bold tabular-nums text-white transition hover:text-accent-400">
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <span className="block text-xs uppercase tracking-wide text-navy-400">Email</span>
                {site.email ? (
                  <a href={`mailto:${site.email}`} className="break-all text-navy-200 hover:text-white">
                    {site.email}
                  </a>
                ) : (
                  <span className="text-navy-200">{site.emailNote}</span>
                )}
              </li>
            </ul>

            <h2 className={`${heading} mt-6`}>Hours</h2>
            {DEMO_MODE && <p className="mt-2 text-xs text-navy-200">{site.hoursNote}</p>}
            <ul className="mt-3 space-y-1.5 text-sm text-navy-200">
              {site.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-3">
                  <span>{h.day}</span>
                  <span className="text-right text-navy-400">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Every public page, linked from every page. */}
        <nav
          aria-label="Footer"
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-navy-800 pt-6 text-sm font-semibold"
        >
          {[
            { href: "/", label: "Home" },
            { href: "/services", label: "Services" },
            { href: "/service-areas", label: "Service Areas" },
            { href: "/about", label: "About" },
            { href: "/free-estimate", label: "Free Estimate" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-navy-200 transition hover:text-white">
              {l.label}
            </Link>
          ))}
          {DEMO_MODE && (
            <Link
              href="/plan"
              className="rounded-lg border border-accent-400/40 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-400 transition hover:bg-accent-400/10"
            >
              Growth plan · internal
            </Link>
          )}
        </nav>

        <div className="mt-6 flex flex-col gap-3 border-t border-navy-800 pt-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legal}. All rights reserved.
          </p>
          <p>Serving Southern NH &amp; Northern MA · Asphalt shingle roofing</p>
        </div>

        <p className="mt-5 max-w-4xl text-xs leading-relaxed text-navy-400/80">
          Serving Salem, Windham, Pelham, Derry, Londonderry, Atkinson,
          Plaistow, Hudson, Nashua and Manchester NH · Methuen, Lawrence,
          Andover, North Andover, Haverhill and Lowell MA · Asphalt shingle
          roof replacement, roof repair, storm damage and inspections.
        </p>
      </div>
    </footer>
  );
}
