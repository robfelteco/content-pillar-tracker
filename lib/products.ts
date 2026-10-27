import { PRODUCT_DEFS, PRODUCT_POST_SHAPES } from "../brand/products.ts";
import type { ProductDef, PostShape } from "./brand/types.ts";
import { isOwnHandle } from "./brand/helpers.ts";

// The product registry, the axis Product Posts rotate on. Data in
// brand/products.ts; this module adds lookup, term extraction and the
// deterministic shape detector.
//
// Kept free of db imports so lib/dimensions.ts, lib/taxonomy.ts and the
// backfill scripts can all import it without a cycle.

export type { ProductDef, PostShape };
export { PRODUCT_DEFS, PRODUCT_POST_SHAPES };

export const PRODUCT_BY_ID: Record<string, ProductDef> = Object.fromEntries(
  PRODUCT_DEFS.map((p) => [p.id, p]),
);

export const PRODUCT_IDS = PRODUCT_DEFS.map((p) => p.id);

export function productLabel(id: string): string {
  return PRODUCT_BY_ID[id]?.label ?? id.replace(/_/g, " ");
}

// Word-boundary test that treats [a-z0-9] as word chars, so "routes" inside
// "reroutes" never matches. Mirrors hasToken() in lib/dimensions.ts.
function hasToken(haystack: string, token: string): boolean {
  const t = token.toLowerCase();
  let from = 0;
  for (;;) {
    const i = haystack.indexOf(t, from);
    if (i === -1) return false;
    const before = haystack[i - 1];
    const after = haystack[i + t.length];
    const wordish = (c: string | undefined) => !!c && /[a-z0-9]/.test(c);
    if (!wordish(before) && !wordish(after)) return true;
    from = i + 1;
  }
}

// Which products does this post talk about? `mentionsBrand` gates the loose
// (ordinary-English) terms — see ProductDef.looseTerms.
export function extractProducts(text: string, mentionsBrand: boolean): string[] {
  const t = (text || "").toLowerCase();
  const out = new Set<string>();
  for (const p of PRODUCT_DEFS) {
    if (p.terms.some((tok) => hasToken(t, tok))) {
      out.add(p.id);
      continue;
    }
    if (mentionsBrand && p.looseTerms?.some((tok) => hasToken(t, tok))) out.add(p.id);
  }
  return [...out].sort();
}

// Flat term list for the Stage-1 rules' "does this mention an Eco product?"
// check (lib/taxonomy.ts re-exports it as BRAND_PRODUCT_TERMS).
export const ALL_PRODUCT_TERMS: string[] = PRODUCT_DEFS.flatMap((p) => [...p.terms, ...(p.looseTerms ?? [])]);

export const SHAPE_BY_ID: Record<string, PostShape> = Object.fromEntries(
  PRODUCT_POST_SHAPES.map((s) => [s.id, s]),
);

// --- Shape detection -------------------------------------------------------
// Which of the seven jobs is this post doing? Deterministic, derived from
// signals that are actually in the row — no LLM, no extra spend. Only meaningful
// inside product_post; the ordering below is the precedence, most specific
// first. Verified by hand against all 36 posts in the pillar.

export interface ShapeInput {
  text: string;
  mediaType: string;
  linkTitle: string | null;
  mentions: string[]; // lowercased @handles, no leading @
  entities: string[]; // canonical partner ids from lib/dimensions.ts
}

const LAUNCH_RE = /\b(introducing|we're releasing|we are releasing|today,? we're|is now live|are now live|is live in|now supports|we're launching|is launching)\b/i;
const NUMBERED_RE = /(^|\n)\s*(?:[1-4][.)]|[-–•])\s+\S/;
const INSTITUTIONAL_RE = /\b(institution|institutional|regulated|compliance|kyb|sanctions|audit|counterparty|desk|treasury|risk committee)\b/i;
const DIAGRAM_RE = /\b(here's the flow|here's the full|lifecycle|under the hood|architecture|breaks down how|the flow)\b/i;

export function detectShape(input: ShapeInput): string {
  const text = (input.text || "").trim();
  // Strip t.co links to judge how much the post actually SAYS.
  const bare = text.replace(/https?:\/\/t\.co\/\w+/g, "").trim();
  const firstLine = bare.split("\n")[0] ?? "";

  // A post whose whole body is a link, carrying an article card, is pushing the
  // article and nothing else.
  if (input.linkTitle && bare.length < 40) return "article_amplifier";

  // A named partner in the mentions, other than us — the post is about their
  // deployment of our product.
  const partner = input.mentions.some((m) => !isOwnHandle(m)) && input.entities.length > 0;

  if (LAUNCH_RE.test(firstLine)) return "launch";
  if (NUMBERED_RE.test(bare)) return "how_it_works";
  if (partner) return "partner_proof";
  if (firstLine.trim().endsWith("?") && INSTITUTIONAL_RE.test(bare)) return "icp_objection";
  if ((input.mediaType === "photo" || input.mediaType === "animated_gif") && DIAGRAM_RE.test(bare)) return "diagram";
  if (INSTITUTIONAL_RE.test(firstLine)) return "icp_objection";
  if (input.mediaType === "photo" || input.mediaType === "animated_gif") return "diagram";
  return "problem_mechanism";
}
