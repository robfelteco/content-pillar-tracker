// The ICP registry, who a piece of source material is FOR. Data in brand/audiences.ts.
//
// This is the axis the Dev Doc and Short-Form Video shelves group on, and it is
// not invented: docs.eco.com publishes a "Solutions for [persona]" section whose
// eight pages ARE Eco's stated ICPs. We mirror those ids exactly so a docs page
// under /solutions/<x> tags itself, and add one catch-all (`builders`) for the
// Concepts / Architecture / API-Reference pages that are written for a technical
// integrator generally rather than one named persona.
//
// The `side` field carries Robert's framing of the pillar: docs posts target
// "devs AND business/company decision makers who may go there to self-serve an
// integration or learn what Eco has to offer." Those two audiences want opposite
// things from the same page — the drafter needs to know which one it is writing
// for, and the Prioritize card needs to be able to say "you have run the
// technical door six times and never the commercial one."
//
// Kept dependency-free so taxonomy, docs, videos and the backfill scripts can
// all import it without a cycle (same rule as lib/products.ts).

import { ICP_DEFS, SITE_AUDIENCES } from "../brand/audiences.ts";
import type { IcpDef, IcpSide, SiteAudience } from "./brand/types.ts";

export type { IcpDef, IcpSide, SiteAudience };
export { ICP_DEFS, SITE_AUDIENCES };

export const SITE_AUDIENCE_BY_ID: Record<string, SiteAudience> = Object.fromEntries(
  SITE_AUDIENCES.map((a) => [a.id, a]),
);

export function siteAudienceLabel(id: string | null | undefined): string | null {
  if (!id) return null;
  return SITE_AUDIENCE_BY_ID[id]?.label ?? id;
}

// Compact block for a prompt that has to pick one audience per idea.
export function siteAudiencePromptBlock(): string {
  return SITE_AUDIENCES.map((a) => `- ${a.id}: ${a.label}. ${a.brief}`).join("\n");
}

export const ICP_BY_ID: Record<string, IcpDef> = Object.fromEntries(
  ICP_DEFS.map((i) => [i.id, i]),
);

export const ICP_IDS = ICP_DEFS.map((i) => i.id);

export function icpLabel(id: string | null | undefined): string {
  if (!id) return "Unassigned";
  return ICP_BY_ID[id]?.label ?? id;
}

// Auto-tag from the docs path — a /solutions/<slug> page names its own persona,
// so it never needs to cost a Claude call.
export function icpFromSolutionsPath(path: string): string | null {
  const m = path.match(/^\/solutions\/([a-z0-9-]+)/i);
  if (!m) return null;
  const slug = m[1].toLowerCase();
  return ICP_DEFS.find((i) => i.solutionsSlug === slug)?.id ?? null;
}

// Compact block for the Claude tagging prompt.
export function icpPromptBlock(): string {
  return ICP_DEFS.map((i) => `- ${i.id} (${i.side}): ${i.label} — ${i.brief}`).join("\n");
}

// ---------------------------------------------------------------------------
// Postability tier. Without this the docs shelf is 73 rows and "Get Intent
// Status Array" sits next to "Solutions for AI agents" as if they were equally
// postable. They are not.
// ---------------------------------------------------------------------------

export type DocTier = "hero" | "supporting" | "reference";

export const TIER_LABEL: Record<DocTier, string> = {
  hero: "Hero",
  supporting: "Supporting",
  reference: "Reference",
};

export const TIER_HINT: Record<DocTier, string> = {
  hero: "A whole post can be built around this page — it has an argument, not just a parameter table.",
  supporting: "Works as the link under a broader take, but can't carry a post on its own.",
  reference: "Lookup material. Never the subject of a post.",
};

export const TIER_ORDER: Record<DocTier, number> = { hero: 0, supporting: 1, reference: 2 };
