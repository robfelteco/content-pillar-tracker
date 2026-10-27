import { PILLAR_IDS, PILLAR_DEFS, RATIO_BUCKETS as BRAND_RATIO_BUCKETS, type PillarId } from "../brand/pillars.ts";
import { BRAND } from "../brand/identity.ts";
import { ALL_PRODUCT_TERMS } from "./products.ts";
import type { DraftMode, PillarDef, RatioBucket, RatioBucketDef } from "./brand/types.ts";

// Content-pillar taxonomy, the single source of truth the app codes against.
// The DATA lives in brand/pillars.ts; this module gives it the names the rest
// of lib/ and app/ use and adds the helpers. Mirrors the `content_template`
// enum in db/schema.sql (see scripts/brand-check.ts).

export const TEMPLATES = PILLAR_IDS;
export type Template = PillarId;
export type { DraftMode, RatioBucket };
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

// Product names, used by the Stage-1 rules to detect a likely product_post and
// to decide "mentions the company" for the broad_educational rule. Derived from
// the product registry so there is one list, not two.
export const BRAND_PRODUCT_TERMS = ALL_PRODUCT_TERMS;

// Domains that count as company-owned for rule matching.
export const BRAND_DOMAINS = BRAND.domains;

// Compact taxonomy block for the Claude prompt (id + description, no staleDays).
export function taxonomyPromptBlock(): string {
  return TEMPLATE_DEFS.map((t) => `- ${t.id}: ${t.description}`).join("\n");
}
