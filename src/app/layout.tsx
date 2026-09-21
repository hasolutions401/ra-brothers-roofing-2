import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CallBar } from "@/components/call-bar";
import { site, PHONE_NH, PHONE_MA } from "@/lib/site";
import { towns } from "@/lib/areas";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[3px] focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader overlay />
        <main id="main">{children}</main>
        <SiteFooter />
        <CallBar />
      </body>
    </html>
  );
}
