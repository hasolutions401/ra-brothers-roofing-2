/**
 * Single source of truth for everything the client still has to confirm.
 * Build with DEMO_MODE=false for launch. Confirmation of business facts is
 * separate from deployment mode; a launch build must never invent them.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
/** The internal /plan page: `next dev` and INCLUDE_PLAN=true builds only. */
export const INCLUDE_PLAN = process.env.NEXT_PUBLIC_INCLUDE_PLAN === "true";

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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rabrothersroofing.alwaysdata.net",
  description:
    "Residential and commercial roofing across Southern New Hampshire and Northern Massachusetts. Roof replacement, repair, new installation, storm damage and inspections.",
  phones: [PHONE_NH, PHONE_MA],
  /* Shown in the footer and the privacy notice once set; hidden while null. */
  email: null as string | null,
  /*
   * Until the client confirms them, no page shows these hours: visitors see
   * a "call us" line instead. Set hoursConfirmed: true only after sign-off.
   */
  hoursConfirmed: false,
  hours: [
    { day: "Monday – Friday", time: "7:00 AM – 5:00 PM", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "17:00" },
    { day: "Saturday", time: "By appointment" },
    { day: "Sunday", time: "Closed" },
  ],
  /** The site's one call to action. "Estimate" because many are done from photos, without a visit. */
  primaryCta: { label: "Get a Free Estimate", short: "Free Estimate", href: "/free-estimate" },

  /* Promise the client has explicitly approved (21 Sep 2026). */
  callback: "We call you back within one business day.",

  /*
   * The satisfaction guarantee as the About page states it. CLIENT TO
   * CONFIRM: the written terms (coverage, duration, exclusions) must be
   * printed on every written estimate, as the last line promises.
   */
  guarantee: [
    ["What it means", "If something about our work is not right, tell us. We come back, look at it with you, and put right anything our work caused, at no charge."],
    ["How to ask for help", "Call either number and say it is about finished work. We call you back within one business day to arrange a visit."],
    ["The written terms", "What is covered, for how long, and what is not (for example storm damage after the job, or work by others) is written into your estimate, so you read it before you agree to anything."],
  ] as [string, string][],

  /* The privacy notice (/privacy). CLIENT TO CONFIRM the retention period. */
  privacy: {
    updated: "24 September 2026",
    retention:
      "If a request does not lead to work, we delete it, with any photos, within 24 months of our last contact with you. If you hire us, we keep it with the records for your job for as long as we need them for the work, its guarantee, and our tax and legal obligations.",
  },
};

export function phoneFor(state: "NH" | "MA" | null | undefined): Phone {
  return state === "MA" ? PHONE_MA : PHONE_NH;
}

/**
 * Prefixes a /public path with the base path (empty at a domain root). <Link> does this
 * on its own; <Image> does not, so every photo src goes through here.
 */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
