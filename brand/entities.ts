import type { ChainDef, PartnerDef, DmvLaneDef, DmvLaneId, ChainArticleDef } from "@/lib/brand/types.ts";

// The platforms the company integrates with ("chains" in the schema, because
// the original brand's were blockchains) and the companies it highlights.
// STARTER VALUES. Both lists may be empty: with no chains the integration
// pillar, the chain-momentum tab and the chain data lanes simply have nothing
// to rank, and with no partners the partner axis of Product Posts is empty.
//
// One entry per chain carries everything the tracker needs about it: the
// vocabulary that tags a post with it (handles are the reliable signal;
// keywords must not be ordinary English words), the X account its momentum is
// read from, and whether the company is live there without a dedicated piece.

export const CHAINS: ChainDef[] = [
  {
    id: "example_network",
    label: "Example Network",
    handles: ["examplenetwork"],
    // announcedNotLive: "Signed, launching next quarter.",
    keywords: ["example network"],
    momentumHandle: "examplenetwork",
    momentumEnabled: false,
  },
];

export const PARTNERS: PartnerDef[] = [
  {
    id: "example_partner",
    label: "Example Partner",
    handles: ["examplepartner"],
    domains: ["examplepartner.com"],
    inProduction: "<what they run of yours in production: not in the setup material>",
  },
];

// The three data-visual lanes. The ids are fixed in lib/dmvLanes.ts; the
// labels, hints and cadences are yours. If the data pillar is parked these
// are never read.
export const DMV_LANES: Record<DmvLaneId, DmvLaneDef> = {
  integrated: {
    label: "Integrated-platform data",
    hint: "Data about a platform the company is live on. These can close on a call to action.",
    staleDays: 10,
  },
  other_chain: {
    label: "Non-integrated platform data",
    hint: "Platform-specific data where the company is not live yet. No CTA; this lane buys credibility and builds the case for integrating.",
    staleDays: 21,
  },
  market_wide: {
    label: "Market-wide data",
    hint: "Market totals, volume, share shifts; no single platform as the subject.",
    staleDays: 14,
  },
};

// The articles that carried each platform integration (blog slug, optional
// own-account status id). Read by scripts/ingest-chain-articles.ts.
export const CHAIN_ARTICLES: ChainArticleDef[] = [];
