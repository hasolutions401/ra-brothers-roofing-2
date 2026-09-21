"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PHONE_MA, PHONE_NH } from "@/lib/site";
import { IconPhone } from "./icons";

/**
 * Persistent mobile action bar. The client asked for a call button that is
 * always visible; on phones that means pinning it rather than relying on
 * the header.
 */
export function CallBar({ state = "NH" }: { state?: "NH" | "MA" }) {
  const [visible, setVisible] = useState(false);
  const phone = state === "MA" ? PHONE_MA : PHONE_NH;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/97 backdrop-blur transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2 gap-2 p-2.5">
        <a
          href={phone.href}
          className="flex h-[50px] items-center justify-center gap-2 rounded-[3px] border border-white/25 font-display text-[13.5px] font-bold text-white"
        >
          <IconPhone className="h-4 w-4" />
          <span className="tabular-nums">{phone.display}</span>
        </a>
        <Link
          href="/free-estimate"
          className="flex h-[50px] items-center justify-center rounded-[3px] bg-copper-600 font-display text-[13.5px] font-bold text-white"
        >
          Free Inspection
        </Link>
      </div>
    </div>
  );
}
