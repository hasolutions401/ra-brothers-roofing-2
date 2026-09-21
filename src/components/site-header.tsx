"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/services";
import { coreTowns, townPages, townCount } from "@/lib/areas";
import { PHONE_MA, PHONE_NH, site } from "@/lib/site";
import { IconChevron, IconPhone, Logo, ServiceIcon } from "./icons";

type MenuId = "services" | "areas" | null;

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuId>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MenuId>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    // Deferred so the first sync happens outside the effect body — matters
    // when the browser restores a scroll position on load.
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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

  // The drawer is white, so the bar above it has to be too.
  const solid = !overlay || scrolled || open !== null || mobileOpen;
  const linkTone = solid ? "text-ink/78 hover:text-ink" : "text-white/85 hover:text-white";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-ink/8 bg-white/95 backdrop-blur-md"
          : "border-b border-white/10 bg-transparent"
      }`}
    >
      {/* Utility strip */}
      <div
        className={`hidden border-b transition-colors duration-300 lg:block ${
          solid ? "border-ink/8 bg-navy-950" : "border-white/10 bg-black/25"
        }`}
      >
        <div className="wrap flex h-9 items-center justify-between">
          <p className="text-[11.5px] tracking-[0.02em] text-white/55">
            Residential &amp; commercial roofing · Southern New Hampshire &amp;
            Northern Massachusetts
          </p>
          <div className="flex items-center gap-5">
            {[PHONE_NH, PHONE_MA].map((p) => (
              <a
                key={p.state}
                href={p.href}
                className="group flex items-center gap-2 text-[11.5px] text-white/70 transition-colors hover:text-white"
              >
                <span className="font-display font-bold tracking-[0.16em] text-copper-400">
                  {p.state}
                </span>
                <span className="font-display font-bold tabular-nums tracking-[0.01em]">
                  {p.display}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="wrap" ref={navRef}>
        <div className="flex h-[68px] items-center justify-between gap-6 lg:h-[76px]">
          <Link href="/" aria-label={`${site.name} — home`} className="shrink-0">
            <Logo tone={solid ? "dark" : "light"} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/" active={isActive("/")} tone={linkTone}>
              Home
            </NavLink>

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
                onClick={() =>
                  setOpen(open === "services" ? null : "services")
                }
                className={`flex items-center gap-1.5 px-3.5 py-2 font-display text-[14px] font-semibold transition-colors ${linkTone} ${
                  isActive("/services") ? (solid ? "text-ink" : "text-white") : ""
                }`}
              >
                Services
                <IconChevron
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    open === "services" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <Panel open={open === "services"} width="w-[680px]">
                <div className="grid grid-cols-2 gap-x-6">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group flex gap-3 rounded-[3px] px-3 py-3 transition-colors hover:bg-navy-50"
                    >
                      <ServiceIcon
                        name={s.icon}
                        className="mt-0.5 h-[22px] w-[22px] shrink-0 text-copper-600"
                      />
                      <span className="min-w-0">
                        <span className="block font-display text-[13.5px] font-bold text-ink">
                          {s.navLabel}
                        </span>
                        <span className="mt-1 block text-[12px] leading-[1.5] text-stone-500">
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
                className={`flex items-center gap-1.5 px-3.5 py-2 font-display text-[14px] font-semibold transition-colors ${linkTone} ${
                  isActive("/service-areas")
                    ? solid
                      ? "text-ink"
                      : "text-white"
                    : ""
                }`}
              >
                Service Areas
                <IconChevron
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    open === "areas" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <Panel open={open === "areas"} width="w-[620px]">
                <div className="grid grid-cols-[1fr_1fr_190px] gap-x-7">
                  <AreaCol
                    label="New Hampshire"
                    towns={coreTowns
                      .filter((t) => t.state === "NH")
                      .map((t) => t.name)}
                  />
                  <AreaCol
                    label="Massachusetts"
                    towns={coreTowns
                      .filter((t) => t.state === "MA")
                      .map((t) => t.name)}
                  />
                  <div className="border-l border-ink/8 pl-6">
                    <p className="eyebrow mb-3 text-copper-600">Town pages</p>
                    <ul className="space-y-2">
                      {townPages.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/service-areas/${t.slug}`}
                            className="link-underline font-display text-[13px] font-bold text-ink"
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
                  label={`See all ${townCount} towns we cover`}
                  note="Just outside the list? Call and we will tell you honestly."
                />
              </Panel>
            </div>

            <NavLink href="/about" active={isActive("/about")} tone={linkTone}>
              About
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={PHONE_NH.href}
              className={`hidden items-center gap-2 rounded-[3px] border px-4 py-2.5 font-display text-[13px] font-bold transition-colors md:inline-flex ${
                solid
                  ? "border-ink/15 text-ink hover:border-ink/40"
                  : "border-white/30 text-white hover:border-white/70"
              }`}
            >
              <IconPhone className="h-4 w-4" />
              <span className="tabular-nums">{PHONE_NH.display}</span>
            </a>
            <Link
              href="/free-estimate"
              className="hidden rounded-[3px] bg-copper-600 px-5 py-3 font-display text-[13px] font-bold text-white transition-colors hover:bg-copper-700 sm:block"
            >
              Free Inspection
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className={`-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden ${
                solid ? "text-ink" : "text-white"
              }`}
            >
              <span
                className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`block h-[2px] w-5 bg-current transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto bg-white transition-[opacity,transform] duration-300 lg:hidden ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="wrap py-6">
          <MobileRow href="/" label="Home" />

          <MobileGroup
            label="Services"
            open={mobilePanel === "services"}
            onToggle={() =>
              setMobilePanel(mobilePanel === "services" ? null : "services")
            }
          >
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="flex items-center gap-3 py-2.5 text-[14.5px] text-stone-700"
              >
                <ServiceIcon
                  name={s.icon}
                  className="h-[18px] w-[18px] text-copper-600"
                />
                {s.navLabel}
              </Link>
            ))}
            <Link
              href="/services"
              className="mt-2 inline-block font-display text-[13px] font-bold text-copper-600"
            >
              All services →
            </Link>
          </MobileGroup>

          <MobileGroup
            label="Service Areas"
            open={mobilePanel === "areas"}
            onToggle={() =>
              setMobilePanel(mobilePanel === "areas" ? null : "areas")
            }
          >
            {townPages.map((t) => (
              <Link
                key={t.slug}
                href={`/service-areas/${t.slug}`}
                className="block py-2.5 text-[14.5px] text-stone-700"
              >
                Roofing in {t.town}, {t.state}
              </Link>
            ))}
            <Link
              href="/service-areas"
              className="mt-2 inline-block font-display text-[13px] font-bold text-copper-600"
            >
              All {townCount} towns →
            </Link>
          </MobileGroup>

          <MobileRow href="/about" label="About" />

          <div className="mt-8 border-t border-ink/8 pt-6">
            <p className="eyebrow mb-4 text-stone-500">Call us</p>
            <div className="grid gap-3">
              {[PHONE_NH, PHONE_MA].map((p) => (
                <a
                  key={p.state}
                  href={p.href}
                  className="flex items-center justify-between rounded-[3px] border border-ink/12 px-4 py-3.5"
                >
                  <span className="text-[12px] uppercase tracking-[0.14em] text-stone-500">
                    {p.region}
                  </span>
                  <span className="font-display text-[15px] font-bold tabular-nums text-ink">
                    {p.display}
                  </span>
                </a>
              ))}
            </div>
            <Link
              href="/free-estimate"
              className="mt-4 flex h-[52px] items-center justify-center rounded-[3px] bg-copper-600 font-display text-[14px] font-bold text-white"
            >
              Get a Free Roof Inspection
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- helpers */

function NavLink({
  href,
  children,
  active,
  tone,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-2 font-display text-[14px] font-semibold transition-colors ${tone} ${
        active ? "opacity-100" : ""
      }`}
    >
      {children}
    </Link>
  );
}

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
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0"
      }`}
    >
      <div
        className={`${width} rounded-[4px] border border-ink/10 bg-white p-5 shadow-[0_24px_60px_-24px_rgba(10,22,38,0.35)]`}
      >
        {children}
      </div>
    </div>
  );
}

function PanelFoot({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note: string;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-6 border-t border-ink/8 pt-4">
      <p className="text-[11.5px] text-stone-500">{note}</p>
      <Link
        href={href}
        className="shrink-0 font-display text-[12.5px] font-bold text-copper-600 hover:text-copper-700"
      >
        {label} →
      </Link>
    </div>
  );
}

function AreaCol({ label, towns }: { label: string; towns: string[] }) {
  return (
    <div>
      <p className="eyebrow mb-3 text-copper-600">{label}</p>
      <ul className="space-y-1.5">
        {towns.map((t) => (
          <li key={t} className="text-[13px] text-stone-700">
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
      className="block border-b border-ink/8 py-4 font-display text-[17px] font-bold text-ink"
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
    <div className="border-b border-ink/8">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 font-display text-[17px] font-bold text-ink"
      >
        {label}
        <IconChevron
          className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 pl-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
