import type { BrandIdentity } from "@/lib/brand/types.ts";
import type { PillarId } from "./pillars.ts";

// Who this tracker is for. Every prompt that has to tell a model what the
// company is reads `oneLiner`; every rule that has to decide "is this post
// about us" reads `name`, `ownHandles` and `domains`.

export const BRAND: BrandIdentity<PillarId> = {
  name: "Eco",
  handle: "eco",
  ownHandles: ["eco", "rynesaxe"],
  domains: ["eco.com", "docs.eco.com"],
  blogDomain: "eco.com",
  docsOrigin: "https://docs.eco.com",
  youtubeHandle: "@ecoprotocol",
  platformNoun: { singular: "chain", plural: "chains" },
  onCamera:
    "The people who appear on camera are Ryne Saxe (CEO, @rynesaxe), a Head of Product (@strao_), and " +
    "Shah, who fronts an educational explainer series.",

  // The canonical short-form description. The WHO WE ARE section of the
  // positioning brief is the long form of the same claim; edit them together.
  oneLiner:
    "Eco is stablecoin infrastructure for navigating onchain markets: the routing and execution " +
    "layer that connects digital asset markets through stablecoins. Value moves THROUGH stablecoins " +
    "into trading, tokenization, treasury and FX, not just between tokens. Developers and " +
    "enterprises use Eco APIs to deploy payment and trading flows with price control, without " +
    "deploying custom onchain infrastructure.",

  // URL substring → pillar, when the URL alone settles the category. The docs
  // live under a PATH on the marketing domain as well as their own subdomain,
  // so both are listed.
  urlRules: [
    { match: "eco.com/docs/", pillar: "dev_doc_post", confidence: 0.9, reason: "Links to eco.com/docs (developer documentation)." },
    { match: "docs.eco.com", pillar: "dev_doc_post", confidence: 0.95, reason: "Links to docs.eco.com (developer documentation)." },
  ],
};
