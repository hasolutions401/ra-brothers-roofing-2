"use client";

import { useState } from "react";
import { IconPlus } from "./icons";

export function FaqList({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-ink/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-ink/10">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span
                  className={`font-display text-[16px] font-bold leading-snug transition-colors md:text-[17px] ${
                    isOpen ? "text-ink" : "text-ink/80 group-hover:text-ink"
                  }`}
                >
                  {item.q}
                </span>
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 border-copper-500 bg-copper-500 text-white"
                      : "border-ink/20 text-ink/50 group-hover:border-ink/45"
                  }`}
                >
                  <IconPlus className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div
              className={`grid transition-[grid-template-rows] duration-400 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[72ch] pb-7 pr-12 text-[14.5px] leading-[1.8] text-stone-700">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
