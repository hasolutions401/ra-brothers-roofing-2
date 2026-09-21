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
  /** One line for cards and nav */
  blurb: string;
  /** Opening paragraph on the service page */
  intro: string;
  image: string;
  imageAlt: string;
  /** Concrete scope. No claims about warranty, history or certifications. */
  includes: string[];
  /** Symptom-led list that helps a homeowner self-diagnose */
  signals: string[];
  metaTitle: string;
  metaDescription: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "roof-replacement",
    name: "Roof Replacement",
    navLabel: "Roof Replacement",
    icon: "replace",
    featured: true,
    blurb:
      "Full tear-off, deck inspection and a complete new shingle system — flashing, underlayment and ventilation included.",
    intro:
      "Most asphalt shingle roofs in Southern New Hampshire reach the end of their service life somewhere between year 18 and year 25. Freeze-thaw cycles, ice damming and nor'easter wind take more out of a roof here than they do further south. When a repair stops being worth the money, a full replacement is the honest answer — and we will tell you plainly which side of that line your roof is on.",
    image: "/images/roofer-shingles.jpg",
    imageAlt: "Roofer sealing a detail on an asphalt shingle roof",
    includes: [
      "Complete tear-off of existing shingles down to the deck",
      "Deck inspection — soft or rotted sheathing identified and priced before it is replaced",
      "Ice and water shield at eaves, valleys and penetrations",
      "Synthetic underlayment across the field",
      "New drip edge, step flashing and pipe boots",
      "Ridge and soffit ventilation checked and corrected where needed",
      "Architectural shingles in the colour you choose",
      "Magnetic sweep of the property and full debris haul-away",
    ],
    signals: [
      "The roof is 18 or more years old",
      "Shingles are curling, cupping or shedding granules",
      "Daylight or water staining is visible in the attic",
      "Leaks are appearing in more than one area",
      "Repair bills are stacking up year after year",
    ],
    metaTitle: "Roof Replacement in Southern NH & Northern MA",
    metaDescription:
      "Full asphalt shingle roof replacement in Salem NH, Windham NH, Methuen MA and surrounding towns. Tear-off, deck inspection, ice and water shield, ventilation.",
  },
  {
    slug: "roof-repair",
    name: "Roof Repair",
    navLabel: "Roof Repair",
    icon: "repair",
    featured: true,
    blurb:
      "Leaks, missing shingles, failed flashing and chimney details — found properly, then fixed properly.",
    intro:
      "A leak almost never starts where the water shows up inside. Water runs along rafters and decking before it drops, so the stain on your ceiling can sit ten feet from the actual failure. We trace it back to the source — usually flashing, a valley, a pipe boot or a chimney counterflashing — and repair the cause instead of smearing sealant over the symptom.",
    image: "/images/gutter-detail.jpg",
    imageAlt: "Close-up of a roof edge, drip edge and gutter detail",
    includes: [
      "Leak tracing from inside the attic wherever there is access",
      "Shingle replacement colour-matched as closely as the existing roof allows",
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
    metaTitle: "Roof Repair & Leak Repair in Southern NH & Northern MA",
    metaDescription:
      "Roof leak repair, shingle replacement and flashing repair across Salem NH, Windham NH, Methuen MA and nearby towns. We find the source, not just the stain.",
  },
  {
    slug: "new-roof-installation",
    name: "New Roof Installation",
    navLabel: "New Roof Installation",
    icon: "new",
    blurb:
      "Roofing for new construction, additions, dormers and garages — coordinated around your build schedule.",
    intro:
      "New construction roofing runs on somebody else's clock. The frame goes up, the building has to be dried in, and every trade behind you is waiting. We schedule around the build rather than around our own calendar, and we install the assembly the design actually calls for — including the ventilation a tight new envelope needs in order to work.",
    image: "/images/roofer-safety.jpg",
    imageAlt: "Roofing crew member in safety gear working on new framing",
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
    metaTitle: "New Roof Installation for New Construction — NH & MA",
    metaDescription:
      "New roof installation for new construction, additions, dormers and garages in Southern New Hampshire and Northern Massachusetts. Scheduled around your build.",
  },
  {
    slug: "storm-damage-repair",
    name: "Emergency & Storm Damage Repair",
    navLabel: "Storm & Emergency Damage",
    icon: "storm",
    featured: true,
    blurb:
      "Wind, ice and fallen-limb damage — stabilised first, documented for your claim, then repaired.",
    intro:
      "Nor'easters and summer thunderstorms are the two events that put roofs on our schedule at short notice. When a section of roof opens up, the order of operations matters: stop the water, photograph everything before it changes, then repair. Working in that order is what lets your insurance carrier see the damage as it actually was.",
    image: "/images/shingle-dark.jpg",
    imageAlt: "Weathered dark asphalt shingles",
    includes: [
      "Temporary tarping and stabilisation to stop active water entry",
      "Photo documentation of the damage for your insurance claim",
      "A written scope of damage you can hand to your adjuster",
      "Wind-lifted and missing shingle replacement",
      "Fallen limb and impact damage repair, including decking where needed",
      "Ice dam damage assessment and the ventilation fix behind it",
    ],
    signals: [
      "Shingles torn off or lifted after a wind storm",
      "A tree limb has come down on the roof",
      "Water entering the house during or after a storm",
      "Ice dams forming along the eaves every winter",
      "Your insurer has asked for a contractor's assessment",
    ],
    metaTitle: "Storm Damage & Emergency Roof Repair — NH & MA",
    metaDescription:
      "Storm and wind damage roof repair, emergency tarping and insurance documentation across Southern NH and Northern MA.",
  },
  {
    slug: "roof-inspections",
    name: "Roof Inspections",
    navLabel: "Roof Inspections",
    icon: "inspect",
    blurb:
      "A documented look at the whole system — field, flashing, ventilation and attic — with photos and a straight recommendation.",
    intro:
      "An inspection is the cheapest thing you will ever do to a roof, and it is where every job with us starts. We go over the field, the flashing, the penetrations and the gutters, and — where there is access — the attic, because half of what kills a roof in New England is happening underneath it. You get photographs and a plain-English recommendation, including the one people do not expect to hear: this roof is fine, call us in three years.",
    image: "/images/hero-roofer.jpg",
    imageAlt: "Roofer inspecting shingles against a clear blue sky",
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
      "It has been several years since anyone looked properly",
    ],
    metaTitle: "Free Roof Inspections — Southern NH & Northern MA",
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
    intro:
      "Roofs rarely fail all at once. They fail at one detail — a lifted nail, a dried-out pipe boot, a valley packed with pine needles — and then water does the rest over two or three winters. Maintenance is the unglamorous business of catching those details while they still cost forty dollars to fix.",
    image: "/images/shingle-texture.jpg",
    imageAlt: "Close-up of architectural asphalt shingles",
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
    metaTitle: "Roof Maintenance Programs — Southern NH & Northern MA",
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
    intro:
      "A commercial roof is a business problem before it is a building problem: water over a stock room or a server rack costs far more than the repair does. We work on small commercial and mixed-use buildings — retail blocks, offices, light industrial, multi-family — and we schedule the loud, disruptive parts around the hours your building is actually empty.",
    image: "/images/aerial-rooftops.jpg",
    imageAlt: "Aerial view of building rooftops",
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
    metaTitle: "Commercial Roofing — Southern NH & Northern MA",
    metaDescription:
      "Commercial and multi-family roofing for small buildings in Southern New Hampshire and Northern Massachusetts. Low-slope membrane, flashing and phased replacement.",
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

export const featuredServices = services.filter((s) => s.featured);
