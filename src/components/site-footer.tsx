import { SiteLink as Link } from "./site-link";
import { services } from "@/lib/services";
import { townPages, townCount } from "@/lib/areas";
import { DEMO_MODE, site } from "@/lib/site";
import { API_ENABLED } from "@/lib/api";
import { IconArrow, Logo } from "./icons";
import { BusinessHours } from "./business-hours";

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
              and Northern Massachusetts. Free estimates, often from your photos.
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
                <Link
                  href="/service-areas"
                  className="group inline-flex items-center gap-1.5 font-semibold text-accent-400 transition hover:text-accent-300"
                >
                  All {townCount} towns
                  <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className={heading}>Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {site.phones.map((p) => (
                <li key={p.state}>
                  <span className="block text-xs uppercase tracking-wide text-navy-300">{p.region}</span>
                  <a href={p.href} className="font-bold tabular-nums text-white transition hover:text-accent-400">
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <span className="block text-xs uppercase tracking-wide text-navy-300">Email</span>
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
            <BusinessHours className="mt-3 text-navy-200" />
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
              Growth plan · demo only
            </Link>
          )}
        </nav>

        <div className="mt-6 flex flex-col gap-3 border-t border-navy-800 pt-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legal}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Serving Southern NH &amp; Northern MA</span>
            {/* Staff sign-in for the leads dashboard; kept quiet for customers.
                Only on builds that have the API behind them. */}
            {API_ENABLED && (
              <Link href="/admin/login/" rel="nofollow" className="text-navy-300 underline-offset-4 transition hover:text-white hover:underline">
                Admin
              </Link>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
