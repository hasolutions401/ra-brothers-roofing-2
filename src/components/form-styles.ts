import type { CSSProperties } from "react";

/** Shared by the hero quick form and the multi-step estimate form. */
export const inputClass =
  "w-full rounded-xl border border-navy-400 bg-white px-4 py-3 text-base text-charcoal-900 " +
  "placeholder:text-charcoal-500 transition focus:border-navy-600 focus:outline-none " +
  "focus:ring-2 focus:ring-navy-600/20 aria-[invalid=true]:border-red-700";

export const labelClass = "mb-1.5 block text-sm font-semibold text-navy-900";

export const errorClass = "mt-1.5 text-sm font-medium text-red-700";

/** Custom chevron for <select>, drawn to match the icon set. */
export const selectStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23545a61' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundPosition: "right 0.9rem center",
  backgroundSize: "1.1rem",
  backgroundRepeat: "no-repeat",
};

/** Ten-digit North American number, optionally prefixed with country code 1. */
export function isPhone(value: string) {
  return /^[+\d\s().-]+$/.test(value) && /^(?:1)?\d{10}$/.test(value.replace(/\D/g, ""));
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
