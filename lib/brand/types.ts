// The contract between the generic core (lib/) and one brand's configuration
// (brand/). Everything in brand/ is plain data typed against these interfaces;
// everything that USES the data lives in lib/. Edit brand/, not this file, to
// adapt the tracker to a different company.

// The SOURCE a pillar drafts from, and therefore how the Prioritize card builds
// its targets. Every source module asks "which pillars use me?" through this,
// so a brand can have any number of pillars on a source, or none.
//   chains    — rank the integrated platforms (brand/entities.ts CHAINS)
//   products  — rank products × their source articles, and partners in production
//   articles  — the article shelf, one row per underlying piece
//   docs      — the docs-page shelf, grouped by audience
//   videos    — the short-form clip library, grouped by series
//   dmv       — the three data-visual lanes (see lib/dmvLanes.ts)
//   education — the educational pipeline: curriculum, angle bank, discovery
//   quotes    — quote discovery from the roster and watched sources
//   generic   — a single "draft something fresh" target, no shelf
export type DraftMode = "chains" | "products" | "articles" | "docs" | "videos" | "dmv" | "education" | "quotes" | "generic";

// Media a post can carry, as the ingest records it.
export type MediaKind = "video" | "animated_gif" | "photo" | "link-card" | "text";

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
  /**
   * Media kinds a post in this pillar can carry. The rule classifier narrows
   * its candidate set by the post's media before any model call, so a pillar
   * that lists no media is never a rule candidate (the model can still pick it).
   */
  media?: MediaKind[];
  /** The company is never named: external content. A standalone external link with no company mention settles here when exactly one pillar declares it. */
  externalOnly?: boolean;
  /** The pillar's identity is carried by the image, not the text: the classifier is shown a reference image for it. */
  visualAnchor?: boolean;
  /** Explanation is this pillar's job: a curriculum concept appearing here counts as taught. */
  teaches?: boolean;
  /** Low effort, high frequency: the nudge suggests it when the account has gone quiet. */
  easyWin?: boolean;
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
  /**
   * What the company calls the platforms it integrates with, for the UI and
   * prompts of the platform lane: { singular: "chain", plural: "chains" },
   * { singular: "processor", plural: "processors" }. Default "platform".
   * The schema keeps the column name `chains` whatever this says.
   */
  platformNoun?: { singular: string; plural: string };
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
  /** The docs /solutions/<slug> page(s) that define this persona, if any. */
  solutionsSlug?: string | string[];
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

// ---------------------------------------------------------------------------
// Optional-lane registries. Each is read only by the lane that needs it, so an
// empty list switches the lane off cleanly.
// ---------------------------------------------------------------------------

// An external platform the company integrates with and announces, and whose
// momentum it watches. The schema calls these "chains" because the original
// brand's were blockchains; for another company they are networks, processors,
// marketplaces, whatever the integration_announcement pillar is about.
export interface ChainDef {
  id: string;
  label: string;
  /** X handles that mean this chain, lowercased, no @. The reliable signal. */
  handles: string[];
  /** Distinctive text tokens. Leave out any that are ordinary English words. */
  keywords?: string[];
  /** The X account to read momentum from (lowercased, no @). Omit to not watch it. */
  momentumHandle?: string;
  /** Scan momentum daily. Default false: on only for the chains worth a daily read. */
  momentumEnabled?: boolean;
  /** The company is live here but never published a dedicated piece. Give the reason. */
  liveWithoutArticle?: string;
  /** Announced but not live yet. Give the reason. Kept out of the integrated set even if a post about it is filed under the integration pillar. */
  announcedNotLive?: string;
}

// A company or partner the account highlights (issuers, customers, partners).
export interface PartnerDef {
  id: string;
  label: string;
  handles: string[];
  domains?: string[];
  /** Set when the partner runs the company's product in production: the reason, one line. A partner lane is only drawn for these. */
  inProduction?: string;
}

export type DmvLaneId = "integrated" | "other_chain" | "market_wide";

export interface DmvLaneDef {
  label: string;
  hint: string;
  staleDays: number;
}

// The analog curriculum: legacy concepts the audience already thinks in, and
// where the company's mechanism breaks from each.
export type AnalogTier = 1 | 2 | 3 | 4;
export type AnalogSide = "technical" | "commercial";

export interface AnalogSourceRef {
  title: string;
  url: string;
}

export interface AnalogDef {
  id: string;
  label: string;
  tier: AnalogTier;
  side: AnalogSide;
  /** IcpDef ids. Who actually cares about this concept. */
  icps: string[];
  /** 1-3: how sharp the break is. Feeds the coverage score. */
  breakStrength: 1 | 2 | 3;
  /** Detection vocabulary, word-boundary matched. No ordinary English words. */
  vocab: string[];
  /** How the analog maps. Handed to the drafter verbatim. */
  parallel: string;
  /** Where the mapping FAILS. Required. This is the post. */
  breaksWhere: string;
  guardrail?: string;
  sources?: AnalogSourceRef[];
  /** Institutional index pages the sweep enumerates for this concept. */
  hubs?: string[];
}

export interface EducationShape {
  id: string;
  label: string;
  brief: string;
}

// A YouTube channel the curriculum lane watches.
export interface ChannelDef {
  /** YouTube channelId (UC…). Pinned, because handles can change. */
  id: string;
  /** Display only. */
  handle?: string;
  label: string;
  /** The publisher has a commercial position in what it explains; capped below canonical. */
  interestedParty: boolean;
  /** Take the channel's Shorts as targets in their own right. */
  takeShorts: boolean;
  /** What the channel is for, and what it is not. Handed to triage verbatim. */
  note: string;
}

// The quote-discovery roster seeds.
export interface OrgSeed {
  name: string;
  /** 1 = the most credible tier for a quote, 3 = the least. */
  tier: 1 | 2 | 3;
  xHandle?: string;
  isCompetitor?: boolean;
}

export interface PersonSeed {
  name: string;
  title: string;
  /** Must match an OrgSeed name. */
  org: string;
  /** 1 = C-suite/founder, 2 = SVP/MD/Head of, 3 = Director/PM. */
  seniority: 1 | 2 | 3;
  xHandle?: string;
}

export interface WatchSeed {
  kind: "yt_channel" | "report_site" | "x_search";
  identifier: string;
  label: string;
}
