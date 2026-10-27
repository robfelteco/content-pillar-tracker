import type { MarketDef } from "@/lib/brand/types.ts";

// The vocabulary of the world the account posts about. STARTER VALUES. The
// pillars and positioning say what the company is; this says what the market
// around it sounds like, so the quote, discovery, education and video lanes
// can tell on-topic from off-topic. For a complete example see
// examples/eco/market.ts.

export const MARKET: MarketDef = {
  name: "<the market, as it reads in a sentence: not in the setup material>",

  // Lowercase substrings that mark an X post as about the market.
  keywords: ["<category keyword>", "<adjacent keyword>"],

  // Whole words that mark a quote as on-domain. Off-domain quotes sink, they
  // do not vanish.
  domainTerms: ["<category noun>", "<mechanism noun>"],

  // Framing a quote card must never amplify, by reason. Leave out what does
  // not apply to your market.
  quoteDisqualifiers: {
    hype: /\b(game[- ]changer|revolutionary|to the moon)\b/i,
  },

  quoteExamples: {
    take: ["<a claim about the market stated as a general truth: not in the setup material>"],
    skipSelfPromo: ["<a speaker announcing their own company's milestone: not in the setup material>"],
    skipPolitics: ["<legislative or regulatory process commentary: not in the setup material>"],
  },

  // The themes an educational post can imply about the company without naming it.
  themes: [
    { id: "hidden_cost", label: "Hidden cost", brief: "A cost the reader already pays and has never measured." },
    { id: "manual_process", label: "Manual process", brief: "Work done by hand that the product does by rule." },
  ],

  // What the discovery lane searches for. Each brief is a search instruction.
  discoveryLenses: [
    {
      id: "market-data",
      label: "Market data",
      brief: "Find a recent, verifiable DATA point or trend in <the market> from data providers or research desks. Each idea is one surprising number the reader has not internalised yet.",
    },
    {
      id: "company-moves",
      label: "Company moves",
      brief: "Find a recent NAMED-company move in <the market> that signals where it is going. Amplify the logo; never bash it.",
    },
  ],

  // Series a short-form clip can belong to. Only read when a pillar drafts from videos.
  clipSeries: [
    { id: "explainer", label: "Explainer", brief: "Someone from the company explaining a mechanism to camera" },
    { id: "interview", label: "Interview clip", brief: "A cut from a podcast or show appearance" },
    { id: "demo", label: "Product demo", brief: "Screen or in-app footage" },
    { id: "third_party", label: "Third-party clip", brief: "Someone outside the company saying something useful" },
  ],

  stopwords: ["market", "markets"],

  angleExamples: {
    frame: "<the old way> costs <X>; <the mechanism> settles the same job for <Y>.",
    mechanism: "<the legacy mechanism>, and why it costs what it costs.",
  },
};
