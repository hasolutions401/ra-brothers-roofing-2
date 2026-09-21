import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrow } from "./icons";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "dark" | "outline" | "outlineLight";
  size?: "md" | "lg";
  className?: string;
  arrow?: boolean;
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
  dark: "bg-navy-900 text-white hover:bg-navy-800",
  outline: "border border-navy-200 bg-white text-navy-900 hover:border-navy-400 hover:bg-mist-50",
  outlineLight: "border border-white/25 text-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  arrow = false,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl font-bold transition ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
      {arrow && (
        <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
}

/** Small letter-spaced label above a heading. Blue on white, light blue on navy. */
export function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light" | "accent";
  className?: string;
}) {
  const colour =
    tone === "light"
      ? "text-accent-400"
      : tone === "accent"
        ? "text-accent-600"
        : "text-charcoal-500";
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.18em] sm:text-sm ${colour} ${className}`}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "dark",
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow && (
        <Eyebrow tone={light ? "light" : "accent"} className="mb-2">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={`text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl ${light ? "text-white" : "text-navy-900"}`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-3 text-base leading-relaxed ${light ? "text-navy-100" : "text-charcoal-500"}`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/** Text link with a trailing arrow — "Learn more →" in the live site's style. */
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
          : "text-navy-600 hover:text-navy-900"
      } ${className}`}
    >
      {children}
      <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
