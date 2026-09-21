import Link from "next/link";
import { PHONE_MA, PHONE_NH } from "@/lib/site";
import { IconPhone } from "./icons";

/**
 * Call / Free Inspection bar fixed to the bottom of phones and tablets. The
 * client asked for a call button that is always visible, so it never hides.
 * The bottom padding on <body> in app/layout.tsx keeps it off the footer, and
 * env(safe-area-inset-bottom) lifts it above the iPhone home indicator.
 */
export function CallBar({ state = "NH" }: { state?: "NH" | "MA" }) {
  const phone = state === "MA" ? PHONE_MA : PHONE_NH;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-800 bg-navy-900 pb-[env(safe-area-inset-bottom)] lg:hidden"
      role="region"
      aria-label="Quick contact"
    >
      <div className="grid grid-cols-2 gap-2 p-2">
        <a
          href={phone.href}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/25 py-3.5 text-sm font-bold text-white active:bg-white/10"
        >
          <IconPhone className="h-4 w-4" />
          Call Now
        </a>
        <Link
          href="/free-estimate"
          className="flex items-center justify-center rounded-xl bg-accent-500 py-3.5 text-sm font-bold text-white active:bg-accent-700"
        >
          Free Inspection
        </Link>
      </div>
    </div>
  );
}
