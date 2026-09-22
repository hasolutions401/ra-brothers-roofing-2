import NextLink from "next/link";
import type { ComponentProps } from "react";

/** Avoid prefetching every service page and its hero photo from shared menus. */
export function SiteLink(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
