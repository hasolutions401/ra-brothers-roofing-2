/**
 * Single source of truth for everything the client still has to confirm.
 * Build with DEMO_MODE=false for launch. Confirmation of business facts is
 * separate from deployment mode; a launch build must never invent them.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export type Phone = {
  region: string;
  state: "NH" | "MA";
  display: string;
  href: string;
};

export const PHONE_NH: Phone = {
  region: "New Hampshire",
  state: "NH",
  display: "(603) 560-6170",
  href: "tel:+16035606170",
};

export const PHONE_MA: Phone = {
  region: "Massachusetts",
  state: "MA",
  display: "(617) 943-7714",
  href: "tel:+16179437714",
};

export const site = {
  /*
   * WORKING NAME. The client has said "RA Brothers" will not be the final
   * company name. Every page, the logo and all meta tags read from these
   * three fields, so the rename is a one-file change.
   */
  name: "RA Brothers Roofing",
  short: "RA Brothers",
  legal: "RA Brothers Roofing",
  nameIsFinal: false,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hasolutions401.github.io/ra-brothers-roofing-2",
  description:
    "Residential and commercial roofing across Southern New Hampshire and Northern Massachusetts. Roof replacement, repair, new installation, storm damage and inspections.",
  phones: [PHONE_NH, PHONE_MA],
  email: null as string | null,
  emailNote: "Business email coming soon. Please call for now.",
  hoursConfirmed: false,
  hours: [
    { day: "Monday – Friday", time: "7:00 AM – 5:00 PM", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "17:00" },
    { day: "Saturday", time: "By appointment" },
    { day: "Sunday", time: "Closed" },
  ],
  hoursNote:
    "Proposed hours, typical for roofing contractors in the area. Pending your confirmation.",
  /** The site's one call to action. "Estimate" because many are done from photos, without a visit. */
  primaryCta: { label: "Get a Free Estimate", short: "Free Estimate", href: "/free-estimate" },

  /* Promise the client has explicitly approved (21 Sep 2026). */
  callback: "We call you back within one business day.",
};

export function phoneFor(state: "NH" | "MA" | null | undefined): Phone {
  return state === "MA" ? PHONE_MA : PHONE_NH;
}

/**
 * Prefixes a /public path with the GitHub Pages base path. <Link> does this
 * on its own; <Image> does not, so every photo src goes through here.
 */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
