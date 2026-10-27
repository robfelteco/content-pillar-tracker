import type { VoiceRules } from "@/lib/brand/types.ts";

// Brand-specific vocabulary rules, layered on the generic anti-slop engine in
// lib/antiSlop.ts. STARTER VALUES. Everything here is SOFT: it flags and defers
// to the operator. The generic bans (em dashes, threads, "delve", engagement
// bait, the 2026 register budget) live in lib/antiSlop.ts and apply to everyone.

export const VOICE: VoiceRules = {
  // Phrases your market has worn out, or that you have decided say nothing
  // as self-description. Start with the ones your own posts overuse.
  commodityPhrases: ["the future of", "next-generation platform", "end-to-end solution"],

  // Words that are a claim only when the same sentence shows the mechanism or
  // number behind them. Allowed with evidence, flagged when bare.
  substantiationGated: ["secure", "scalable", "trusted", "reliable"],

  // Senses of a gated word that are not the hollow claim.
  gatedExceptions: {
    trusted: /\btrusted\s+(party|parties|third[- ]party|intermediary|intermediaries|setup|execution|environment|counterparty|entity)\b/i,
  },

  // What counts as substantiation inside the same sentence. Any digit also counts.
  substantiationTerms: [
    "rule", "rules", "parameter", "parameters", "policy", "deadline", "latency", "throughput",
    "signature", "endpoint", "API", "call", "calls", "audit", "SLA", "uptime", "retry", "retries",
  ],

  voiceNote:
    "This account has a second problem: a precise, professional register is the same register\n" +
    "current models write in. Sounding rigorous is not evidence of being human. The number is.",

  contrastExample: {
    before: "This isn't a dashboard, it's a control plane",
    after: "Acme applies the policy before the request runs. A dashboard shows you what already happened.",
  },
};
