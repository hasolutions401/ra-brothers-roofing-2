import type { Metadata } from "next";
import { Archivo, Geist } from "next/font/google";
import "./globals.css";
import { DEMO_MODE, site } from "@/lib/site";
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
 * Fonts and the document only. Public pages get the header, footer and call
 * bar from app/(site)/layout.tsx; the dashboard has app/admin/layout.tsx.
 */
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
      <body className="flex min-h-full flex-col bg-white">
        {children}
      </body>
    </html>
  );
}
