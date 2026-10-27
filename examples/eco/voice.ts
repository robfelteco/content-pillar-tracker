import type { VoiceRules } from "@/lib/brand/types.ts";

// Brand-specific vocabulary rules, layered on the generic anti-slop engine in
// lib/antiSlop.ts. Everything here is SOFT: it flags and defers to the operator,
// because a regex cannot tell "money movement" said about the legacy system
// from "money movement" said as our own self-description.

export const VOICE: VoiceRules = {
  // Crowded or meaningless as self-description. Signal the orientation through
  // what the product does, never through the phrase.
  commodityPhrases: [
    "for agents", "agent-ready",
    "money movement", "move money", "moves money", "moving money",
    "the future of payments", "payment rails for the internet",
    "makes money programmable",
    "stablecoin network",
    "the neutral platform organizing the stablecoin market",
  ],

  // Words that sit in the hollow column and the ownable column at the same
  // time. Legitimate when the same sentence shows the mechanism, empty when not.
  substantiationGated: ["programmable", "programmability", "trusted", "control"],

  // Senses of a gated word that are not the hollow claim. "Trusted" as a
  // self-description is hollow; "a trusted party controls execution" is the
  // technical critique we make OF the alternatives.
  gatedExceptions: {
    trusted:
      /\btrusted\s+(party|parties|third[- ]party|intermediary|intermediaries|setup|execution|environment|counterparty|entity|custodian|relayer|oracle)\b/i,
  },

  // What counts as substantiation inside the same sentence. Any digit counts too.
  substantiationTerms: [
    "rule", "rules", "ruleset", "rulesets", "parameter", "parameters", "policy", "deadline",
    "slippage", "route", "routes", "routing", "solver", "solvers", "intent", "intents",
    "settle", "settles", "settled", "settlement", "atomic", "atomically", "revert", "reverts",
    "signature", "allowance", "permit", "endpoint", "API", "call", "calls", "quote", "quotes",
    "mint", "redemption", "custody", "counterparty",
  ],

  voiceNote:
    "This account has a second problem: Eco's voice is precise and institutional, which\n" +
    "is the same register current models write in. Sounding rigorous is not evidence of\n" +
    "being human. The number is.",

  contrastExample: {
    before: "This isn't a bridge, it's a routing layer",
    after: "Eco routes and settles the whole flow atomically. A bridge moves one hop.",
  },
};
