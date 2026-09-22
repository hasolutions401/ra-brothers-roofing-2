"use client";

import { useId, useState } from "react";
import type { Faq } from "@/lib/content";
import { IconPlus } from "./icons";

/** Accordion: hairline rows, a blue plus that turns to a cross. */
export function FaqList({ items }: { items: Faq[] }) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-mist-200 border-y border-mist-200">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panel = `${id}-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 py-4 text-left font-sans text-base font-bold text-navy-900"
              >
                {item.q}
                <IconPlus
                  className={`mt-1 h-5 w-5 shrink-0 text-accent-600 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={panel}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-9 text-sm leading-relaxed text-charcoal-500 sm:text-base">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
