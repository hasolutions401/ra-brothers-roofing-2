export type IconKey =
  | "replace"
  | "repair"
  | "new"
  | "storm"
  | "inspect"
  | "maintain"
  | "commercial";

export type Service = {
  slug: string;
  name: string;
  navLabel: string;
  icon: IconKey;
  /** One line for cards and lists */
  blurb: string;
  /** A few words for the Services menu */
  short: string;
  /** Opening paragraph on the service page */
  intro: string;
  /** An /images/<name> path (see images-src/). Stock — never captioned as our own work. */
  image: string;
  imageAlt: string;
  /** Concrete scope. No claims about warranty, history or certifications. */
  includes: string[];
  /** Symptom-led list that helps a homeowner self-diagnose */
  signals: string[];
  /** Heading of the closing call-to-action band */
  cta: string;
  /** What to do when it cannot wait, shown above the scope. Only where it applies. */
  urgent?: string;
  /** Page part of the <title>; the site name is appended, so keep it under ~40 characters. */
  metaTitle: string;
  metaDescription: string;
};

/**
 * Shared by the storm page and the FAQ. The business does not offer a 24/7
 * emergency service, so this must not promise one.
 */
export const urgentLeak =
  "Water coming in now? Call rather than using the form: the phone is the fastest way to reach us. If we can get to you, the first job is stopping the water with a temporary tarp. We do not run a 24-hour emergency service, so outside business hours leave a message and we call back as soon as we can. Until then, keep people clear of any sagging ceiling and, if water is near wiring or fixtures, switch that circuit off at the breaker if it is safe to do so.";

