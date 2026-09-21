"use client";

import Link from "next/link";
import { useState } from "react";
import { DEMO_MODE, PHONE_NH } from "@/lib/site";
import { IconArrow, IconCheck } from "./icons";

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
    <div className="w-full rounded-[4px] border border-white/12 bg-white p-6 shadow-[0_30px_70px_-30px_rgba(7,19,34,0.7)] sm:p-7">
      {sent ? (
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-copper-50">
            <IconCheck className="h-5 w-5 text-copper-600" />
          </div>
          <h3 className="mt-5 text-[19px] text-ink">Got it</h3>
          <p className="mt-3 text-[13.5px] leading-[1.7] text-stone-700">
            {DEMO_MODE
              ? "This is a site preview, so nothing was actually sent. Once hosting and the business email are live this lands in your inbox immediately."
              : "We will call you back to confirm the details and arrange the inspection."}
          </p>
          <a
            href={PHONE_NH.href}
            className="mt-5 inline-flex h-11 items-center rounded-[3px] bg-navy-900 px-5 font-display text-[13px] font-bold text-white hover:bg-ink"
          >
            Call {PHONE_NH.display}
          </a>
        </div>
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[19px] leading-tight text-ink">
              Request a free inspection
            </h3>
          </div>
          <p className="mt-2 text-[12.5px] leading-[1.6] text-stone-600">
            Tell us the basics and we will call you back to arrange a time.
          </p>

          <form
            className="mt-5 space-y-2.5"
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
              className="h-[46px] w-full rounded-[3px] border border-ink/14 px-3.5 text-[14px] outline-none transition-colors placeholder:text-stone-300 focus:border-navy-600"
            />
            <input
              value={v.phone}
              onChange={(e) => setV({ ...v, phone: e.target.value })}
              placeholder="Phone number"
              aria-label="Phone number"
              type="tel"
              className="h-[46px] w-full rounded-[3px] border border-ink/14 px-3.5 text-[14px] outline-none transition-colors placeholder:text-stone-300 focus:border-navy-600"
            />
            <input
              value={v.town}
              onChange={(e) => setV({ ...v, town: e.target.value })}
              placeholder="Town"
              aria-label="Town"
              className="h-[46px] w-full rounded-[3px] border border-ink/14 px-3.5 text-[14px] outline-none transition-colors placeholder:text-stone-300 focus:border-navy-600"
            />
            <select
              value={v.need}
              onChange={(e) => setV({ ...v, need: e.target.value })}
              aria-label="What do you need"
              className={`h-[46px] w-full rounded-[3px] border border-ink/14 bg-white px-3 text-[14px] outline-none transition-colors focus:border-navy-600 ${
                v.need === "" ? "text-stone-400" : "text-ink"
              }`}
            >
              <option value="">What do you need?</option>
              <option>Roof replacement</option>
              <option>Roof repair or leak</option>
              <option>Storm damage</option>
              <option>Inspection only</option>
              <option>Something else</option>
            </select>

            <button
              type="submit"
              disabled={!ready}
              className="group mt-1 flex h-[50px] w-full items-center justify-center gap-2 rounded-[3px] bg-copper-600 font-display text-[14px] font-bold text-white transition-colors hover:bg-copper-700 disabled:cursor-not-allowed disabled:bg-ink/12 disabled:text-ink/35"
            >
              Request my inspection
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-4 border-t border-ink/8 pt-4 text-[11.5px] leading-[1.6] text-stone-500">
            {DEMO_MODE && (
              <span className="mr-1 font-semibold text-stone-600">
                Preview form — not connected yet.
              </span>
            )}
            Prefer to talk?{" "}
            <a
              href={PHONE_NH.href}
              className="font-semibold text-copper-600 hover:underline"
            >
              {PHONE_NH.display}
            </a>{" "}
            ·{" "}
            <Link
              href="/free-estimate"
              className="font-semibold text-copper-600 hover:underline"
            >
              Longer form
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
