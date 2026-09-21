"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/services";
import { coreTowns, townPages, townCount } from "@/lib/areas";
import { PHONE_MA, PHONE_NH, site } from "@/lib/site";
import { IconChevron, IconPhone, IconTile, Logo, ServiceIcon } from "./icons";

type MenuId = "services" | "areas" | null;

/**
 * Sticky white header, as on the live site: logo left, menu right, the NH
 * line and the free-inspection button always in reach. The two dropdowns open
 * on hover and on click; on phones the menu becomes a full-height drawer.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MenuId>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close every menu on navigation, adjusted during render rather than in an
  // effect so the new page never paints with the old menu still open.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
    setMobilePanel(null);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const hoverOpen = (id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /** Underlined in blue when it is the page you are on. */
  const menuLink = (active: boolean) =>
    `inline-flex items-center gap-1 border-b-2 py-1.5 text-sm font-semibold transition ${
      active
        ? "border-accent-500 text-navy-900"
        : "border-transparent text-charcoal-700 hover:text-navy-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-mist-200">
      {/*
        The frosted background is its own layer: backdrop-filter on the header
        itself would make it the containing block for the fixed mobile drawer
        and squash the drawer into the 4rem bar.
      */}
      <div className="absolute inset-0 -z-10 bg-white/95 backdrop-blur" aria-hidden="true" />
      <div className="wrap" ref={navRef}>
        <div className="flex h-16 items-center gap-4 lg:h-20">
          <Link href="/" aria-label={`${site.name} — home`} className="shrink-0 text-navy-900">
            <Logo />
          </Link>

          <nav aria-label="Main" className="ml-auto hidden lg:flex lg:items-center lg:gap-6">
            <Link
              href="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={menuLink(isActive("/"))}
            >
              Home
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => hoverOpen("services")}
              onMouseLeave={hoverClose}
            >
              <button
                type="button"
                aria-expanded={open === "services"}
                aria-haspopup="true"
                onClick={() => setOpen(open === "services" ? null : "services")}
                className={menuLink(isActive("/services"))}
              >
                Services
                <IconChevron
                  className={`h-4 w-4 transition-transform duration-200 ${open === "services" ? "rotate-180" : ""}`}
                />
              </button>

              <Panel open={open === "services"} width="w-[640px]">
                <div className="grid grid-cols-2 gap-1">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group flex gap-3 rounded-xl p-3 transition hover:bg-mist-100"
                    >
                      <IconTile size="sm">
                        <ServiceIcon name={s.icon} />
                      </IconTile>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-navy-900">{s.navLabel}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-charcoal-500">
                          {s.blurb.split(" — ")[0]}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <PanelFoot
                  href="/services"
                  label="All roofing services"
                  note="Roofing only for now — gutters and siding can be added later."
                />
              </Panel>
            </div>

            {/* Service areas dropdown */}
            <div
              className="relative"
              onMouseEnter={() => hoverOpen("areas")}
              onMouseLeave={hoverClose}
            >
              <button
                type="button"
                aria-expanded={open === "areas"}
                aria-haspopup="true"
                onClick={() => setOpen(open === "areas" ? null : "areas")}
                className={menuLink(isActive("/service-areas"))}
              >
                Service Areas
                <IconChevron
                  className={`h-4 w-4 transition-transform duration-200 ${open === "areas" ? "rotate-180" : ""}`}
                />
              </button>

              <Panel open={open === "areas"} width="w-[600px]">
                <div className="grid grid-cols-[1fr_1fr_190px] gap-x-6 p-3">
                  <AreaCol
                    label="New Hampshire"
                    towns={coreTowns.filter((t) => t.state === "NH").map((t) => t.name)}
                  />
                  <AreaCol
                    label="Massachusetts"
                    towns={coreTowns.filter((t) => t.state === "MA").map((t) => t.name)}
                  />
                  <div className="border-l border-mist-200 pl-6">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent-600">
                      Town pages
                    </p>
                    <ul className="space-y-1">
                      {townPages.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/service-areas/${t.slug}`}
                            className="-mx-2 block rounded-lg px-2 py-1.5 text-sm font-semibold text-navy-900 transition hover:bg-mist-100"
                          >
                            {t.town}, {t.state}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <PanelFoot
                  href="/service-areas"
                  label={`See all ${townCount} towns`}
                  note="Just outside the list? Call and we will tell you honestly."
                />
              </Panel>
            </div>

            <Link
              href="/about"
              aria-current={isActive("/about") ? "page" : undefined}
              className={menuLink(isActive("/about"))}
            >
              About
            </Link>
            <Link href="/#faq" className={menuLink(false)}>
              FAQ
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-6 lg:gap-3">
            {/* On phones the call button lives in the bottom bar instead. */}
            <a
              href={PHONE_NH.href}
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-navy-900 transition hover:bg-mist-100 sm:flex"
            >
              <IconPhone className="h-4 w-4 text-accent-600" />
              <span className="tabular-nums">{PHONE_NH.display}</span>
            </a>
            <Link
              href="/free-estimate"
              className="hidden rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent-600 sm:inline-block"
            >
              Free Inspection
            </Link>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-xl p-2.5 text-navy-900 transition hover:bg-mist-100 lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-mist-200 bg-white transition-[opacity,transform] duration-300 lg:hidden ${
          mobileOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="wrap pb-8 pt-2">
          <MobileRow href="/" label="Home" />

          <MobileGroup
            label="Services"
            open={mobilePanel === "services"}
            onToggle={() => setMobilePanel(mobilePanel === "services" ? null : "services")}
          >
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="flex items-center gap-3 py-2 text-sm text-charcoal-700"
              >
                <ServiceIcon name={s.icon} className="h-[18px] w-[18px] text-accent-600" />
                {s.navLabel}
              </Link>
            ))}
            <Link href="/services" className="block py-2 text-sm font-bold text-accent-600">
              All services →
            </Link>
          </MobileGroup>

          <MobileGroup
            label="Service Areas"
            open={mobilePanel === "areas"}
            onToggle={() => setMobilePanel(mobilePanel === "areas" ? null : "areas")}
          >
            {townPages.map((t) => (
              <Link
                key={t.slug}
                href={`/service-areas/${t.slug}`}
                className="block py-2 text-sm text-charcoal-700"
              >
                Roofing in {t.town}, {t.state}
              </Link>
            ))}
            <Link href="/service-areas" className="block py-2 text-sm font-bold text-accent-600">
              All {townCount} towns →
            </Link>
          </MobileGroup>

          <MobileRow href="/about" label="About" />
          <MobileRow href="/#faq" label="FAQ" />

          <div className="mt-6 grid gap-3">
            {[PHONE_NH, PHONE_MA].map((p) => (
              <a
                key={p.state}
                href={p.href}
                className="flex items-center justify-between rounded-xl border border-navy-200 px-4 py-3"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                  {p.region}
                </span>
                <span className="flex items-center gap-2 text-base font-bold tabular-nums text-navy-900">
                  <IconPhone className="h-4 w-4 text-accent-600" />
                  {p.display}
                </span>
              </a>
            ))}
            <Link
              href="/free-estimate"
              className="flex items-center justify-center rounded-xl bg-accent-500 py-3.5 text-base font-bold text-white"
            >
              {site.primaryCta.label}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------------- helpers */

function Panel({
  open,
  width,
  children,
}: {
  open: boolean;
  width: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200 ${
        open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
      }`}
    >
      <div className={`${width} rounded-2xl border border-mist-200 bg-white p-2 shadow-xl`}>
        {children}
      </div>
    </div>
  );
}

function PanelFoot({ href, label, note }: { href: string; label: string; note: string }) {
  return (
    <div className="mt-1 flex items-center justify-between gap-6 border-t border-mist-200 px-3 pb-1 pt-3">
      <p className="text-xs text-charcoal-500">{note}</p>
      <Link
        href={href}
        className="shrink-0 text-sm font-bold text-accent-600 transition hover:text-accent-700"
      >
        {label} →
      </Link>
    </div>
  );
}

function AreaCol({ label, towns }: { label: string; towns: string[] }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent-600">{label}</p>
      <ul className="space-y-1.5">
        {towns.map((t) => (
          <li key={t} className="text-sm text-charcoal-700">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileRow({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block border-b border-mist-100 py-3.5 text-base font-semibold text-charcoal-700"
    >
      {label}
    </Link>
  );
}

function MobileGroup({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-mist-100">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3.5 text-base font-semibold text-charcoal-700"
      >
        {label}
        <IconChevron className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="pb-3 pl-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
