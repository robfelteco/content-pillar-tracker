import type { PillarDef, PillarShape, RatioBucket, RatioBucketDef } from "@/lib/brand/types.ts";

// The content pillars: Eco's nine. Ids are stored as text; each pillar declares
// the source it drafts from (draftMode), its media and its traits, and the
// core reads those rather than the id. Renaming an id after posts are
// classified means reclassifying them (scripts/reclassify.ts).

export const PILLAR_IDS = [
  "data_motion_visual",
  "integration_announcement",
  "quote_card",
  "product_post",
  "thought_leadership",
  "dev_doc_post",
  "broad_educational",
  "short_form_video_eco",
  "other",
] as const;

export type PillarId = (typeof PILLAR_IDS)[number];

// The 4-1-1: four educational posts for every soft promo and every hard promo.
export const RATIO_BUCKETS: Record<RatioBucket, RatioBucketDef> = {
  edu: {
    label: "Educational",
    target: 4,
    hint: "Content the audience would read if Eco did not exist: external market news, mechanism explainers, outside voices.",
  },
  soft: {
    label: "Soft promo",
    target: 1,
    hint: "Eco is in the frame but the post is still worth something on its own: a clip, an essay, a docs walkthrough.",
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
    label: "Data Motion Visual",
    description:
      "Animated/motion video presenting market data, charts, or stats (usually stablecoin market numbers). Media is video or GIF; content is a data visualization, not a person or a product demo.",
    draftMode: "dmv",
    media: ["video", "animated_gif"],
    visualAnchor: true,
    easyWin: true,
    staleDays: 10,
    ratioBucket: "soft",
  },
  {
    id: "integration_announcement",
    label: "New Chain Integrations in Eco",
    description:
      "A new BLOCKCHAIN going live in Eco — Eco Routes expanding coverage to a chain. The chain is the subject of the announcement. Signals: 'Eco now supports @chain', 'Eco is live on @chain', 'expanding coverage to <chain>', 'Routes is live on <chain>', chain stats used to justify the integration. NOT a company/partner integrating an Eco product into their own app (that is product_post), and NOT third-party market news about a chain (that is broad_educational).",
    draftMode: "chains",
    media: ["photo", "link-card"],
    visualAnchor: true,
    staleDays: 14,
    ratioBucket: "hard",
  },
  {
    id: "quote_card",
    label: "Quote Card",
    description:
      "Static image containing a large pulled quote with speaker attribution (name/title/company on the card). Copy typically introduces the speaker and gestures at the quote.",
    draftMode: "quotes",
    media: ["photo"],
    visualAnchor: true,
    easyWin: true,
    staleDays: 14,
    ratioBucket: "edu",
  },
  {
    id: "product_post",
    label: "Product Posts",
    description:
      "Eco product content, in three flavours: (1) PRODUCT RELEASES — a new Eco product or feature shipping; (2) PRODUCT EDUCATION — how a product works, the problem it solves, architecture diagrams, lifecycle explainers, demo footage, eco.com/blog product articles; (3) PARTNERS INTEGRATING ECO infra/products into their own apps (e.g. Para shipping Permit3, LI.FI/Jumper routing through Eco, Circle Gateway powering Eco order size). Signals: Eco product names (Routes, Verified Liquidity, Programmable Addresses, Permit3, Flash Intents, Fast Deposits), eco.com/blog product URLs, architecture diagrams, in-app demo footage, '<partner> integrated <Eco product>'. A partner/company integration belongs HERE — the chain bucket is only for new blockchains going live in Eco.",
    draftMode: "products",
    media: ["video", "animated_gif", "photo", "link-card", "text"],
    visualAnchor: true,
    staleDays: 10,
    ratioBucket: "hard",
  },
  {
    id: "thought_leadership",
    label: "Thought Leadership",
    description:
      "Long-form opinion/perspective articles or posts, often from or featuring our CEO. Essay-like text or links to op-ed style pieces. Includes the many re-amplification posts that point back at an article already published — the tracker groups those by their underlying article rather than counting each as a new piece.",
    draftMode: "articles",
    media: ["link-card", "text"],
    teaches: true,
    staleDays: 14,
    ratioBucket: "soft",
  },
  {
    id: "dev_doc_post",
    label: "Dev Doc Post",
    description:
      "Posts driving to developer documentation. Signals: links to docs.eco.com, code snippets, developer-facing language. Optional sub-tag: soft_sell vs hard_sell.",
    draftMode: "docs",
    media: ["link-card"],
    visualAnchor: true,
    staleDays: 14,
    ratioBucket: "soft",
  },
  {
    id: "broad_educational",
    label: "Broad Educational",
    description:
      "External stablecoin-market content that never mentions Eco: external articles, external X articles, short clips about what's happening in the stablecoin space. Signals: external link domains, zero Eco/product mentions, market-commentary framing.",
    draftMode: "education",
    media: ["text"],
    externalOnly: true,
    teaches: true,
    // At ~10 main posts a week the 4-1-1 needs six or seven of these a week,
    // so the cadence is days, not the 10 the other pillars run on.
    staleDays: 2,
    ratioBucket: "edu",
  },
  {
    id: "short_form_video_eco",
    label: "Short-Form Video (Eco)",
    description:
      "Short-form video featuring Eco (talking-head clips, event clips, explainers where Eco is named or shown). Distinct from data_motion_visual (data animation) and from product demo videos (which are product_post).",
    draftMode: "videos",
    media: ["video", "animated_gif"],
    visualAnchor: true,
    staleDays: 14,
    ratioBucket: "soft",
  },
  {
    id: "other",
    label: "Other / Review",
    description:
      "Doesn't fit any bucket. Surfaces in the review queue so we can decide whether the taxonomy needs a new bucket.",
    draftMode: "generic",
    staleDays: 9999,
    ratioBucket: null,
  },
];

