import { ANALOG_DEFS, TIER_LABEL, TIER_HINT, EDUCATION_SHAPES } from "../brand/curriculum.ts";
import type { AnalogDef, AnalogTier, AnalogSide, AnalogSourceRef, EducationShape } from "./brand/types.ts";

// The analog-education curriculum. The registry lives in brand/curriculum.ts;
// this module gives it the names the rest of lib/ uses and adds lookup,
// detection and the prompt index. See the brand file for why the curriculum
// is a registry and not a discover lens, and why `breaksWhere` is required.
//
// Kept free of db imports (same rule as lib/products.ts and lib/icp.ts) so
// taxonomy, ingest, stats and the backfill scripts can all import it without
// a cycle.

export type { AnalogDef, AnalogTier, AnalogSide, EducationShape };
export type AnalogSource = AnalogSourceRef;
export { ANALOG_DEFS, TIER_LABEL, TIER_HINT, EDUCATION_SHAPES };

export const ANALOG_BY_ID: Record<string, AnalogDef> = Object.fromEntries(
  ANALOG_DEFS.map((a) => [a.id, a]),
);

export const ANALOG_IDS = ANALOG_DEFS.map((a) => a.id);

export function analogLabel(id: string | null | undefined): string {
  if (!id) return "Unassigned";
  return ANALOG_BY_ID[id]?.label ?? id.replace(/_/g, " ");
}

export const SHAPE_BY_ID: Record<string, EducationShape> = Object.fromEntries(
  EDUCATION_SHAPES.map((s) => [s.id, s]),
);

// ---------------------------------------------------------------------------
// Detection.
//
// Word-boundary matching over `vocab`, mirroring hasToken() in lib/dimensions.ts
// so "chips" inside "microchips" never tags CHIPS/Fedwire. Deliberately strict:
// a post is tagged with at most ONE concept (the longest match wins, since a
// longer phrase is a more specific signal), because a teaching post is about one
// mechanism. A post that merely name-drops a term in passing should not be
// counted as having taught it — the coverage board would lie.
// ---------------------------------------------------------------------------
function hasToken(haystack: string, token: string): boolean {
  const t = token.toLowerCase();
  const i = haystack.indexOf(t);
  if (i === -1) return false;
  const before = haystack[i - 1];
  const after = haystack[i + t.length];
  const wordish = (c: string | undefined) => !!c && /[a-z0-9]/.test(c);
  return !wordish(before) && !wordish(after);
}

export function detectAnalog(text: string): string | null {
  const hay = (text || "").toLowerCase();
  if (!hay) return null;
  let best: { id: string; len: number } | null = null;
  for (const a of ANALOG_DEFS) {
    for (const tok of a.vocab) {
      if (hasToken(hay, tok) && (!best || tok.length > best.len)) {
        best = { id: a.id, len: tok.length };
      }
    }
  }
  return best?.id ?? null;
}

// Compact block for a Claude prompt that needs the whole curriculum in view
// (the question-mining lane uses this to pick which concept a question belongs
// to). Parallel and break are deliberately omitted here — this is for routing,
// not for drafting.
export function analogPromptIndex(): string {
  return ANALOG_DEFS.map((a) => `- ${a.id} (tier ${a.tier}, ${a.side}): ${a.label}`).join("\n");
}
