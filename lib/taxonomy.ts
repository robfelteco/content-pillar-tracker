import { PILLAR_IDS, PILLAR_DEFS, RATIO_BUCKETS as BRAND_RATIO_BUCKETS, type PillarId } from "../brand/pillars.ts";
import { BRAND } from "../brand/identity.ts";
import { STRICT_PRODUCT_TERMS } from "./products.ts";
import type { DraftMode, MediaKind, PillarDef, RatioBucket, RatioBucketDef } from "./brand/types.ts";

// Content-pillar taxonomy, the single source of truth the app codes against.
// The DATA lives in brand/pillars.ts; this module gives it the names the rest
// of lib/ and app/ use and adds the helpers. Mirrors the `content_template`
// enum in db/schema.sql (see scripts/brand-check.ts).

export const TEMPLATES = PILLAR_IDS;
export type Template = PillarId;
export type { DraftMode, MediaKind, RatioBucket };
export type TemplateDef = PillarDef<Template>;

export function isTemplate(v: unknown): v is Template {
  return typeof v === "string" && (TEMPLATES as readonly string[]).includes(v);
}

export const RATIO_BUCKETS: Record<RatioBucket, RatioBucketDef> = BRAND_RATIO_BUCKETS;

export const TEMPLATE_DEFS: TemplateDef[] = PILLAR_DEFS;

export const TEMPLATE_BY_ID: Record<Template, TemplateDef> = Object.fromEntries(
  TEMPLATE_DEFS.map((t) => [t.id, t]),
) as Record<Template, TemplateDef>;

// Confidence below this routes a post to the human review queue.
export const REVIEW_THRESHOLD = 0.8;

// Unambiguous product names, used by the Stage-1 rules to decide "mentions the
// company". Word-boundary matched; looseTerms never count here.
export const BRAND_PRODUCT_TERMS = STRICT_PRODUCT_TERMS;

// Domains that count as company-owned for rule matching.
export const BRAND_DOMAINS = BRAND.domains;

// Compact taxonomy block for the Claude prompt (id + description, no staleDays).
export function taxonomyPromptBlock(): string {
  return TEMPLATE_DEFS.map((t) => `- ${t.id}: ${t.description}`).join("\n");
}

// ---------------------------------------------------------------------------
// Trait and source lookups. The core never names a pillar; it asks these.
// ---------------------------------------------------------------------------

/** Pillars that draft from this source, in taxonomy order. */
export function pillarsByMode(mode: DraftMode): Template[] {
  return TEMPLATE_DEFS.filter((t) => t.draftMode === mode).map((t) => t.id);
}

/** The one pillar on this source, or null when there are none or several. */
export function solePillarByMode(mode: DraftMode): Template | null {
  const ids = pillarsByMode(mode);
  return ids.length === 1 ? ids[0] : null;
}

type BoolTrait = "externalOnly" | "visualAnchor" | "teaches" | "easyWin";

/** Pillars that declare a trait. */
export function pillarsWith(trait: BoolTrait): Template[] {
  return TEMPLATE_DEFS.filter((t) => t[trait]).map((t) => t.id);
}

/** Rule-classifier candidates for a media kind: the pillars that declared it. */
export function pillarsForMedia(media: string): Template[] {
  return TEMPLATE_DEFS.filter((t) => t.media?.includes(media as MediaKind)).map((t) => t.id);
}

/** Every pillar except the review bucket. */
export const CLASSIFIED_TEMPLATES: Template[] = TEMPLATE_DEFS.filter((t) => t.id !== "other").map((t) => t.id);

/** The platform lane (integrated platforms, their momentum, the platform data lanes) is on only when a pillar uses it. */
export function platformLaneEnabled(): boolean {
  return pillarsByMode("chains").length > 0 || pillarsByMode("dmv").length > 0;
}
