"use client";

import { useId, useState } from "react";
import { warningSigns } from "@/lib/content";
import { IconCheck } from "./icons";

/**
 * "Is it time?" self-check. Visitors tick what they have noticed and get the
 * summary they can discuss with a roofer. A count cannot diagnose whether
 * a roof needs repair or replacement.
 */
export function SignsChecklist() {
  const id = useId();
  const [ticked, setTicked] = useState<string[]>([]);
  const n = ticked.length;

  const verdict =
    n === 0
      ? "No signs selected."
      : `${n} of ${warningSigns.length} selected. These are useful details to discuss during an inspection. The cause, extent and roof condition determine whether a repair or replacement is appropriate.`;

  return (
    <fieldset aria-describedby={`${id}-help`}>
      <legend className="sr-only">Signs you have noticed</legend>
      <p id={`${id}-help`} className="mb-3 text-sm leading-relaxed text-charcoal-700">
        Tick anything you have noticed on your own roof.
      </p>
      <ul className="grid grid-cols-1 gap-3">
        {warningSigns.map((s, i) => {
          const on = ticked.includes(s);
          return (
            <li key={s}>
              <label
                htmlFor={`${id}-${i}`}
                className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border px-4 py-4 text-sm leading-relaxed transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500 has-[:focus-visible]:ring-offset-2 ${
                  on ? "border-accent-500 bg-accent-500/10 text-navy-900" : "border-mist-200 text-charcoal-700 hover:border-navy-400 hover:bg-mist-50"
                }`}
              >
                <input
                  id={`${id}-${i}`}
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => setTicked((t) => (on ? t.filter((x) => x !== s) : [...t, s]))}
                />
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                    on ? "border-accent-500 bg-accent-500" : "border-navy-400 bg-white"
                  }`}
                  aria-hidden="true"
                >
                  {on && <IconCheck className="h-4 w-4 text-white" />}
                </span>
                {s}
              </label>
            </li>
          );
        })}
      </ul>
      <p
        aria-live="polite"
        aria-atomic="true"
        className="mt-3 text-sm font-semibold leading-relaxed text-charcoal-700"
      >
        {verdict}
      </p>
    </fieldset>
  );
}
