import type { PillarDef, PillarShape, RatioBucket, RatioBucketDef } from "@/lib/brand/types.ts";

// The content pillars. STARTER VALUES: keep the ids, rewrite the labels and
// descriptions for your account. For a complete, production-tested set see
// examples/eco/pillars.ts.
//
// The ids are a compile-time union the whole app codes against AND the
// `content_template` enum in db/schema.sql. Adding or renaming a pillar means:
// edit here, run `node scripts/brand-check.ts` for the ALTER TYPE statement,
// apply it, then reclassify. Everything else about a pillar changes freely.
//
// The description is what the classifier reads. Describe SIGNALS a model can
// see in a post (media type, link domains, phrasing, who is named), not what
// you wish the pillar meant.

export const PILLAR_IDS = [
  "data_motion_visual",
  "integration_announcement",
  "quote_card",
  "product_post",
  "thought_leadership",
  "dev_doc_post",
  "broad_educational",
  "short_form_video_eco", // id kept for schema compatibility; the label is yours
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
    id: "data_motion_visual",
    label: "Data Visual",
    description:
      "Animated or static chart presenting market data or statistics. Media is video, GIF or image; the content is a data visualization, not a person or a product demo.",
    draftMode: "dmv",
    staleDays: 10,
    ratioBucket: "soft",
  },
  {
    id: "integration_announcement",
    label: "Integration Announcements",
    description:
      "A new platform, network or partner going live with the company. The integration target is the subject. Signals: 'now supports', 'is live on', 'expanding to'. NOT a customer building on the product (that is product_post), and NOT third-party news about the target (that is broad_educational).",
    draftMode: "chains",
    staleDays: 14,
    ratioBucket: "hard",
  },
  {
    id: "quote_card",
    label: "Quote Card",
    description:
      "Static image containing a large pulled quote with speaker attribution (name, title, company on the card). Copy introduces the speaker and gestures at the quote.",
    draftMode: "discovery",
    staleDays: 14,
    ratioBucket: "edu",
  },
  {
    id: "product_post",
    label: "Product Posts",
    description:
      "Company product content: (1) RELEASES, a new product or feature shipping; (2) EDUCATION, how a product works, the problem it solves, diagrams, demo footage, blog product articles; (3) CUSTOMERS integrating the product into their own apps. Signals: product names, blog product URLs, architecture diagrams, in-app demo footage.",
    draftMode: "products",
    staleDays: 10,
    ratioBucket: "hard",
  },
  {
    id: "thought_leadership",
    label: "Thought Leadership",
    description:
      "Long-form opinion or perspective, often from or featuring a named leader. Essay-like text or links to op-ed style pieces. Includes re-amplification posts that point back at an article already published; the tracker groups those by their underlying article.",
    draftMode: "articles",
    staleDays: 14,
    ratioBucket: "soft",
  },
  {
    id: "dev_doc_post",
    label: "Dev Doc Post",
    description:
      "Posts driving to developer documentation. Signals: links to the docs domain, code snippets, developer-facing language.",
    draftMode: "docs",
    staleDays: 14,
    ratioBucket: "soft",
  },
  {
    id: "broad_educational",
    label: "Broad Educational",
    description:
      "External market content that never mentions the company: external articles, X articles, short clips about what is happening in the market. Signals: external link domains, zero company or product mentions, market-commentary framing.",
    draftMode: "discovery",
    staleDays: 2,
    ratioBucket: "edu",
  },
  {
    id: "short_form_video_eco",
    label: "Short-Form Video",
    description:
      "Short-form video featuring the company: talking-head clips, event clips, explainers where the company is named or shown. Distinct from data_motion_visual (data animation) and from product demo videos (product_post).",
    draftMode: "videos",
    staleDays: 14,
    ratioBucket: "soft",
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

// How a post is BUILT, per pillar. Handed to the drafter verbatim. These are
// reasonable defaults derived from the public X ranking weights; sharpen them
// with what your own corpus shows (see examples/eco/pillars.ts for the shape
// of a measured one).
export const PILLAR_SHAPES: Record<PillarId, PillarShape> = {
  data_motion_visual: {
    form: "Tight, 2-5 short lines. The visual carries the detail; the copy frames one number.",
    build: "Lead with the number, then the one-line so-what. No preamble. If the number needs three sentences of context, it is the wrong number.",
    citable: "A specific figure with its period and source, so it survives being quoted.",
    avoid: "Adjectives instead of comparisons. 'Massive growth' is not a fact; 'up from X in March' is.",
  },
  integration_announcement: {
    form: "Tight, under 280 characters. News is short.",
    build: "Name the target, then what it now makes possible for someone building. One concrete capability beats a list of three.",
    citable: "Builders paste 'X is live on Y' into team channels when it changes what they can ship. Say what changes.",
    avoid: "Press-release cadence. Stacking stats to justify the integration; the integration is the news.",
  },
  quote_card: {
    form: "Tight, 1-3 lines above the card.",
    build: "The card carries the quote, so the copy must not repeat it. Introduce the person and why this claim is worth reading, or state the tension it resolves.",
    citable: "A named voice saying something specific gets screenshotted and forwarded.",
    avoid: "Paraphrasing the quote in the copy.",
  },
  product_post: {
    form: "Mid, 400 to 900 characters. A release runs tight; a mechanism that needs explaining runs longer, in the SAME post.",
    build: "Problem first, mechanism second, product name last. Lead with the constraint a builder recognises, then how it is removed. Link in the body.",
    citable: "An explanation clear enough that someone links it instead of re-explaining the mechanism themselves.",
    avoid: "Capability lists. Stating roadmap as shipped. Ignoring the per-product guardrails.",
  },
  thought_leadership: {
    form: "Mid to long form. One claim runs tight; an argument with steps runs long, in one post.",
    build: "Argue ONE claim pulled out of the piece, do not summarise it. Take a position a reasonable person could disagree with. Link in the body. End on what is still unresolved.",
    citable: "A frame people adopt: restatable in one sentence to a colleague.",
    avoid: "Restating the abstract. Hedging every claim into uselessness.",
  },
  dev_doc_post: {
    form: "Tight. Code or a call signature is welcome.",
    build: "Build the post around ONE mechanism, pain or parameter named on the page, and deep-link to that page. Never the docs homepage.",
    citable: "Developers paste doc links when the link answers a question they were about to ask. Frame the post as that question.",
    avoid: "'Check out our docs.' Marketing language, which this reader punishes.",
  },
  broad_educational: {
    form: "Tight for market news. Long form for a concept that needs steps. Always ONE post.",
    build: "The company is NOT named in the body. For news, lead with the fact and give the so-what in one line. For a concept, earn attention with the parallel, land the point, link the source in the body.",
    citable: "A mechanism explained well, with the institution's own source attached, is reference material people link for years.",
    avoid: "Teaching a mechanism without a source behind it. Triumphalism that loses the reader who knows the old system.",
  },
  short_form_video_eco: {
    form: "Tight, 1-2 lines. The copy only has to earn the play.",
    build: "A question the clip answers, then who is answering it. Lead with the idea inside the clip, never a description of the clip from outside.",
    citable: "A clip gets DM-shared when the copy names the specific claim inside it.",
    avoid: "Describing the video ('Great conversation with...'). Video views are weighted 0.0; write for the reply.",
  },
  other: {
    form: "Tight.",
    build: "One clear idea, front-loaded hook, link in the body if there is one.",
    citable: "Give the reader one thing worth repeating.",
    avoid: "Trying to do two things in one post.",
  },
};
