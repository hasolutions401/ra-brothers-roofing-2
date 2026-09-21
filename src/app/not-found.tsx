import Link from "next/link";
import { services } from "@/lib/services";
import { townPages } from "@/lib/areas";
import { PHONE_NH } from "@/lib/site";
import { Eyebrow } from "@/components/ui";
import { IconArrow, IconPhone } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="bg-navy-800">
      <div className="wrap py-16 lg:py-24">
        <Eyebrow tone="light">404</Eyebrow>
        <h1 className="mt-3 max-w-[18ch] text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
          That page is not here
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
          The link may be out of date. Here is everything on the site — or call
          us and skip the browsing entirely.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-accent-600"
          >
            Back to the home page
            <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href={PHONE_NH.href}
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <IconPhone className="h-4 w-4 text-accent-400" />
            <span className="tabular-nums">{PHONE_NH.display}</span>
          </a>
        </div>

        <div className="mt-14 grid gap-10 border-t border-navy-700 pt-10 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Services</h2>
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
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Service areas</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {townPages.map((t) => (
                <li key={t.slug}>
                  <Link href={`/service-areas/${t.slug}`} className="text-navy-200 transition hover:text-white">
                    Roofing in {t.town}, {t.state}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/service-areas" className="font-semibold text-accent-400 transition hover:text-accent-300">
                  All towns →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
