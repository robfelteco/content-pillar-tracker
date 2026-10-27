import type { OrgSeed, PersonSeed, WatchSeed } from "@/lib/brand/types.ts";

// The quote-discovery roster: who is credible enough to quote-card, and where
// to look for them. STARTER VALUES. Everything downstream (scoring, the read
// budget, who can even produce a candidate) keys off these, so the quote lane
// is only as good as this list. Seed 40 to 60 people across three org tiers
// before expecting it to produce anything. Every person's `org` must match an
// `OrgSeed.name`; brand-check verifies it.

export const ORG_SEED: OrgSeed[] = [
  // Tier 1: the institutions whose quotes carry the most weight in your market.
  { name: "Example Institution", tier: 1 },
  // Tier 2: the major operators in your category.
  { name: "Example Operator", tier: 2, xHandle: "exampleoperator" },
  // Tier 3: adjacent infrastructure, funds, research desks.
  { name: "Example Research", tier: 3, xHandle: "exampleresearch" },
];

export const PEOPLE_SEED: PersonSeed[] = [
  { name: "Example Person", title: "Chief Executive Officer", org: "Example Operator", seniority: 1, xHandle: "exampleperson" },
];

// Podcasts, conference channels and report publishers to sweep. Not tied to a
// person. `x_search` entries become "add to roster?" suggestions, never quote
// candidates.
export const WATCH_SEED: WatchSeed[] = [
  { kind: "report_site", identifier: "example.org/research", label: "Example research desk" },
  { kind: "x_search", identifier: "<your category keyword> (institutional OR enterprise) -is:retweet lang:en", label: "Category × institutional" },
];
