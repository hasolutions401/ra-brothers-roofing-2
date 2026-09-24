import type { ReactNode } from "react";
import { site } from "@/lib/site";
import type { IconKey } from "@/lib/services";

type P = { className?: string };

/**
 * One line-art family on a 24px grid. Everything strokes with currentColor,
 * so an icon takes the text color of whatever it sits in.
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

/*
  Drawn for this site rather than taken from a library, so each one shows the
  trade itself: shingle courses, a hammer, a truss, wind, a ladder, a season,
  a flat roof with its plant.
*/
const serviceIcons: Record<IconKey, ReactNode> = {
  // Roof plane with shingle courses, over the walls.
  replace: (
    <>
      <path d="M2.5 13 12 5l9.5 8Z" />
      <path d="M7.2 10.5h9.6M9.6 8.2h4.8" />
      <path d="M5.5 13v7h13v-7" />
    </>
  ),
  // Claw hammer.
  repair: (
    <g transform="rotate(45 12 12)">
      <path d="M12 9.5V21" />
      <path d="M8 4h7.5A1.5 1.5 0 0 1 17 5.5v2A1.5 1.5 0 0 1 15.5 9H8L6 6.5Z" />
    </g>
  ),
  // A roof truss: top chords, bottom chord, king post and webs.
  new: (
    <>
      <path d="M2.5 16.5 12 6.5l9.5 10Z" />
      <path d="M12 6.5v10M7.25 16.5 12 12l4.75 4.5" />
      <path d="M4 20.5h16" />
    </>
  ),
  // Wind gusts.
  storm: (
    <>
      <path d="M3 8.5h10a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12.5h14.5a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16.5h7" />
    </>
  ),
  // Ladder.
  inspect: (
    <>
      <path d="M7.5 3v18M16.5 3v18" />
      <path d="M7.5 7h9M7.5 11h9M7.5 15h9M7.5 19h9" />
    </>
  ),
  // Calendar with a roof on it: seasonal roof care.
  maintain: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M8 17.5l4-3.5 4 3.5" />
    </>
  ),
  // Flat-roof building with a rooftop unit.
  commercial: (
    <>
      <path d="M2.5 21h19" />
      <path d="M4.5 21V10.5h15V21" />
      <path d="M13 10.5V7.5h4.5v3" />
      <path d="M8 14h2M14 14h2M8 17.5h2M14 17.5h2" />
    </>
  ),
};

export function ServiceIcon({ name, className }: { name: IconKey; className?: string }) {
  return (
    <Svg className={className} strokeWidth={1.6}>
      {serviceIcons[name]}
    </Svg>
  );
}

/* --- interface icons ------------------------------------------------------ */

export function IconPin({ className }: P) {
  return (
    <Svg className={className} strokeWidth={1.8}>
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </Svg>
  );
}

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

/** Check in a soft blue disc, for the promise list on dark backgrounds. */
export function IconCheckCircle({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="var(--color-accent-500)" opacity="0.22" />
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
 * The brand mark from the live site: a roof line with a blue ridge accent
 * over two open walls, and the name beside it. Color comes from className
 * (navy in the header, white in the footer); the ridge stays blue.
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
        <span className="font-display text-lg font-extrabold tracking-tight sm:text-xl">{site.short}</span>
        <span className="mt-0.5 text-[0.63rem] font-semibold uppercase tracking-[0.22em] opacity-70">
          Roofing
        </span>
      </span>
    </span>
  );
}
