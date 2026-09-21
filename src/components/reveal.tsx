"use client";

import { createElement, useEffect, useState, type ReactNode } from "react";

/**
 * Nudges a block into view once. Deliberately subtle — 18px and one pass.
 * The hidden state lives in CSS behind `scripting: enabled`, so nothing is
 * ever invisible when JavaScript is unavailable.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  // A callback ref keeps this component compiler-safe and lets the observer
  // effect re-run the moment the node actually exists.
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!node || shown) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(node);

    // Safety net: if the observer never fires, show the content anyway
    // rather than leaving a blank block on the page.
    const failsafe = setTimeout(() => setShown(true), 2500);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [node, shown]);

  return createElement(
    Tag,
    {
      ref: setNode,
      className: `reveal ${shown ? "is-in" : ""} ${className}`,
      style: { transitionDelay: `${delay}ms` },
    },
    children,
  );
}