export const services: Service[] = [
  {
    slug: "roof-replacement",
    name: "Roof Replacement",
    navLabel: "Roof Replacement",
    icon: "replace",
    blurb:
      "Full tear-off, deck inspection and a complete new shingle system, with flashing, underlayment and ventilation included.",
    short: "Tear-off to ridge cap, one complete system.",
    intro:
      "Replacing a roof means looking beyond the surface shingles. The condition of the decking, flashing and ventilation affects what the new assembly needs. If damage is localized, a repair may still be practical. A replacement estimate should explain why replacement is recommended and what is included in the work.",
    image: "/images/roofer-tear-off",
    imageAlt: "Roofer tearing off old asphalt shingles from a house",
    includes: [
      "Complete tear-off of existing shingles down to the deck",
      "Deck inspection, with soft or rotted sheathing priced before it is replaced",
      "Ice and water shield at eaves, valleys and penetrations",
      "Synthetic underlayment across the field",
      "New drip edge, step flashing and pipe boots",
      "Ridge and soffit ventilation checked and corrected where needed",
      "Architectural shingles in the color you choose",
      "Magnetic sweep of the property and full debris haul-away",
    ],
    signals: [
      "The roof is 18 or more years old",
      "Shingles are curling, cupping or shedding granules",
      "Daylight or water staining is visible in the attic",
      "Leaks are appearing in more than one area",
      "Repair bills are stacking up year after year",
    ],
    cta: "Get a roof replacement estimate",
    metaTitle: "Roof Replacement in Southern NH & MA",
    metaDescription:
      "Full asphalt shingle roof replacement in Salem NH, Windham NH, Methuen MA and surrounding towns. Tear-off, deck inspection, ice and water shield, ventilation.",
  },
  {
    slug: "roof-repair",
    name: "Roof Repair",
    navLabel: "Roof Repair",
    icon: "repair",
    blurb:
      "Leaks, missing shingles, failed flashing and chimney details, traced to the source and fixed there.",
    short: "Leaks, flashing and missing shingles.",
    intro:
      "A leak almost never starts where the water shows up inside. Water runs along rafters and decking before it drops, so the stain on your ceiling can sit ten feet from the failure itself. We trace it back to the source, usually flashing, a valley, a pipe boot or chimney counterflashing, and repair the cause instead of smearing sealant over the symptom.",
    image: "/images/gutter-rain",
    imageAlt: "Rain running off the edge of an asphalt shingle roof",
    includes: [
      "Leak tracing from inside the attic wherever there is access",
      "Shingle replacement color-matched as closely as the existing roof allows",
      "Step, counter and chimney flashing repair or replacement",
      "Valley and ridge repairs",
      "Pipe boot, vent and skylight resealing",
      "A written summary of what failed and why",
    ],
    signals: [
      "A ceiling or wall stain that grows after rain",
      "Shingles on the lawn after a wind event",
      "Granules collecting in the gutters",
      "Daylight around a chimney or vent, seen from the attic",
      "Drips during heavy rain but not during light rain",
    ],
    cta: "Get a roof repair estimate",
    metaTitle: "Roof & Leak Repair in Southern NH & MA",
    metaDescription:
      "Roof leak repair, shingle replacement and flashing repair across Salem NH, Windham NH, Methuen MA and nearby towns. We find the source, not just the stain.",
  },
  {
    slug: "new-roof-installation",
    name: "New Roof Installation",
    navLabel: "New Roof Installation",
    icon: "new",
    blurb:
      "Roofing for new construction, additions, dormers and garages, scheduled around your build.",
    short: "New builds, additions and garages.",
    intro:
      "New construction roofing runs on somebody else's clock. The frame goes up, the building has to be dried in, and every trade behind you is waiting. We schedule around the build rather than around our own calendar, and we install the assembly the design calls for, including the ventilation a tight new envelope needs in order to work.",
    image: "/images/new-construction-roof",
    imageAlt: "Roof trusses in place on a house under construction",
    includes: [
      "Roofing for new builds, additions, dormers, porches and detached garages",
      "Dry-in coordinated with your framing schedule",
      "Full assembly: underlayment, ice and water shield, flashing, shingles",
      "Intake and exhaust ventilation sized to the roof",
      "Coordination with your general contractor or builder",
      "Low-slope sections handled with the correct membrane, not shingles",
    ],
    signals: [
      "You are building a home or an addition and need the roof",
      "A dormer or porch is being added to an existing roof",
      "A detached garage or outbuilding needs roofing",
      "Your builder needs the structure dried in on a fixed date",
    ],
    cta: "Get a quote for your build",
    metaTitle: "New Roof Installation in NH & MA",
    metaDescription:
      "New roof installation for new construction, additions, dormers and garages in Southern New Hampshire and Northern Massachusetts. Scheduled around your build.",
  },
  {
    slug: "storm-damage-repair",
    name: "Storm Damage & Insurance Claims",
    navLabel: "Storm Damage & Insurance",
    icon: "storm",
    blurb:
      "Wind, ice and fallen-limb damage: stabilized first, documented for your insurance claim, then repaired.",
    short: "Stabilize, document, then repair.",
    intro:
      "Nor'easters and summer thunderstorms are what put most roofs around here in trouble at short notice. When a section of roof opens up, the order of operations matters: stop the water, photograph everything before it changes, then work through the claim with you and your insurer. We handle the roofing side of the claim (the documentation, the scope and the adjuster meeting) so you are not sorting out the roofing details with your insurer on your own.",
    image: "/images/storm-damage-tree",
    imageAlt: "Large tree uprooted by a storm beside a house",
    includes: [
      "Temporary tarping and stabilization to stop active water entry, once the roof is safe to work on",
      "Full photo documentation of the damage before anything is touched",
      "A detailed written scope your adjuster can work from",
      "Meeting your insurance adjuster at the property",
      "Reviewing the adjuster's estimate and flagging anything missed",
      "Wind-lifted and missing shingle replacement",
      "Fallen limb and impact damage repair, including decking where needed",
      "Ice dam damage assessment and the ventilation fix behind it",
    ],
    signals: [
      "Shingles torn off or lifted after a wind storm",
      "A tree limb has come down on the roof",
      "Water entering the house during or after a storm",
      "You are thinking about filing an insurance claim",
      "Your insurer has asked for a contractor's assessment",
    ],
    cta: "Get storm damage looked at",
    urgent: urgentLeak,
    metaTitle: "Storm Damage Roof Repair, NH & MA",
    metaDescription:
      "Storm and wind damage roof repair with insurance claim help across Southern NH and Northern MA: documentation, adjuster meetings and a detailed scope.",
  },
  {
    slug: "roof-inspections",
    name: "Roof Inspections",
    navLabel: "Roof Inspections",
    icon: "inspect",
    blurb:
      "A documented look at the whole roof, from field and flashing to ventilation and attic, with photos and a clear recommendation.",
    short: "Photos and a clear recommendation.",
    intro:
      "An inspection is the cheapest thing you will ever do for a roof. Ours are free, and many start remotely, from your photos and aerial imagery, before anyone climbs a ladder. We go over the field, the flashing, the penetrations and the gutters, plus the attic where there is access, because half of what ruins a roof in New England happens underneath it. You get photographs and a plain-English recommendation, including the one people do not expect to hear: this roof is fine, call us in three years.",
    image: "/images/roof-inspection",
    imageAlt: "Worker on an asphalt shingle roof with old shingles partially removed",
    includes: [
      "A full walk of the roof wherever it is safe to do so",
      "Flashing, valley, chimney, skylight and penetration check",
      "Gutter and drainage assessment",
      "Attic check for ventilation, moisture and daylight where accessible",
      "Photographs of everything we flag",
      "A written recommendation: repair, replace, or leave it alone",
    ],
    signals: [
      "You are buying or selling a home",
      "The age of the roof is unknown or undocumented",
      "A storm has come through and you want it checked",
      "You want a second opinion on a replacement quote",
      "It has been several years since anyone looked at it",
    ],
    cta: "Book a free roof inspection",
    metaTitle: "Free Roof Inspections in NH & MA",
    metaDescription:
      "Documented roof inspections with photographs across Salem NH, Windham NH, Methuen MA and surrounding towns. Repair, replace, or leave it alone.",
  },
  {
    slug: "roof-maintenance",
    name: "Roof Maintenance",
    navLabel: "Roof Maintenance",
    icon: "maintain",
    blurb:
      "Seasonal checks, sealant renewal, debris clearing and the small fixes that keep a good roof from becoming a bad one.",
    short: "Seasonal checks and small fixes.",
    intro:
      "A lifted nail, a deteriorated pipe boot or a valley packed with pine needles can allow water into an otherwise serviceable roof. Maintenance means checking those details and addressing small problems before they cause more extensive damage. The scope and price depend on what the roof needs.",
    image: "/images/roofer-sealant",
    imageAlt: "Roofer renewing sealant on an asphalt shingle roof",
    includes: [
      "Seasonal visual inspection, spring and fall",
      "Debris cleared from valleys, behind chimneys and in gutters",
      "Pipe boot, vent and sealant renewal before they fail",
      "Loose or lifted shingles re-secured",
      "Moss and algae assessment on shaded north-facing slopes",
      "A short written note on anything worth watching",
    ],
    signals: [
      "The roof is sound and you would like to keep it that way",
      "Heavy tree cover drops debris into the valleys",
      "Dark streaking or moss on the shaded side of the roof",
      "You have just had a roof installed and want it looked after",
      "You manage a rental or investment property",
    ],
    cta: "Set up roof maintenance",
    metaTitle: "Roof Maintenance in Southern NH & MA",
    metaDescription:
      "Seasonal roof maintenance, debris clearing, sealant renewal and small repairs across Southern New Hampshire and Northern Massachusetts.",
  },
  {
    slug: "commercial-roofing",
    name: "Commercial Roofing",
    navLabel: "Commercial Roofing",
    icon: "commercial",
    blurb:
      "Low-slope and steep-slope work for small commercial buildings, scheduled around your operating hours.",
    short: "Low-slope and small commercial.",
    intro:
      "A commercial roof is a business problem before it is a building problem: water over a stock room or a server rack costs far more than the repair does. We work on small commercial and mixed-use buildings, including retail blocks, offices, light industrial and multi-family, and we schedule the loud, disruptive parts around the hours your building is empty.",
    image: "/images/commercial-flat-roof",
    imageAlt: "Low-slope commercial roof with rooftop HVAC equipment and ducting",
    includes: [
      "Low-slope membrane repair and replacement",
      "Steep-slope commercial and multi-family roofing",
      "Roof drain, scupper and parapet flashing work",
      "Curb and penetration flashing around rooftop equipment",
      "Phased work so the building keeps operating",
      "Scheduling around your business hours",
    ],
    signals: [
      "Ponding water on a flat or low-slope roof",
      "Leaks around rooftop HVAC units or curbs",
      "A property you manage needs a roof condition report",
      "Seams or membrane lifting at the edges",
      "You are budgeting a capital roof replacement",
    ],
    cta: "Get a commercial roofing estimate",
    metaTitle: "Commercial Roofing in Southern NH & MA",
    metaDescription:
      "Commercial and multi-family roofing for small buildings in Southern New Hampshire and Northern Massachusetts. Low-slope membrane, flashing and phased replacement.",
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);
