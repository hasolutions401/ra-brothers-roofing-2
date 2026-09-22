import type { Metadata } from "next";
import { Archivo, Geist } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CallBar } from "@/components/call-bar";
import { DEMO_MODE, site } from "@/lib/site";
import { towns } from "@/lib/areas";
import { ogImage, pageUrl } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Headings. Variable width, set slightly condensed in globals.css.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const homeTitle = `${site.name} — Roofing in Southern NH & Northern MA`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: homeTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: pageUrl("/") },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: homeTitle,
    description: site.description,
    url: pageUrl("/"),
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: site.description, images: [ogImage.url] },
  // Hidden from search engines while this is a demo build. Flipping
  // DEMO_MODE in src/lib/site.ts lets them in; nothing to change here.
  robots: DEMO_MODE ? { index: false, follow: false } : undefined,
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${archivo.variable} h-full antialiased`}
    >
      {/*
        The bottom padding leaves room for the fixed mobile call bar, which is
        out of normal flow and would otherwise sit on top of the end of the
        footer. The bar is hidden from lg upwards, so the padding is too.
      */}
      <body className="flex min-h-full flex-col bg-white pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0">
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
      </body>
    </html>
  );
}
