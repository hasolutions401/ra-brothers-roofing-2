import { PHONE_MA, PHONE_NH, site } from "./site";
import type { Faq } from "./content";

export type StateCode = "NH" | "MA";

export type Town = {
  name: string;
  state: StateCode;
  /** Set when this town has its own landing page */
  slug?: string;
  /** Listed by name in the menu and on the home page */
  core?: boolean;
};

/**
 * Full service area as given by the client. Southern NH first — that is the
 * primary market — with the Northern MA towns closest to Salem behind it.
 */
export const towns: Town[] = [
  // ---- New Hampshire -----------------------------------------------------
  { name: "Salem", state: "NH", slug: "roofing-salem-nh", core: true },
  { name: "Windham", state: "NH", slug: "roofing-windham-nh", core: true },
  { name: "Pelham", state: "NH", core: true },
  { name: "Derry", state: "NH", core: true },
  { name: "Londonderry", state: "NH", core: true },
  { name: "Atkinson", state: "NH", core: true },
  { name: "Plaistow", state: "NH", core: true },
  { name: "Sandown", state: "NH" },
  { name: "Hampstead", state: "NH" },
  { name: "Chester", state: "NH" },
  { name: "Auburn", state: "NH" },
  { name: "Hudson", state: "NH", core: true },
  { name: "Litchfield", state: "NH" },
  { name: "Merrimack", state: "NH" },
  { name: "Nashua", state: "NH", core: true },
  { name: "Raymond", state: "NH" },
  { name: "Fremont", state: "NH" },
  { name: "Kingston", state: "NH" },
  { name: "Newton", state: "NH" },
  { name: "East Kingston", state: "NH" },
  { name: "Exeter", state: "NH" },
  { name: "Epping", state: "NH" },
  { name: "Candia", state: "NH" },
  { name: "Manchester", state: "NH", core: true },
  { name: "Bedford", state: "NH" },
  { name: "Amherst", state: "NH" },
  { name: "Hollis", state: "NH" },
  { name: "Milford", state: "NH" },
  { name: "Brookline", state: "NH" },
  { name: "Hooksett", state: "NH" },
  { name: "Goffstown", state: "NH" },

  // ---- Massachusetts -----------------------------------------------------
  { name: "Methuen", state: "MA", slug: "roofing-methuen-ma", core: true },
  { name: "Lawrence", state: "MA", core: true },
  { name: "Dracut", state: "MA" },
  { name: "Andover", state: "MA", core: true },
  { name: "North Andover", state: "MA", core: true },
  { name: "Haverhill", state: "MA", core: true },
  { name: "Boxford", state: "MA" },
  { name: "West Boxford", state: "MA" },
  { name: "North Reading", state: "MA" },
  { name: "Tewksbury", state: "MA" },
  { name: "Lowell", state: "MA", core: true },
  { name: "Tyngsborough", state: "MA" },
  { name: "Merrimac", state: "MA" },
  { name: "Wilmington", state: "MA" },
  { name: "Chelmsford", state: "MA" },
  { name: "Reading", state: "MA" },
  { name: "Westford", state: "MA" },
  { name: "Burlington", state: "MA" },
  { name: "Lynnfield", state: "MA" },
  { name: "Billerica", state: "MA" },
];

export const nhTowns = towns.filter((t) => t.state === "NH");
export const maTowns = towns.filter((t) => t.state === "MA");
export const coreTowns = towns.filter((t) => t.core);
export const townCount = towns.length;

/** The two states, each with its own line, in display order. */
export const states = [
  { code: "NH" as const, name: "New Hampshire", phone: PHONE_NH, towns: nhTowns },
  { code: "MA" as const, name: "Massachusetts", phone: PHONE_MA, towns: maTowns },
];

// ---------------------------------------------------------------------------
// Town landing pages. Three to start; the pattern scales to all 51.
// ---------------------------------------------------------------------------

export type TownPage = {
  slug: string;
  town: string;
  state: StateCode;
  zip: string;
  county: string;
  /** H1 on the page */
  heading: string;
  /** Page part of the <title>; keep it under ~40 characters. */
  metaTitle: string;
  metaDescription: string;
  /** An /images/<name> path. Stock — never captioned as a photo of this town. */
  image: string;
  imageAlt: string;
  /** 2–3 paragraphs of genuinely local context */
  body: string[];
  /** What the local housing stock and weather do to roofs here */
  localNotes: { title: string; text: string }[];
  /** Questions specific to this town, shown before the general ones */
  faqs: Faq[];
  /** Neighbouring towns we also cover, for internal linking */
  nearby: string[];
  /** Landmarks and neighbourhoods, used as light local signal */
  landmarks: string[];
};

