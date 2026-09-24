import { SiteLink as Link } from "./site-link";
import type { ReactNode } from "react";
import { IconArrow } from "./icons";

type ButtonProps = {
  /** A page path, or a tel:/mailto: link (rendered as a plain <a>). */
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "outlineLight";
  size?: "md" | "lg";
  className?: string;
  arrow?: boolean;
  "aria-label"?: string;
};

const sizes = {
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
};

/*
  Blue always means "the thing to click". Hover goes darker, never lighter,
  so the white label keeps its contrast.
*/
const variants = {
  primary: "bg-accent-500 text-white shadow-sm hover:bg-accent-600 active:bg-accent-700",
  outline: "border border-navy-200 bg-white text-navy-900 hover:border-navy-400 hover:bg-mist-50",
  outlineLight: "border border-white/30 text-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  arrow = false,
  ...rest
}: ButtonProps) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-xl font-bold transition ${sizes[size]} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && (
        <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  if (/^(tel|mailto):/.test(href)) {
    return (
      <a href={href} className={classes} aria-label={rest["aria-label"]}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} aria-label={rest["aria-label"]}>
      {content}
    </Link>
  );
}

/** Small letter-spaced label. Used sparingly, where it carries information. */
export function Eyebrow({
  children,
  tone = "accent",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "accent" | "muted";
  className?: string;
}) {
  const color =
    tone === "light" ? "text-accent-400" : tone === "muted" ? "text-charcoal-500" : "text-accent-600";
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.16em] sm:text-sm ${color} ${className}`}>
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  lede,
  tone = "dark",
  className = "",
  as: Tag = "h2",
}: {
  title: ReactNode;
  lede?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
  as?: "h2" | "h3";
}) {
  const light = tone === "light";
  return (
    <div className={`max-w-2xl ${className}`}>
      <Tag
        className={`text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl ${light ? "text-white" : "text-navy-900"}`}
      >
        {title}
      </Tag>
      {lede && (
        <p className={`mt-3 text-base leading-relaxed ${light ? "text-navy-100" : "text-charcoal-500"}`}>
          {lede}
        </p>
      )}
    </div>
  );
}

/** Text link with a trailing arrow. */
export function ArrowLink({
  href,
  children,
  tone = "dark",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 text-sm font-bold transition ${
        tone === "light"
          ? "text-accent-400 hover:text-accent-300"
          : "text-accent-600 hover:text-accent-700"
      } ${className}`}
    >
      {children}
      <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
