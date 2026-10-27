import type { BrandIdentity } from "@/lib/brand/types.ts";
import type { PillarId } from "./pillars.ts";

// Who this tracker is for. STARTER VALUES: replace every field. For a complete,
// production-tested configuration see examples/eco/identity.ts.
//
// Every prompt that has to tell a model what the company is reads `oneLiner`;
// every rule that has to decide "is this post about us" reads `name`,
// `ownHandles` and `domains`.

export const BRAND: BrandIdentity<PillarId> = {
  name: "Acme",
  handle: "acme",
  // The company handle plus anyone whose posts count as company content (CEO, team).
  ownHandles: ["acme"],
  domains: ["acme.com", "docs.acme.com"],
  blogDomain: "acme.com",
  // Set docsOrigin when a pillar drafts from docs (draftMode "docs"); the
  // starter set has none, so the shelf is off.
  docsOrigin: "",
  // Set youtubeHandle when a pillar drafts from videos (draftMode "videos").
  youtubeHandle: "",
  // What you call the platforms you integrate with, if any pillar drafts from them.
  platformNoun: { singular: "platform", plural: "platforms" },

  // One paragraph. What the company is, for whom, and the mechanism. This is
  // pasted into every upstream prompt, so write it the way you want models to
  // describe you.
  oneLiner:
    "Acme is developer infrastructure for <category>: the <layer> that lets <customer type> " +
    "<do the job> without <the thing they used to have to build>. Teams use the Acme API to " +
    "<outcome>, with <the quality the product is known for>.",

  // URL substring → pillar, when the URL alone settles the category, e.g.
  // { match: "docs.acme.com", pillar: "docs", confidence: 0.95, reason: "Links to the developer documentation." }
  urlRules: [],
};
