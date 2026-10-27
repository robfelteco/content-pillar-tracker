import type { IcpDef, SiteAudience } from "@/lib/brand/types.ts";

// Who a piece of source material is FOR. STARTER VALUES: replace with the
// personas your docs and marketing site actually name. The docs and video
// shelves group on ICP_DEFS; the educational lane picks one SITE_AUDIENCE per
// idea. Keep the two lists in sync through `icps`.

export const ICP_DEFS: IcpDef[] = [
  {
    id: "builders",
    label: "Developers & integrators",
    side: "technical",
    brief:
      "A developer evaluating or wiring up an integration. Wants to know what the primitive actually is, what the call looks like, and where the sharp edges are. Rewards precision and code; punishes marketing language.",
  },
  {
    id: "operators",
    label: "Operators & buyers",
    side: "commercial",
    brief:
      "The person who owns the outcome and the budget. Thinks in cost lines, headcount, risk and predictability, not in implementation detail. Wants to know what changes for their team and what it replaces.",
    solutionsSlug: "operators",
  },
  {
    id: "executives",
    label: "Executives & decision makers",
    side: "both",
    brief:
      "Reads for the strategic frame: where the market is going, what the company's position in it is, and whether the bet is sound. Wants one clear claim with evidence, not a feature list.",
  },
];

export const SITE_AUDIENCES: SiteAudience[] = [
  {
    id: "technical",
    label: "Technical teams",
    icps: ["builders"],
    brief: "Developers and platform teams: mechanism depth, what the call looks like, what they no longer have to build.",
  },
  {
    id: "commercial",
    label: "Commercial teams",
    icps: ["operators", "executives"],
    brief: "Operators and leaders: cost, risk, predictability, and what the market shift means for their business.",
  },
];
