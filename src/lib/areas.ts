export type StateCode = "NH" | "MA";

export type Town = {
  name: string;
  state: StateCode;
  /** Set when this town has its own landing page */
  slug?: string;
  /** Shown as a "core area" chip on the service areas page */
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
  metaTitle: string;
  metaDescription: string;
  image: string;
  imageAlt: string;
  /** 2–3 paragraphs of genuinely local context */
  body: string[];
  /** What the local housing stock and weather actually do to roofs here */
  localNotes: { title: string; text: string }[];
  /** Neighbouring towns we also cover, for internal linking */
  nearby: string[];
  /** Landmarks / areas, used as light local signal */
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
    metaTitle: "Roofing Company in Salem NH — Replacement, Repair & Inspections",
    metaDescription:
      "RA Brothers Roofing serves Salem, NH with roof replacement, repair, storm damage work and free inspections. Call (603) 560-6170.",
    image: "/images/home-gray.jpg",
    imageAlt: "New England shingle-style home with a dark asphalt shingle roof",
    body: [
      "Salem sits right on the Massachusetts line at the bottom of I-93, and it is the centre of where we work. The housing stock here is a good cross-section of Southern New Hampshire: post-war ranches and split-levels off Route 28 and Lawrence Road, older capes and colonials closer to the village, and newer construction around the Tuscan Village and North Salem end of town.",
      "That mix matters, because those houses do not age the same way. A 1960s split-level typically has a shallower pitch, a single layer of shingles over plank decking, and ventilation that was never really adequate. A 2005 colonial has steeper slopes, more valleys and more penetrations — more places for flashing to fail. We price and inspect them differently for that reason.",
      "If you are comparing quotes in Salem, ask every contractor the same two questions: is the decking being inspected after tear-off, and what is happening with ventilation. Those are the two line items that separate a roof that lasts its full life from one that quietly cooks itself from underneath.",
    ],
    localNotes: [
      {
        title: "Ice dams along the eaves",
        text: "Salem gets the full freeze-thaw cycle. Warm attic air melts snow at the ridge, the water refreezes at the cold eave, and the dam pushes water back up under the shingles. The fix is almost always ventilation and insulation, not just more ice and water shield.",
      },
      {
        title: "Nor'easter wind off the open corridors",
        text: "Wind funnelling along the I-93 and Route 28 corridors lifts shingles at the rakes and ridges first. After a named storm it is worth having the edges looked at even if nothing came off.",
      },
      {
        title: "Mature tree cover in the older neighbourhoods",
        text: "Oak and pine around the village and Canobie Lake end of town fill valleys with debris and shade north slopes enough to hold moss. Both trap moisture against the shingle.",
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
    metaTitle: "Roofing Contractor in Windham NH — Roof Replacement & Repair",
    metaDescription:
      "Roof replacement, repair, inspections and storm damage work in Windham, NH. RA Brothers Roofing — call (603) 560-6170 for a free inspection.",
    image: "/images/home-colonial.jpg",
    imageAlt: "Two-storey New England home with a dark roof",
    body: [
      "Windham is mostly newer, larger homes on wooded lots — a lot of 1990s and 2000s colonials off Range Road, around Cobbetts Pond and up toward the Londonderry line, with the older village stock closer to the centre. Roofs here tend to be complicated: multiple gables, dormers, bump-outs and long valleys, often with an attached garage running off at an angle.",
      "Complexity is where roofs leak. A simple gable roof has almost nothing to go wrong; a house with six valleys, two chimneys, three skylights and a cathedral ceiling has thirty separate details that all have to be right. When we quote in Windham we spend most of the inspection on the transitions rather than the field.",
      "The other Windham-specific issue is tree cover. Heavy pine and oak canopy over a roof keeps the north slope damp for most of the year, drops needles into every valley, and gives limbs somewhere to fall from. That is a maintenance problem more than a replacement problem, and it is much cheaper to treat it as one.",
    ],
    localNotes: [
      {
        title: "Valleys packed with pine needles",
        text: "Wooded lots fill valleys faster than gutters. A blocked valley holds water against the shingle edge through every freeze, which is how a twenty-year roof becomes a twelve-year roof.",
      },
      {
        title: "Cathedral ceilings and tight ventilation",
        text: "A lot of Windham homes have vaulted or cathedral ceilings, which leaves very little room for airflow above the insulation. Get that wrong on a replacement and the new roof ages as badly as the old one.",
      },
      {
        title: "Skylights and dormer flashing",
        text: "Skylights are common in the newer builds here and they are a frequent source of leaks — usually the flashing kit around them rather than the unit itself.",
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
    metaTitle: "Roofing Contractor in Methuen MA — Roof Replacement & Repair",
    metaDescription:
      "Roof replacement, repair, inspections and storm damage work in Methuen, MA. RA Brothers Roofing — call (617) 943-7714 for a free inspection.",
    image: "/images/home-white-flag.jpg",
    imageAlt: "Classic New England two-storey home with black shutters",
    body: [
      "Methuen sits in the Merrimack Valley directly across the line from Salem, which makes it the natural southern half of our service area. The housing here is older on average than it is in Southern New Hampshire — a lot of early and mid-century single-family homes, plus a significant number of two- and three-family properties around the Arlington and Marsh districts.",
      "Older housing stock changes the job. It is far more common in Methuen to find two or even three layers of shingles on a roof, plank decking rather than plywood, and original chimney flashing that has been patched with tar at some point in the last forty years. None of that is a problem — it just has to be found before the quote, not after the tear-off starts.",
      "We also do a lot of multi-family work on this side of the line. If you own a two- or three-family, the practical constraint is usually scheduling around tenants rather than the roof itself, and that is worth talking through before the crew is booked.",
    ],
    localNotes: [
      {
        title: "Two and three layers of existing shingles",
        text: "Common in older Methuen homes. It changes tear-off labour, disposal cost and sometimes the decking underneath, so it belongs in the estimate rather than in a change order.",
      },
      {
        title: "Plank decking instead of plywood",
        text: "Pre-war homes were often sheathed with spaced plank. It is usually fine, but gaps and cupped boards have to be addressed before new shingles go on.",
      },
      {
        title: "Chimney and party-wall flashing",
        text: "Masonry chimneys and shared walls on multi-family properties are the two details we check first here. Tar over old flashing buys a couple of years and then fails all at once.",
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
