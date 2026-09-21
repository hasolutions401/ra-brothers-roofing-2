import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CallBar } from "@/components/call-bar";
import { site, PHONE_NH, PHONE_MA } from "@/lib/site";
import { towns } from "@/lib/areas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Roofing in Southern NH & Northern MA`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Roofing in Southern NH & Northern MA`,
    description: site.description,
    locale: "en_US",
  },
  robots: { index: false, follow: false }, // demo build — flip on at launch
};

/**
 * Structured data. Deliberately contains no ratings, review counts,
 * founding date or certifications — nothing that is not yet true.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: [PHONE_NH.display, PHONE_MA.display],
  areaServed: towns.map((t) => ({
    "@type": "City",
    name: `${t.name}, ${t.state}`,
  })),
  address: {
    "@type": "PostalAddress",
    addressRegion: "NH",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "07:00",
      closes: "17:00",
    },
  ],
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
      className={`${geistSans.variable} h-full antialiased`}
    >
      {/*
        The bottom padding leaves room for the fixed mobile call bar, which is
        out of normal flow and would otherwise sit on top of the end of the
        footer. The bar is hidden from lg upwards, so the padding is too.
      */}
      <body className="flex min-h-full flex-col bg-white pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
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
