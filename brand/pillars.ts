import type { PillarDef, PillarShape, RatioBucket, RatioBucketDef } from "@/lib/brand/types.ts";

// The content pillars. STARTER VALUES: a small generic set to edit, rename or
// replace. For a complete, production-tested set of nine see
// examples/eco/pillars.ts.
//
// A brand defines its own pillars. Each one declares:
//   draftMode   the SOURCE it drafts from (see lib/brand/types.ts DraftMode);
//               the Prioritize card and the shelves key on this, never on the id
//   media       which media kinds a post in it can carry; the rule classifier
//               narrows by this before any model call
//   traits      externalOnly (company never named), visualAnchor (the image is
//               the identity), teaches (explanation is the job), easyWin
// The description is what the classifier reads: describe SIGNALS a model can
// see in a post, not what you wish the pillar meant, and name the neighbour it
// is confused with ("NOT x, that is pillar_y").
//
// Ids are stored as text in the database, so any snake_case id works. `other`
// must exist: the review queue routes to it. Renaming an id after posts are
// classified means reclassifying them (scripts/reclassify.ts).

export const PILLAR_IDS = [
  "announcement",
  "explainer",
  "industry_news",
  "quote",
  "other",
] as const;

export type PillarId = (typeof PILLAR_IDS)[number];

// The posting ratio the account aims for. 4-1-1 means four educational posts
// for every soft promo and every hard promo. Change the targets, not the keys.
export const RATIO_BUCKETS: Record<RatioBucket, RatioBucketDef> = {
  edu: {
    label: "Educational",
    target: 4,
    hint: "Content the audience would read if the company did not exist: market news, mechanism explainers, outside voices.",
  },
  soft: {
    label: "Soft promo",
    target: 1,
    hint: "The company is in the frame but the post is still worth something on its own: a clip, an essay, a docs walkthrough.",
  },
  hard: {
    label: "Hard promo",
    target: 1,
    hint: "The post exists to announce or sell: a product, an integration, a partner.",
  },
};

export const PILLAR_DEFS: PillarDef<PillarId>[] = [
  {
    id: "announcement",
    label: "Announcements",
    description:
      "Company product content: a new product or feature shipping, how a product works, a customer running it. Signals: product names, blog product URLs, architecture diagrams, demo footage, '<customer> is using <product>'. NOT third-party news about the market (that is industry_news).",
    draftMode: "products",
    staleDays: 10,
    ratioBucket: "hard",
    media: ["video", "animated_gif", "photo", "link-card", "text"],
    visualAnchor: true,
  },
  {
    id: "explainer",
    label: "Explainers",
    description:
      "Long-form perspective or explanation from the company: an essay, an argument, a mechanism explained, often linking to a piece on the company blog, often featuring a named leader. Signals: essay-like text, blog links, a claim with reasoning. NOT a product release (that is announcement).",
    draftMode: "articles",
    staleDays: 14,
    ratioBucket: "soft",
    media: ["link-card", "text"],
    teaches: true,
  },
  {
    id: "industry_news",
    label: "Industry News",
    description:
      "External market content that never mentions the company: an external article, report or data point with a line of so-what. Signals: external link domains, zero company or product mentions, market-commentary framing. NOT the company's own essays (that is explainer).",
    draftMode: "education",
    staleDays: 3,
    ratioBucket: "edu",
    media: ["text", "link-card"],
    externalOnly: true,
    teaches: true,
  },
  {
    id: "quote",
    label: "Quote Cards",
    description:
      "Static image containing a large pulled quote with speaker attribution (name, title, company on the card). Copy introduces the speaker and gestures at the quote.",
    draftMode: "quotes",
    staleDays: 14,
    ratioBucket: "edu",
    media: ["photo"],
    visualAnchor: true,
    easyWin: true,
  },
  {
    id: "other",
    label: "Other / Review",
    description: "Doesn't fit any bucket. Surfaces in the review queue so we can decide whether the taxonomy needs a new bucket.",
    draftMode: "generic",
    staleDays: 9999,
    ratioBucket: null,
  },
];

// How a post is BUILT, per pillar. Handed to the drafter verbatim. Reasonable
// defaults derived from the public X ranking weights; sharpen them with what
// your own corpus shows (see examples/eco/pillars.ts for measured ones).
export const PILLAR_SHAPES: Record<PillarId, PillarShape> = {
  announcement: {
    form: "Mid, 400 to 900 characters. A release runs tight; a mechanism that needs explaining runs longer, in the SAME post.",
    build: "Problem first, mechanism second, product name last. Lead with the constraint the reader recognises, then how it is removed. Link in the body.",
    citable: "An explanation clear enough that someone links it instead of re-explaining the mechanism themselves.",
    avoid: "Capability lists. Stating roadmap as shipped. Ignoring the per-product guardrails.",
  },
  explainer: {
    form: "Mid to long form. One claim runs tight; an argument with steps runs long, in one post.",
    build: "Argue ONE claim pulled out of the piece, do not summarise it. Take a position a reasonable person could disagree with. Link in the body. End on what is still unresolved.",
    citable: "A frame people adopt: restatable in one sentence to a colleague.",
    avoid: "Restating the abstract. Hedging every claim into uselessness.",
  },
  industry_news: {
    form: "Tight for news. Long form for a concept that needs steps. Always ONE post.",
    build: "The company is NOT named in the body. Lead with the fact and give the so-what in one line. For a concept, earn attention with the parallel, land the point, link the source in the body.",
    citable: "A mechanism explained well, with the institution's own source attached, is reference material people link for years.",
    avoid: "Teaching a mechanism without a source behind it. Triumphalism that loses the reader who knows the old system.",
  },
  quote: {
    form: "Tight, 1-3 lines above the card.",
    build: "The card carries the quote, so the copy must not repeat it. Introduce the person and why this claim is worth reading, or state the tension it resolves.",
    citable: "A named voice saying something specific gets screenshotted and forwarded.",
    avoid: "Paraphrasing the quote in the copy.",
  },
  other: {
    form: "Tight.",
    build: "One clear idea, front-loaded hook, link in the body if there is one.",
    citable: "Give the reader one thing worth repeating.",
    avoid: "Trying to do two things in one post.",
  },
};