export const townPages: TownPage[] = [
  {
    slug: "roofing-salem-nh",
    town: "Salem",
    state: "NH",
    zip: "03079",
    county: "Rockingham County",
    heading: "Roofing Company in Salem, NH",
    metaTitle: "Roofing Company in Salem, NH",
    metaDescription: `${site.name} serves Salem, NH with roof replacement, repair, storm damage and insurance claims, and free estimates. Call ${PHONE_NH.display}.`,
    image: "/images/home-cape",
    imageAlt: "Cape-style New England home with a gray asphalt shingle roof",
    body: [
      "Salem sits right on the Massachusetts line at the bottom of I-93, and it is the centre of where we work. The housing stock here is a good cross-section of Southern New Hampshire: post-war ranches and split-levels off Route 28 and Lawrence Road, older capes and colonials closer to the village, and newer construction around the Tuscan Village and North Salem end of town.",
      "That mix matters when planning roof work. On an older split-level, ask about pitch, existing roof layers, decking and ventilation. On a colonial with dormers or intersecting rooflines, valleys and flashing deserve particular attention. The actual construction and condition of the house should guide the estimate.",
      "If you are comparing quotes in Salem, ask every contractor the same two questions: is the decking being inspected after tear-off, and what is happening with ventilation? Those two line items separate a roof that lasts its full life from one that quietly cooks itself from underneath.",
    ],
    localNotes: [
      {
        title: "Ice dams along the eaves",
        text: "Salem gets the full freeze-thaw cycle. Warm attic air melts snow at the ridge, the water refreezes at the cold eave, and the dam pushes water back up under the shingles. The fix is almost always ventilation and insulation, not just more ice and water shield.",
      },
      {
        title: "Wind at exposed roof edges",
        text: "After strong winds, look from the ground for missing shingles or disturbed roof edges. Damage is not always visible from below, so mention the storm when arranging an inspection.",
      },
      {
        title: "Mature trees in the older neighbourhoods",
        text: "Oak and pine around the village and the Canobie Lake end of town fill valleys with debris and shade north slopes enough to hold moss. Both trap moisture against the shingle.",
      },
    ],
    faqs: [
      {
        q: "My house is a 1960s split-level off Route 28. Is re-roofing it any different?",
        a: "It can be. The roof pitch, number of existing layers, decking and ventilation all affect the scope. The age and style of the house are useful starting points, but those details need checking on the property rather than assuming every split-level was built the same way.",
      },
      {
        q: "Which number should I call from Salem?",
        a: `The New Hampshire line, ${PHONE_NH.display}. Calls from Salem are answered on that number during business hours.`,
      },
    ],
    nearby: ["Windham", "Pelham", "Atkinson", "Derry", "Londonderry", "Methuen"],
    landmarks: [
      "Tuscan Village",
      "Canobie Lake",
      "North Salem",
      "Route 28 corridor",
      "Salem Village",
    ],
  },
  {
    slug: "roofing-windham-nh",
    town: "Windham",
    state: "NH",
    zip: "03087",
    county: "Rockingham County",
    heading: "Roofing Contractor in Windham, NH",
    metaTitle: "Roofing Contractor in Windham, NH",
    metaDescription: `Roof replacement, repair, inspections and storm damage work in Windham, NH. ${site.name}: call ${PHONE_NH.display} for a free estimate.`,
    image: "/images/colonial-asphalt-roof",
    imageAlt: "White New England colonial with black shutters and a dark roof",
    body: [
      "Windham is mostly newer, larger homes on wooded lots: a lot of 1990s and 2000s colonials off Range Road, around Cobbetts Pond and up toward the Londonderry line, with the older village stock closer to the centre. Roofs here tend to be complicated, with multiple gables, dormers, bump-outs and long valleys, often with an attached garage running off at an angle.",
      "Complexity is where roofs leak. A simple gable roof has almost nothing to go wrong; a house with six valleys, two chimneys, three skylights and a cathedral ceiling has thirty separate details that all have to be right. When we quote in Windham we spend most of the inspection on the transitions rather than the open field of the roof.",
      "The other Windham-specific issue is tree cover. Heavy pine and oak canopy keeps the north slope damp for most of the year, drops needles into every valley and gives limbs somewhere to fall from. That is a maintenance problem more than a replacement problem, and it is much cheaper to treat it as one.",
    ],
    localNotes: [
      {
        title: "Valleys packed with pine needles",
        text: "On wooded lots, needles and leaves can collect where roof slopes meet. Debris can obstruct drainage and hold moisture against the roofing, so include valleys in a seasonal maintenance check.",
      },
      {
        title: "Cathedral ceilings and tight ventilation",
        text: "A lot of Windham homes have vaulted or cathedral ceilings, which leaves very little room for airflow above the insulation. Get that wrong on a replacement and the new roof ages as badly as the old one.",
      },
      {
        title: "Skylights and dormer flashing",
        text: "Skylights are common in the newer builds here and a frequent source of leaks, usually the flashing kit around them rather than the unit itself.",
      },
    ],
    faqs: [
      {
        q: "Can you improve ventilation over a cathedral ceiling?",
        a: "Often, yes, but it takes planning. Vaulted ceilings leave little room for air above the insulation, so the right fix depends on the rafter depth and what is already there. We look at it before quoting a replacement, because getting it wrong means the new roof ages as badly as the old one.",
      },
      {
        q: "Do pine needles in the valleys really shorten a roof's life?",
        a: "They do. A packed valley holds water against the shingle edges through every freeze. Clearing valleys once or twice a year is cheap maintenance, and on a wooded Windham lot it is one of the best things you can do for a roof.",
      },
    ],
    nearby: ["Salem", "Pelham", "Derry", "Londonderry", "Hudson", "Atkinson"],
    landmarks: [
      "Cobbetts Pond",
      "Range Road",
      "Windham Village",
      "Exit 3 off I-93",
      "Searles School",
    ],
  },
  {
    slug: "roofing-methuen-ma",
    town: "Methuen",
    state: "MA",
    zip: "01844",
    county: "Essex County",
    heading: "Roofing Contractor in Methuen, MA",
    metaTitle: "Roofing Contractor in Methuen, MA",
    metaDescription: `Roof replacement, repair, inspections and storm damage work in Methuen, MA. ${site.name}: call ${PHONE_MA.display} for a free estimate.`,
    image: "/images/home-white-colonial",
    imageAlt: "White two-storey New England home with black shutters",
    body: [
      "Methuen sits in the Merrimack Valley directly across the line from Salem, which makes it the natural southern half of our service area. The housing here is older on average than in Southern New Hampshire: a lot of early and mid-century single-family homes, plus a significant number of two- and three-family properties around the Arlington and Marsh districts.",
      "Older housing stock changes the job. It is far more common in Methuen to find two or even three layers of shingles on a roof, plank decking rather than plywood, and original chimney flashing that has been patched with tar at some point in the last forty years. None of that is a problem. It just has to be found before the quote, not after the tear-off starts.",
      "Multi-family homes are common on this side of the line. If you own a two- or three-family, the practical constraint is usually scheduling around tenants rather than the roof itself, and that is worth talking through before a crew is booked.",
    ],
    localNotes: [
      {
        title: "Two and three layers of shingles",
        text: "Common in older Methuen homes. It changes tear-off labour, disposal cost and sometimes the decking underneath, so it belongs in the estimate rather than in a change order.",
      },
      {
        title: "Plank decking instead of plywood",
        text: "Pre-war homes were often sheathed with spaced plank. It is usually fine, but gaps and cupped boards have to be dealt with before new shingles go on.",
      },
      {
        title: "Chimney and party-wall flashing",
        text: "Chimneys and shared walls on multi-family properties create roof junctions that deserve a close look. Ask whether old flashing can be repaired or needs replacement; a surface coating alone may not address the cause of a leak.",
      },
    ],
    faqs: [
      {
        q: "My roof already has two layers of shingles. Can you put a third on top?",
        a: "We do not recommend it, and building codes generally do not allow a third layer. A full tear-off also lets us check the decking underneath, which on older Methuen homes is often plank rather than plywood.",
      },
      {
        q: "I own a two- or three-family. How do you handle tenants?",
        a: "We agree the dates with you first, then give you notice to pass on: when the crew arrives, when it will be noisy and what access we need. On a multi-family roof, scheduling around tenants is usually the main planning job.",
      },
      {
        q: "Which number should I call from Methuen?",
        a: `The Massachusetts line, ${PHONE_MA.display}. Calls from Methuen are answered on that number during business hours.`,
      },
    ],
    nearby: ["Salem", "Lawrence", "Andover", "North Andover", "Haverhill", "Dracut"],
    landmarks: [
      "Arlington district",
      "Marsh district",
      "Merrimack River valley",
      "Route 213",
      "Nevins Library area",
    ],
  },
];

export const townPageBySlug = (slug: string) =>
  townPages.find((t) => t.slug === slug);

export const townPageFor = (name: string) =>
  townPages.find((t) => t.town.toLowerCase() === name.toLowerCase());
