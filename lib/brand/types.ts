// The contract between the generic core (lib/) and one brand's configuration
// (brand/). Everything in brand/ is plain data typed against these interfaces;
// everything that USES the data lives in lib/. Edit brand/, not this file, to
// adapt the tracker to a different company.

// How the Prioritize card builds its draft targets for a pillar.
//   chains    — rank the tracked entities (e.g. chains) this pillar has covered
//   products  — rank products × their source articles
//   articles  — the article shelf, one row per underlying piece
//   discovery — find NEW source material; nothing to re-run
//   docs      — the docs-page shelf, grouped by audience
//   videos    — the short-form clip library, grouped by series
//   dmv       — the three data-visual lanes (see lib/dmvLanes.ts)
//   generic   — a single "draft something fresh" target
export type DraftMode = "chains" | "products" | "articles" | "discovery" | "docs" | "videos" | "dmv" | "generic";

// Which side of the educational / soft promo / hard promo ratio a pillar lands on.
export type RatioBucket = "edu" | "soft" | "hard";

export interface RatioBucketDef {
  label: string;
  /** Posts per cycle, e.g. 4-1-1 means edu 4, soft 1, hard 1. */
  target: number;
  hint: string;
}

export interface PillarDef<Id extends string = string> {
  id: Id;
  label: string;
  /** Handed to the classifier verbatim. Describe signals, not aspirations. */
  description: string;
  draftMode: DraftMode;
  /** Days since the last post before the overview flags the pillar red. */
  staleDays: number;
  /** null keeps the pillar out of the ratio meter. */
  ratioBucket: RatioBucket | null;
}

// How a post in this pillar should be BUILT. Handed to the drafter verbatim.
export interface PillarShape {
  /** Always one post. The LENGTH steer only, never a thread. */
  form: string;
  /** The structural instruction. */
  build: string;
  /** What makes THIS pillar's posts get pasted into a work channel. */
  citable: string;
  /** The mistake this pillar reliably makes. */
  avoid: string;
}

// URL substring → pillar. Only patterns that map to exactly one pillar
// regardless of anything else in the post.
export interface UrlRule<Id extends string = string> {
  /** Lowercased substring to find in an outbound URL. */
  match: string;
  pillar: Id;
  confidence: number;
  reason: string;
}

export interface BrandIdentity<Id extends string = string> {
  /** Company name as it appears in posts, e.g. "Eco". Matched as a whole word. */
  name: string;
  /** The tracked X handle, no @. Falls back to X_ACCOUNT_HANDLE at runtime. */
  handle: string;
  /** X handles that count as "us" (the company, the CEO, team), lowercased, no @. */
  ownHandles: string[];
  /** Domains that count as company-owned when a post links out. */
  domains: string[];
  /** The domain whose /blog carries the company's articles. */
  blogDomain: string;
  /** Origin of the developer docs, e.g. "https://docs.example.com". Empty disables the docs shelf. */
  docsOrigin: string;
  /** The company YouTube handle, with @, for the short-form video shelf. Empty disables it. */
  youtubeHandle: string;
  /** Optional. Who recurs on camera in the company's clips, for the video tagger. */
  onCamera?: string;
  /** One paragraph telling a model what the company is. Used by every upstream prompt. */
  oneLiner: string;
  urlRules: UrlRule<Id>[];
}

export type IcpSide = "technical" | "commercial" | "both";

// A persona a piece of source material is FOR. The docs and video shelves group on it.
export interface IcpDef {
  id: string;
  label: string;
  side: IcpSide;
  /** Handed to the drafter verbatim: what this reader believes, wants, and clicks. */
  brief: string;
  /** The docs /solutions/<slug> page that defines this persona, if one exists. */
  solutionsSlug?: string;
}

// A coarser audience list, e.g. the ones your marketing site names.
export interface SiteAudience {
  id: string;
  label: string;
  /** The IcpDef ids this audience folds in. */
  icps: string[];
  brief: string;
}

export interface ProductDef {
  id: string;
  label: string;
  /** One-paragraph fact sheet for the drafter: what it is, who it's for, the mechanism. */
  brief: string;
  /** What may NOT be claimed. Roadmap is not shipped. */
  guardrail?: string;
  /** Unambiguous tokens, matched word-boundary aware. */
  terms: string[];
  /** Ordinary-English tokens, matched only when the post also mentions the company. */
  looseTerms?: string[];
}

// One of the distinct jobs a product post does.
export interface PostShape {
  id: string;
  label: string;
  brief: string;
}

// Brand-specific vocabulary rules layered on the generic anti-slop engine.
export interface VoiceRules {
  /** Phrases the company has decided are crowded or meaningless as self-description. Flagged, not vetoed. */
  commodityPhrases: string[];
  /** Words allowed only when the same sentence shows the mechanism or number that makes them true. */
  substantiationGated: string[];
  /** Senses of a gated word that are NOT the hollow claim, by word. */
  gatedExceptions: Record<string, RegExp>;
  /** Words that count as substantiation inside the same sentence. Any digit also counts. */
  substantiationTerms: string[];
  /** One paragraph on this account's particular slop risk, appended to the anti-slop brief. */
  voiceNote: string;
  /** A binary-contrast sentence from this brand's world and its direct rewrite. */
  contrastExample: { before: string; after: string };
}
