"use client";

import { SiteLink as Link } from "./site-link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { services } from "@/lib/services";
import { coreTowns, states, towns, townCount } from "@/lib/areas";
import { phoneFor, site } from "@/lib/site";
import { IconArrow, IconChevron, IconPhone, Logo, ServiceIcon } from "./icons";
import { Button } from "./ui";

type MenuId = "services" | "areas" | null;
const townLinks = towns.filter((town) => town.slug);

/**
 * Sticky white header: logo left, menu right, the NH line and the estimate
 * button in reach from lg up. Below lg the menu is a full-height drawer and
 * the call / estimate buttons live in the fixed bottom bar instead.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MenuId>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // True while the pointer is over a dropdown, so a click there keeps the
  // menu open instead of toggling shut the menu that hovering just opened.
  const hovering = useRef(false);
  const navRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const phone = phoneFor(towns.find((town) => town.slug && pathname.includes(`/service-areas/${town.slug}`))?.state);

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
        if (mobileOpen) mobileButton.current?.focus();
        else if (open) navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="menu-${open}"]`)?.focus();
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(null);
        setMobileOpen(false);
      }
      if (e.key === "Tab" && mobileOpen && headerRef.current) {
        const links = [...headerRef.current.querySelectorAll<HTMLElement>('a[href],button')].filter((el) => el.offsetParent !== null && !el.closest('[inert]'));
        const first = links[0];
        const last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
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
  }, [open, mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const background = [...document.body.children].filter((el): el is HTMLElement => el instanceof HTMLElement && ['MAIN', 'FOOTER'].includes(el.tagName) || el instanceof HTMLElement && el.getAttribute('aria-label') === 'Quick contact');
    const previousInert = background.map((el) => el.inert);
    document.body.style.overflow = "hidden";
    background.forEach((el) => { el.inert = true; });
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((el, i) => { el.inert = previousInert[i]; });
    };
  }, [mobileOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const resized = () => { if (desktop.matches) { setMobileOpen(false); setMobilePanel(null); } };
    desktop.addEventListener("change", resized);
    return () => { desktop.removeEventListener("change", resized); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  const hoverOpen = (id: MenuId) => {
    hovering.current = true;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const hoverClose = () => {
    hovering.current = false;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };
  /** Keyboard and touch toggle; a mouse that is already hovering just keeps it open. */
  const clickToggle = (id: MenuId) => {
    const keepOpen = hovering.current;
    setOpen((current) => (current === id && !keepOpen ? null : id));
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
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-mist-200">
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

          <nav aria-label="Main" className="ml-auto hidden lg:flex lg:items-center lg:gap-5"
            onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(null); }}>
            <Link
              href="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={menuLink(isActive("/"))}
            >
              Home
            </Link>

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => hoverOpen("services")} onMouseLeave={hoverClose}>
              <button
                type="button"
                aria-expanded={open === "services"}
                aria-controls="menu-services"
                onClick={() => clickToggle("services")}
                className={menuLink(isActive("/services"))}
              >
                Services
                <IconChevron
                  className={`h-4 w-4 transition-transform duration-200 ${open === "services" ? "rotate-180" : ""}`}
                />
              </button>

              <Panel id="menu-services" open={open === "services"} width="w-[36rem]">
                <ul className="grid grid-cols-2 gap-x-2">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="flex gap-3 rounded-lg px-3 py-2.5 transition hover:bg-mist-100"
                      >
                        <ServiceIcon name={s.icon} className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                        <span>
                          <span className="block text-sm font-bold text-navy-900">{s.navLabel}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-charcoal-500">
                            {s.short}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <PanelFoot href="/services" label="All roofing services" />
              </Panel>
            </div>

            {/* Service areas dropdown */}
            <div className="relative" onMouseEnter={() => hoverOpen("areas")} onMouseLeave={hoverClose}>
              <button
                type="button"
                aria-expanded={open === "areas"}
                aria-controls="menu-areas"
                onClick={() => clickToggle("areas")}
                className={menuLink(isActive("/service-areas"))}
              >
                Service Areas
                <IconChevron
                  className={`h-4 w-4 transition-transform duration-200 ${open === "areas" ? "rotate-180" : ""}`}
                />
              </button>

              <Panel id="menu-areas" open={open === "areas"} width="w-[38rem]">
                <div className="grid grid-cols-[1fr_1fr_11rem] gap-x-6 px-3 pb-2 pt-2">
                  {states.map((st) => (
                    <div key={st.code}>
                      <p className="text-sm font-bold text-navy-900">
                        {st.name}{" "}
                        <span className="font-normal text-charcoal-500">· {st.towns.length} towns</span>
                      </p>
                      <a
                        href={st.phone.href}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-accent-600 hover:text-accent-700"
                      >
                        <IconPhone className="h-3.5 w-3.5" />
                        {st.phone.display}
                      </a>
                      <p className="mt-3 text-xs leading-relaxed text-charcoal-500">
                        Including{" "}
                        {coreTowns
                          .filter((t) => t.state === st.code)
                          .map((t) => t.name)
                          .join(", ")}
                        .
                      </p>
                    </div>
                  ))}
                  <div className="border-l border-mist-200 pl-6">
                    <p className="text-sm font-bold text-navy-900">Town pages</p>
                    <ul className="mt-2 space-y-0.5">
                      {townLinks.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/service-areas/${t.slug}`}
                            className="-mx-2 block rounded-lg px-2 py-1.5 text-sm font-semibold text-accent-600 transition hover:bg-mist-100 hover:text-accent-700"
                          >
                            {t.name}, {t.state}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <PanelFoot href="/service-areas" label={`Search all ${townCount} towns`} />
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

          <div className="ml-auto flex items-center gap-3 lg:ml-6">
            {/* Below lg these two live in the fixed bottom bar instead. */}
            <a
              href={phone.href}
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-navy-900 transition hover:bg-mist-100 lg:flex"
            >
              <IconPhone className="h-4 w-4 text-accent-600" />
              <span className="whitespace-nowrap tabular-nums">{phone.display}</span>
            </a>
            <div className="hidden lg:block">
              <Button href={site.primaryCta.href}>{site.primaryCta.short}</Button>
            </div>

            <button
              ref={mobileButton}
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

      {/* Mobile drawer. `inert` while closed so its links cannot be tabbed to or read out. */}
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        inert={!mobileOpen}
        onClick={(e) => {
          if ((e.target as Element).closest('a[href]')) {
            setMobileOpen(false);
            setMobilePanel(null);
            mobileButton.current?.focus();
          }
        }}
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
            <MobileMore href="/services">All services</MobileMore>
          </MobileGroup>

          <MobileGroup
            label="Service Areas"
            open={mobilePanel === "areas"}
            onToggle={() => setMobilePanel(mobilePanel === "areas" ? null : "areas")}
          >
            {townLinks.map((t) => (
              <Link key={t.slug} href={`/service-areas/${t.slug}`} className="block py-2 text-sm text-charcoal-700">
                Roofing in {t.name}, {t.state}
              </Link>
            ))}
            <MobileMore href="/service-areas">All {townCount} towns</MobileMore>
          </MobileGroup>

          <MobileRow href="/about" label="About" />
          <MobileRow href="/#faq" label="FAQ" />

          <div className="mt-6 grid gap-3">
            {site.phones.map((p) => (
              <a
                key={p.state}
                href={p.href}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-navy-200 px-4 py-3"
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
            <Button href={site.primaryCta.href} size="lg" className="w-full">
              {site.primaryCta.label}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------------- helpers */

function Panel({
  id,
  open,
  width,
  children,
}: {
  id: string;
  open: boolean;
  width: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      inert={!open}
      className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200 ${
        open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
      }`}
    >
      <div className={`${width} rounded-2xl border border-mist-200 bg-white p-2 shadow-xl`}>{children}</div>
    </div>
  );
}

function PanelFoot({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-1 border-t border-mist-200 px-3 pb-1 pt-3">
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-sm font-bold text-accent-600 transition hover:text-accent-700"
      >
        {label}
        <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function MobileRow({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block border-b border-mist-100 py-3.5 text-base font-semibold text-charcoal-700">
      {label}
    </Link>
  );
}

function MobileMore({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 py-2 text-sm font-bold text-accent-600">
      {children}
      <IconArrow className="h-4 w-4" />
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
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="border-b border-mist-100">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between py-3.5 text-base font-semibold text-charcoal-700"
      >
        {label}
        <IconChevron className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div id={id} className="overflow-hidden" inert={!open}>
          <div className="pb-3 pl-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