// How a post is BUILT, per pillar. Derived from the public X ranking weights
// (links in body, one topic, 48-hour window) and from what this account's own
// corpus shows. Where a number exists it is stated.
export const PILLAR_SHAPES: Record<PillarId, PillarShape> = {
  data_motion_visual: {
    form: "Tight, 2-5 short lines. The animation carries the visual; the copy exists to frame one number.",
    build:
      "Lead with the number, not the setup. One statistic, stated plainly, then the one-line so-what that tells the reader why it is surprising. No preamble, no 'we dug into the data'. If the number needs three sentences of context to land, it is the wrong number.",
    citable:
      "A specific figure someone can quote. This is the pillar most likely to earn a copy-link share, because a number with a clear source is the most pasteable object on the platform. Name the period and the source of the figure so it survives being quoted.",
    avoid:
      "Decorating a number with adjectives instead of comparing it to something. 'Massive growth' is not a fact; 'up from $X in March' is.",
  },
  integration_announcement: {
    form: "Tight, under 280 characters. A chain going live is news, and news is short.",
    build:
      "Name the chain, then what it now makes possible for someone building. One concrete capability beats a list of three. The chain's own audience is the reach mechanism here, so make the post something that community would want to quote.",
    citable:
      "Builders paste 'X is live on Y' into their team channels when it changes what they can ship. Say what changes, not that we are excited.",
    avoid:
      "Press-release cadence ('We are thrilled to announce'). Also avoid stacking chain stats to justify the integration; the integration is the news.",
  },
  quote_card: {
    form: "Tight, 1-3 lines above the card.",
    build:
      "The card carries the quote, so the copy must not repeat it. Introduce the person and why this particular claim is worth reading, or state the tension the quote resolves. Attribute by handle when they have one.",
    citable:
      "A named institutional voice saying something specific gets screenshotted and forwarded. The copy's job is to make the reader stop long enough to read the card.",
    avoid: "Paraphrasing the quote in the copy, which gives the reader no reason to look at the card.",
  },
  product_post: {
    form: "Mid, 400 to 900 characters. A release can run tight; a mechanism that needs explaining runs longer, in the SAME post.",
    build:
      "Problem first, mechanism second, product name last. Lead with the constraint a builder recognises, then how it is removed. Put the docs or blog link in the body. For a partner integration, the partner's shipped thing is the proof, so lead with what they built.",
    citable:
      "An explanation clear enough that someone links it instead of re-explaining the mechanism themselves. That is the bar for this pillar: replace a paragraph someone would otherwise have to type.",
    avoid: "Capability lists. Also never state roadmap as shipped, and respect the per-product guardrails handed to you.",
  },
  thought_leadership: {
    form: "Mid to long form. One claim runs tight; an argument with steps and a handled objection runs long, in one post.",
    build:
      "Argue ONE claim pulled out of the piece, do not summarise it. Take a position a reasonable person could disagree with, then support it. Link the piece in the body. End on the part that is still unresolved, which is what earns a considered reply instead of agreement.",
    citable:
      "A frame people adopt. If a reader can restate the argument in one sentence to a colleague, it travels; if it needs the whole post to make sense, it does not.",
    avoid: "Restating the article's abstract. Also avoid hedging every claim into uselessness, which is the failure mode of institutional voice.",
  },
  dev_doc_post: {
    form: "Tight. Code or a call signature is welcome.",
    build:
      "Build the post around ONE specific mechanism, pain or parameter named on the page, and deep-link to that page in the body. Never the docs homepage: in this corpus deep-linked posts run roughly double the impressions of homepage posts, so the specificity is the strategy, not a nicety.",
    citable: "Developers paste doc links when the link answers a question they were about to ask. Frame the post as the question that page answers.",
    avoid: "'Check out our docs.' Also avoid marketing language, which this reader punishes.",
  },
  broad_educational: {
    form: "Tight for market news. Long form for a curriculum concept, since a mechanism needs steps. Always ONE post either way.",
    build:
      "Eco is NOT named in the body: this is top-of-funnel and Eco's relevance should be inferable, never stated. For news, lead with the fact and give the so-what in one line. For a curriculum concept, earn attention with the parallel and land the break, then link the source in the body.",
    citable:
      "This is the pillar built for the 20.0 signal. A mechanism explained well, with the institution's own source attached, is reference material people link for years. Write it so it is still worth pasting in six months.",
    avoid:
      "Teaching a mechanism without a source behind it. Also avoid crypto triumphalism, which loses the institutional reader who knows the old system better than we do.",
  },
  short_form_video_eco: {
    form: "Tight, 1-2 lines. The copy sits above the video and only has to earn the play.",
    build:
      "The proven shape in this corpus is a question the clip answers, then who is answering it. Lead with the idea inside the clip, never a description of the clip from outside. Refer to the speaker by their exact handle.",
    citable: "A clip gets DM-shared when the copy names the specific claim inside it. 'Worth a watch' gets nothing.",
    avoid:
      "Describing the video ('Great conversation with...'). Also note video quality views are weighted 0.0, so do not write for the view, write for the reply.",
  },
  other: {
    form: "Tight.",
    build: "One clear idea, front-loaded hook, link in the body if there is one.",
    citable: "Give the reader one thing worth repeating.",
    avoid: "Trying to do two things in one post.",
  },
};
