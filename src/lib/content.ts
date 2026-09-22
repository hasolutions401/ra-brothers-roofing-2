export const processSteps = [
  {
    title: "Tell us what is going on",
    text: "Call or send the form. We will ask what you are seeing, how long it has been happening and roughly when the roof was last done. That is usually enough to know whether this is a repair or a replacement. We call back within one business day.",
  },
  {
    title: "We assess the roof",
    text: "Often we can price the job from your photos and aerial imagery of the roof, with no visit needed. When a roof needs a closer look, such as an active leak, storm damage or an insurance claim, we come out, check the flashing, valleys and attic, and photograph anything we flag. Either way, the estimate is free.",
  },
  {
    title: "You get a written estimate",
    text: "Itemised and in writing, with the scope spelled out. If something cannot be seen until tear-off (decking is the usual one), the estimate tells you up front what it would cost, so it never turns into a surprise on the day.",
  },
  {
    title: "We schedule and do the work",
    text: "We agree a date, tell you what access we need and when it will be noisy, and clean up at the end of every day, including a magnetic sweep of the drive and lawn.",
  },
];

export const differentiators = [
  {
    title: "Free estimates, often without a visit",
    text: "Send a few photos and your address and we can usually price the job from those and aerial imagery of the roof. No appointment to wait for, no obligation, and free for repairs as well as replacements.",
  },
  {
    title: "A fair price, in writing",
    text: "Every estimate spells out what comes off, what goes back on and what happens if we find bad decking, so you can put our quote beside anyone else's and compare them line for line.",
  },
  {
    title: "Help with your insurance claim",
    text: "Storm damage is stressful enough. We document the damage, write a scope your adjuster can work from, and meet the adjuster at the property so nothing gets missed.",
  },
  {
    title: "Backed by a satisfaction guarantee",
    text: "We started this company to give people a roofer they can trust at a fair price. If you are not satisfied with the work, tell us and we will make it right.",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Do you charge for an estimate?",
    a: "No. Estimates are free for repairs as well as replacements and new roofs, and if your roof does not need work yet, that is what we will tell you.",
  },
  {
    q: "Do you need to come out to give me an estimate?",
    a: "Not always. For many jobs we can price the work from photos you send and aerial imagery of your roof, which is faster for you. We come out when a job needs it: active leaks, storm damage, insurance claims, or anything a picture cannot show.",
  },
  {
    q: "How quickly will I hear back?",
    a: "Within one business day of your call or form, and often the same day if you reach us during business hours.",
  },
  {
    q: "How do I know whether I need a repair or a full replacement?",
    a: "Look at the cause and extent of the problem as well as the roof's age. A localised flashing or pipe-boot failure may be repairable, while widespread deterioration can make replacement more practical. An inspection should explain the condition of the roof and the options before you decide.",
  },
  {
    q: "How long does a roof replacement take?",
    a: "A straightforward single-family asphalt shingle roof typically takes one to two working days from tear-off to clean-up. Complex rooflines with several valleys, dormers or steep pitches take longer, as does any job where a lot of decking needs replacing. The expected duration is in writing with the estimate.",
  },
  {
    q: "What happens if you find rotted decking after tear-off?",
    a: "We stop and show you. Rotted or soft sheathing is the one thing nobody can see until the old shingles are off, so the estimate prices it per sheet. You know the unit cost before we start, and you approve the quantity before we replace anything.",
  },
  {
    q: "How long does a new asphalt shingle roof last around here?",
    a: "There is no single lifespan that applies to every asphalt roof. The product, installation, ventilation, exposure and maintenance all matter. Check the condition of the shingles and flashing as the roof ages, and ask what the manufacturer's coverage includes separately from the expected service life.",
  },
  {
    q: "Do you work in the winter?",
    a: "Repairs, yes. Full replacements depend on temperature, because asphalt shingles need warmth to seal. A mid-January tear-off is usually the wrong call unless the roof has failed, and we will tell you if waiting for spring makes more sense.",
  },
  {
    q: "Can you help with my insurance claim?",
    a: "Yes, it is a big part of storm damage work. We inspect and photograph the damage, write a detailed scope, meet your adjuster at the property and point out anything the adjuster's estimate missed so it can be added. The claim stays in your name and the decision is your insurer's, but you will not be handling the roofing side of it on your own.",
  },
  {
    q: "Which towns do you cover?",
    a: "We are starting in Southern New Hampshire, centred on Salem, plus the Northern Massachusetts towns closest to the line. The full list is on the service areas page. If you are just outside it, call anyway and we will tell you whether we can help.",
  },
];

/** Homeowner observations for discussion, not a diagnostic score. */
export const warningSigns = [
  "Shingles cupping, curling or lifting at the edges",
  "Granules collecting in the gutters or at the downspouts",
  "Water stains on a ceiling or an upstairs wall",
  "Daylight visible through the attic roof boards",
  "Ice dams building along the eaves each winter",
  "Dark streaking or moss on the shaded slope",
  "A roof over eighteen years old that has never been inspected",
  "Flashing at the chimney that has been patched with tar",
];
