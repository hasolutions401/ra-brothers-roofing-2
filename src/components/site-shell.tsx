import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CallBar } from "./call-bar";
import { site } from "@/lib/site";
import { towns } from "@/lib/areas";

/**
 * Structured data. Deliberately contains no ratings, review counts,
 * founding date or certifications. Opening hours are included only after
 * hoursConfirmed is explicitly set, independently of deployment mode.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phones.map((p) => p.display),
  areaServed: towns.map((t) => ({
    "@type": "City",
    name: `${t.name}, ${t.state}`,
  })),
  address: {
    "@type": "PostalAddress",
    addressRegion: "NH",
    addressCountry: "US",
  },
  ...(!site.hoursConfirmed
    ? {}
    : {
        openingHoursSpecification: site.hours.filter((h) => h.days && h.opens && h.closes).map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
      }),
};

/**
 * Header, footer and call bar around every public page, and the 404 page.
 * The admin dashboard has its own chrome (src/app/admin/layout.tsx).
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    /*
      The bottom padding leaves room for the fixed mobile call bar, which is
      out of normal flow and would otherwise sit on top of the end of the
      footer. The bar is hidden from lg upwards, so the padding is too.
    */
    <div className="flex flex-1 flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-bold focus:text-navy-900"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <CallBar />
    </div>
  );
}
