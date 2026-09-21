import type { IconKey } from "@/lib/services";

type P = { className?: string };

const base = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* --- service icons: drawn around a gable so the set reads as one family --- */

export function IconReplace({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3 15 16 5l13 10" />
      <path d="M6 19h20M6 23h20M6 27h20" strokeOpacity={0.45} />
      <path d="M22 9.5 26.5 6v4.5" />
    </svg>
  );
}

export function IconRepair({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3 16 16 6l13 10" />
      <path d="M6 20h9" strokeOpacity={0.45} />
      <path d="M6 25h5" strokeOpacity={0.45} />
      <path d="M26.5 18.2a4 4 0 0 1-5.2 5.2l-3.2 3.2a1.7 1.7 0 0 1-2.4-2.4l3.2-3.2a4 4 0 0 1 5.2-5.2l-2.3 2.3 2.4 2.4Z" />
    </svg>
  );
}

export function IconNew({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 14 16 5l12 9" />
      <path d="M7 14v13h18V14" />
      <path d="M13 27v-7h6v7" />
      <path d="M16 5V2" strokeOpacity={0.45} />
    </svg>
  );
}

export function IconStorm({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 17 16 7l12 10" />
      <path d="M7 21h6M19 21h6" strokeOpacity={0.45} />
      <path d="M17 15.5 12.5 22H16l-1.5 6 6-7.5H17l1.5-5Z" />
    </svg>
  );
}

export function IconInspect({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3 17 16 7l13 10" />
      <path d="M6 21h6" strokeOpacity={0.45} />
      <circle cx="20" cy="20.5" r="5" />
      <path d="M23.8 24.3 28 28.5" />
    </svg>
  );
}

export function IconMaintain({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3 15 16 5l13 10" />
      <path d="M6 19h20" strokeOpacity={0.45} />
      <path d="M11 24.5h10" strokeOpacity={0.45} />
      <path d="m18.5 27.5 2.6 2.6 5.4-5.6" />
    </svg>
  );
}

export function IconCommercial({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 12h24v16H4z" />
      <path d="M2 12h28" />
      <path d="M9 17h3M9 22h3M15 17h3M15 22h3M21 17h3M21 22h3" strokeOpacity={0.55} />
      <path d="M8 12V8h6v4" strokeOpacity={0.45} />
    </svg>
  );
}

const map: Record<IconKey, (p: P) => React.ReactElement> = {
  replace: IconReplace,
  repair: IconRepair,
  new: IconNew,
  storm: IconStorm,
  inspect: IconInspect,
  maintain: IconMaintain,
  commercial: IconCommercial,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: IconKey;
  className?: string;
}) {
  const C = map[name];
  return <C className={className} />;
}

/* --- interface icons ---------------------------------------------------- */

export function IconPhone({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M11.3 5.5 8.2 4.3a2 2 0 0 0-2.5 1.1l-1 2.4a2 2 0 0 0 .1 1.7c1.3 2.4 3 4.8 5.1 6.9 2.1 2.1 4.5 3.8 6.9 5.1a2 2 0 0 0 1.7.1l2.4-1a2 2 0 0 0 1.1-2.5l-1.2-3.1a2 2 0 0 0-2.3-1.2l-2.4.5-4.6-4.6.5-2.4a2 2 0 0 0-1.2-2.3Z" />
    </svg>
  );
}

export function IconPin({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M16 29s9-8.2 9-15a9 9 0 1 0-18 0c0 6.8 9 15 9 15Z" />
      <circle cx="16" cy="13.5" r="3.3" />
    </svg>
  );
}

export function IconClock({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="11.5" />
      <path d="M16 9.5V16l4.5 2.8" />
    </svg>
  );
}

export function IconArrow({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M6 16h20M19.5 9.5 26 16l-6.5 6.5" />
    </svg>
  );
}

export function IconCheck({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m6 17 6.5 6.5L26 9.5" />
    </svg>
  );
}

export function IconChevron({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m9 13 7 7 7-7" />
    </svg>
  );
}

export function IconPlus({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M16 7v18M7 16h18" />
    </svg>
  );
}

export function IconSearch({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="14.5" cy="14.5" r="8.5" />
      <path d="m20.8 20.8 5.2 5.2" />
    </svg>
  );
}

/* --- wordmark ------------------------------------------------------------ */

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const ink = tone === "light" ? "#ffffff" : "#0a1626";
  const sub = tone === "light" ? "rgba(255,255,255,0.62)" : "rgba(10,22,38,0.55)";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      {/* Gable mark: two roof planes and a ridge beam */}
      <svg
        viewBox="0 0 34 30"
        className="h-[30px] w-[34px] shrink-0"
        aria-hidden="true"
      >
        <path
          d="M2 16.5 17 4l15 12.5"
          fill="none"
          stroke={ink}
          strokeWidth="2.6"
          strokeLinecap="square"
        />
        <path
          d="M8.5 22.5 17 15.8l8.5 6.7"
          fill="none"
          stroke="#c05c21"
          strokeWidth="2.6"
          strokeLinecap="square"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[17px] font-extrabold tracking-[-0.02em]"
          style={{ color: ink }}
        >
          RA Brothers
        </span>
        <span
          className="font-display text-[9.5px] font-bold uppercase tracking-[0.34em]"
          style={{ color: sub }}
        >
          Roofing
        </span>
      </span>
    </span>
  );
}
