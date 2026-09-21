import Link from "next/link";
import { services } from "@/lib/services";
import { townPages } from "@/lib/areas";
import { PHONE_NH } from "@/lib/site";
import { Eyebrow } from "@/components/ui";
import { IconArrow, IconPhone } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-24 pt-[140px] text-white md:pt-[190px]">
      <div className="blueprint absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="wrap relative">
        <Eyebrow tone="light" className="mb-6">
          404
        </Eyebrow>
        <h1 className="max-w-[18ch] text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-white">
          That page is not here
        </h1>
        <p className="mt-6 max-w-xl text-[16px] leading-[1.8] text-white/60">
          The link may be out of date. Here is everything on the site — or call
          us and skip the browsing entirely.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex h-12 items-center gap-2 rounded-[3px] bg-copper-600 px-6 font-display text-[13.5px] font-bold text-white hover:bg-copper-700"
          >
            Back to the home page
            <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href={PHONE_NH.href}
            className="inline-flex h-12 items-center gap-2 rounded-[3px] border border-white/28 px-6 font-display text-[13.5px] font-bold text-white hover:border-white/65"
          >
            <IconPhone className="h-4 w-4" />
            <span className="tabular-nums">{PHONE_NH.display}</span>
          </a>
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/12 pt-10 sm:grid-cols-2">
          <div>
            <Eyebrow tone="light" className="mb-5">
              Services
            </Eyebrow>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="link-underline text-[14px] text-white/65 hover:text-white"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow tone="light" className="mb-5">
              Service areas
            </Eyebrow>
            <ul className="space-y-2.5">
              {townPages.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/service-areas/${t.slug}`}
                    className="link-underline text-[14px] text-white/65 hover:text-white"
                  >
                    Roofing in {t.town}, {t.state}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/service-areas"
                  className="font-display text-[13px] font-bold text-copper-400"
                >
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
