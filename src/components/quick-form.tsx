"use client";

import Link from "next/link";
import { useState } from "react";
import { DEMO_MODE, PHONE_NH } from "@/lib/site";
import { IconArrow, IconCheck } from "./icons";

const inputClass =
  "w-full rounded-xl border border-mist-300 bg-white px-4 py-3 text-base text-charcoal-900 " +
  "placeholder:text-charcoal-500/60 transition focus:border-navy-600 focus:outline-none " +
  "focus:ring-2 focus:ring-navy-600/20";

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

/**
 * Compact hero card. Deliberately short — name, phone, town — because the
 * job of this form is to start a conversation, not to qualify the lead.
 * The full multi-step version lives on /free-estimate.
 */
export function QuickForm() {
  const [sent, setSent] = useState(false);
  const [v, setV] = useState({ name: "", phone: "", town: "", need: "" });

  const ready = v.name.trim() !== "" && v.phone.trim() !== "";

  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-xl ring-1 ring-mist-200 sm:p-7">
      {sent ? (
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10">
            <IconCheck className="h-6 w-6 text-accent-600" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-navy-900">Got it</h3>
          <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
            {DEMO_MODE
              ? "This is a site preview, so nothing was actually sent. Once hosting and the business email are live this lands in your inbox immediately."
              : "Thanks — we will call you back within one business day."}
          </p>
          <a
            href={PHONE_NH.href}
            className="mt-5 inline-block rounded-xl bg-accent-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-600"
          >
            Call {PHONE_NH.display}
          </a>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-bold text-navy-900 sm:text-xl">Get a free estimate</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal-500">
            Tell us the basics. We call back within one business day — and
            many estimates need no visit at all.
          </p>

          <form
            className="mt-5 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input
              value={v.name}
              onChange={(e) => setV({ ...v, name: e.target.value })}
              placeholder="Full name"
              aria-label="Full name"
              autoComplete="name"
              className={inputClass}
            />
            <input
              value={v.phone}
              onChange={(e) => setV({ ...v, phone: e.target.value })}
              placeholder="Phone number"
              aria-label="Phone number"
              type="tel"
              autoComplete="tel"
              className={inputClass}
            />
            <input
              value={v.town}
              onChange={(e) => setV({ ...v, town: e.target.value })}
              placeholder="Town"
              aria-label="Town"
              className={inputClass}
            />
            <select
              value={v.need}
              onChange={(e) => setV({ ...v, need: e.target.value })}
              aria-label="What do you need"
              className={`${inputClass} appearance-none bg-no-repeat pr-10 ${
                v.need === "" ? "text-charcoal-500/80" : ""
              }`}
              style={{ backgroundImage: CHEVRON, backgroundPosition: "right 0.9rem center", backgroundSize: "1.1rem" }}
            >
              <option value="">What do you need?</option>
              <option>Roof replacement</option>
              <option>Roof repair or leak</option>
              <option>Storm damage / insurance claim</option>
              <option>Inspection only</option>
              <option>Something else</option>
            </select>

            <button
              type="submit"
              disabled={!ready}
              className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-accent-600 active:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent-500"
            >
              Request my inspection
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-4 border-t border-mist-200 pt-4 text-xs leading-relaxed text-charcoal-500">
            {DEMO_MODE && <span className="mr-1 font-semibold">Preview form — not connected yet.</span>}
            Prefer to talk?{" "}
            <a href={PHONE_NH.href} className="font-semibold text-navy-600 underline underline-offset-2">
              {PHONE_NH.display}
            </a>{" "}
            ·{" "}
            <Link href="/free-estimate" className="font-semibold text-navy-600 underline underline-offset-2">
              Longer form
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
