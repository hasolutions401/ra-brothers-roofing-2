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
      ? "Tick anything you have noticed on your own roof."
      : `${n} of ${warningSigns.length} selected. These are useful details to discuss during an inspection. The cause, extent and roof condition determine whether a repair or replacement is appropriate.`;

  return (
    <fieldset>
      <legend className="sr-only">Signs you have noticed</legend>
      <ul className="grid gap-2 sm:grid-cols-2">
        {warningSigns.map((s, i) => {
          const on = ticked.includes(s);
          return (
            <li key={s}>
              <label
                htmlFor={`${id}-${i}`}
                className={`flex h-full cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-sm leading-snug transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500 ${
                  on ? "border-accent-500 bg-accent-500/10 text-navy-900" : "border-mist-200 text-charcoal-700 hover:border-navy-200"
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
                  className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                    on ? "border-accent-500 bg-accent-500" : "border-navy-400 bg-white"
                  }`}
                  aria-hidden="true"
                >
                  {on && <IconCheck className="h-3 w-3 text-white" />}
                </span>
                {s}
              </label>
            </li>
          );
        })}
      </ul>
      <p
        aria-live="polite"
        className={`mt-4 text-sm font-semibold ${n >= 4 ? "text-accent-600" : "text-charcoal-700"}`}
      >
        {verdict}
      </p>
    </fieldset>
  );
}
