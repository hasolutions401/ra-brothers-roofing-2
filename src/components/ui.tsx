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
  md: "h-11 px-5 text-[13.5px]",
  lg: "h-[52px] px-7 text-[14.5px]",
};

const variants = {
  primary:
    "bg-copper-600 text-white hover:bg-copper-700 shadow-[0_1px_0_rgba(10,22,38,0.18)]",
  dark: "bg-navy-900 text-white hover:bg-ink",
  outline:
    "border border-ink/18 text-ink hover:border-ink/45 hover:bg-ink/[0.03]",
  outlineLight:
    "border border-white/28 text-white hover:border-white/60 hover:bg-white/10",
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
      className={`group inline-flex items-center justify-center gap-2 rounded-[3px] font-display font-bold tracking-[0.01em] transition-colors duration-200 ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
      {arrow && (
        <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
}

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
      ? "text-white/55"
      : tone === "accent"
        ? "text-copper-600"
        : "text-stone-500";
  return (
    <p className={`eyebrow ${colour} ${className}`}>{children}</p>
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
        <Eyebrow tone={light ? "light" : "accent"} className="mb-4">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={`text-[clamp(1.75rem,3.2vw,2.65rem)] leading-[1.1] ${light ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-5 text-[15.5px] leading-[1.7] ${light ? "text-white/65" : "text-stone-700"}`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/** Thin roofline divider used between major sections. */
export function Roofline({ tone = "paper" }: { tone?: "paper" | "white" }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-full ${tone === "paper" ? "bg-ink/8" : "bg-ink/6"}`}
    />
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-[12px] leading-relaxed text-stone-500">
      {children}
    </p>
  );
}
