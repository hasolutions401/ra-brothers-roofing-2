import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";

/** Every public page. The group folder "(site)" does not appear in URLs. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
