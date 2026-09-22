"use client";

import { usePathname } from "next/navigation";
import { towns } from "@/lib/areas";
import { phoneFor, site } from "@/lib/site";
import { IconPhone } from "./icons";
import { Button } from "./ui";

/**
 * Call / Free Estimate bar fixed to the bottom of phones and tablets. The
 * client asked for a call button that is always visible, so it never hides.
 * On a Massachusetts town page it dials the MA line; everywhere else, NH.
 * The bottom padding on the wrapper in site-shell.tsx keeps it off the footer, and
 * env(safe-area-inset-bottom) lifts it above the iPhone home indicator.
 */
export function CallBar() {
  const pathname = usePathname();
  const town = towns.find((t) => t.slug && pathname.includes(`/service-areas/${t.slug}`));
  const phone = phoneFor(town?.state);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-800 bg-navy-900 pb-[env(safe-area-inset-bottom)] lg:hidden"
      role="region"
      aria-label="Quick contact"
    >
      <div className="grid grid-cols-2 gap-2 p-2">
        <a
          href={phone.href}
          aria-label={`Call ${phone.region} line, ${phone.display}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/25 py-3 text-sm font-bold text-white active:bg-white/10"
        >
          <IconPhone className="h-4 w-4" />
          Call Now
        </a>
        <Button href={pathname.startsWith("/free-estimate") ? "/free-estimate/#estimate-form" : site.primaryCta.href}>{site.primaryCta.short}</Button>
      </div>
    </div>
  );
}
