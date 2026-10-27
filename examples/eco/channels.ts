import type { ChannelDef } from "@/lib/brand/types.ts";

// YouTube channels the curriculum lane watches. Editorial judgment lives here
// (interested party, worth taking Shorts, hit rate); rotation state lives in
// the database. These channels are also seeded into the quote lane's watch
// sources (brand/quoteRoster.ts) so one transcript serves both consumers.

export const CHANNEL_DEFS: ChannelDef[] = [
  {
    id: "UC03s4ohGxrFSMHxGR8DMzZg",
    handle: "@moneycodepod",
    label: "Money Code",
    interestedParty: true,
    takeShorts: true,
    note:
      "Stablecoin operator interviews, presented by Stablecon and powered by BVNK. " +
      "Densest fit of the three: recent episodes map almost one-for-one onto Tier 2 " +
      "concepts (correspondent banking, prefunding and trapped liquidity, local " +
      "liquidity, SWIFT). Guests are practitioners describing their own operations, " +
      "so numbers are self-reported.",
  },
  {
    id: "UC8SaXHFAqVHUjE2OLUFakjw",
    handle: "@TokenizedPodcast",
    label: "Tokenized",
    interestedParty: true,
    takeShorts: true,
    note:
      "Co-hosted by Cuy Sheffield (head of crypto, Visa) and Simon Taylor (Fintech " +
      "Brainfood), explicitly made for regulators, bankers and payments " +
      "professionals — the commercial door the curriculum is aimed at. Uses recent " +
      "news to frame market structure, which is exactly the 'current' layer the " +
      "institutional lane cannot produce.",
  },
  {
    id: "UCoX2V7454TPPAhWu172lGGQ",
    handle: "@WhatsNextwithPhilipMeissner",
    label: "What's Next with Philip Meissner",
    interestedParty: false,
    takeShorts: false,
    note:
      "Broad technology and innovation podcast, 942k subscribers. Mostly talent, " +
      "geopolitics, leadership and AI, with an occasional stablecoin or payments " +
      "episode. Low hit-rate and high reach: triage should reject most of it, and " +
      "the rejections are the cheapest thing this lane does. Shorts are aphorism " +
      "clips ('Regret Is Worse Than Rejection') and are never curriculum material.",
  },
];
