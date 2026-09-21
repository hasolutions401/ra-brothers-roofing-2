import type { ReactNode } from "react";
import { site } from "@/lib/site";
import type { IconKey } from "@/lib/services";

type P = { className?: string };

/**
 * One line-art family on a 24px grid, shared with the live RA Brothers site.
 * Everything strokes with currentColor, so an icon takes the text colour of
 * whatever it sits in.
 */
function Svg({
  className,
  strokeWidth = 2,
  children,
}: P & { strokeWidth?: number; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* --- service icons ------------------------------------------------------- */

const servicePaths: Record<IconKey, string> = {
  replace: "M2 12 12 4l10 8M5 11v9h14v-9M9 20v-5h6v5",
  repair: "M14.5 4.5a4 4 0 0 0 5 5L21 8l-8 8-5 5-3-3 5-5 8-8-1.5 1.5Z",
  new: "M3 13 12 5l9 8M6 12v8h12v-8M12 5V2M9 20v-4h6v4",
  storm: "M13 3 4 14h6l-1 7 9-11h-6l1-7Z",
  inspect: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm5 12 5 5",
  maintain: "M15 3a5 5 0 0 0-4.6 7L3 17.4V21h3.6l7.4-7.4A5 5 0 1 0 15 3Z",
  commercial: "M3 21h18M5 21V8l7-4 7 4v13M9 12h2m3 0h2M9 16h2m3 0h2",
};

export function ServiceIcon({
  name,
  className,
}: {
  name: IconKey;
  className?: string;
}) {
  return (
    <Svg className={className} strokeWidth={1.6}>
      <path d={servicePaths[name]} />
    </Svg>
  );
}

/**
 * The navy tile an icon sits in on cards, the trust strip and the menus.
 * Same treatment as the live site: dark tile, light-blue line icon.
 */
export function IconTile({
  children,
  size = "md",
  tone = "navy",
  className = "",
}: {
  children: ReactNode;
  size?: "sm" | "md";
  /** "glass" is for tiles that already sit on a navy background. */
  tone?: "navy" | "glass";
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl text-accent-400 transition ${
        tone === "glass" ? "bg-white/10" : "bg-navy-900 group-hover:bg-navy-800"
      } ${
        size === "sm" ? "h-11 w-11 [&>svg]:h-5 [&>svg]:w-5" : "h-12 w-12 [&>svg]:h-6 [&>svg]:w-6"
      } ${className}`}
    >
      {children}
    </span>
  );
}

/* --- trust-strip icons ---------------------------------------------------- */

export function IconEye({ className }: P) {
  return (
    <Svg className={className} strokeWidth={1.7}>
      <path d="M12 5c-5 0-8.5 4.2-9.5 6.2a1.7 1.7 0 0 0 0 1.6C3.5 14.8 7 19 12 19s8.5-4.2 9.5-6.2a1.7 1.7 0 0 0 0-1.6C20.5 9.2 17 5 12 5Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </Svg>
  );
}

export function IconDocument({ className }: P) {
  return (
    <Svg className={className} strokeWidth={1.7}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6 1.5V9h4.5M9 13h6M9 17h4" />
    </Svg>
  );
}

export function IconHome({ className }: P) {
  return (
    <Svg className={className} strokeWidth={1.7}>
      <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" />
    </Svg>
  );
}

export function IconPin({ className }: P) {
  return (
    <Svg className={className} strokeWidth={1.8}>
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </Svg>
  );
}

/* --- interface icons ------------------------------------------------------ */

export function IconPhone({ className }: P) {
  return (
    <Svg className={className} strokeWidth={1.9}>
      <path d="M6.6 3h2.2l1.5 3.8-1.6 1.2a11 11 0 0 0 5.3 5.3l1.2-1.6L19 13.2v2.2a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3Z" />
    </Svg>
  );
}

export function IconClock({ className }: P) {
  return (
    <Svg className={className} strokeWidth={1.9}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Svg>
  );
}

export function IconArrow({ className }: P) {
  return (
    <Svg className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function IconCheck({ className }: P) {
  return (
    <Svg className={className} strokeWidth={2.2}>
      <path d="m5 12 5 5L19 7" />
    </Svg>
  );
}

/** Check in a soft blue disc — the hero bullet from the live site. */
export function IconCheckCircle({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="var(--color-accent-500)" opacity="0.18" />
      <path
        d="m8 12 3 3 5-6"
        stroke="var(--color-accent-400)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChevron({ className }: P) {
  return (
    <Svg className={className}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function IconPlus({ className }: P) {
  return (
    <Svg className={className} strokeWidth={2.2}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconSearch({ className }: P) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </Svg>
  );
}

/* --- wordmark ------------------------------------------------------------- */

/**
 * The brand mark from the live site: a roof line with a blue ridge
 * accent over two open walls, and the name beside it. Colour comes from
 * className (navy in the header, white in the footer); the ridge stays blue.
 */
export function Logo({ className = "" }: P) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 32" aria-hidden="true" className="h-8 w-10 shrink-0" fill="none">
        <path
          d="M3 17 L20 4 L37 17"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M20 4 L20 9" stroke="var(--color-accent-500)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M8 20 L8 28 M32 20 L32 28"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight sm:text-xl">{site.short}</span>
        <span className="mt-0.5 text-[0.63rem] font-semibold uppercase tracking-[0.22em] opacity-70">
          Roofing
        </span>
      </span>
    </span>
  );
}
