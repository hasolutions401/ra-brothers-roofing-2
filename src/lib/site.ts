/**
 * Single source of truth for everything the client still has to confirm.
 * Flip DEMO_MODE to false once the real details are in and every
 * "pending confirmation" note disappears from the site.
 */
export const DEMO_MODE = true;

type Phone = {
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
  name: "RA Brothers Roofing",
  short: "RA Brothers",
  legal: "RA Brothers Roofing",
  // Placeholder only — swap once the domain is purchased.
  url: "https://www.rabrothersroofing.com",
  description:
    "Residential and commercial roofing across Southern New Hampshire and Northern Massachusetts. Roof replacement, repair, new installation, storm damage and inspections.",
  phones: [PHONE_NH, PHONE_MA],
  email: null as string | null,
  emailNote: "Business email pending setup — please call for now.",
  hours: [
    { day: "Monday – Friday", time: "7:00 AM – 5:00 PM" },
    { day: "Saturday", time: "By appointment" },
    { day: "Sunday", time: "Closed" },
  ],
  hoursNote:
    "Proposed hours, typical for roofing contractors in the area — pending your confirmation.",
  primaryCta: { label: "Get a Free Roof Inspection", href: "/free-estimate" },
};

export function phoneFor(state: "NH" | "MA" | null | undefined): Phone {
  return state === "MA" ? PHONE_MA : PHONE_NH;
}
