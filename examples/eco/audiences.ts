import type { IcpDef, SiteAudience } from "@/lib/brand/types.ts";

// Who a piece of source material is FOR. The docs and video shelves group on
// ICP_DEFS; the educational lane picks one SITE_AUDIENCE per idea. Keep the two
// lists in sync through `icps`.

export const ICP_DEFS: IcpDef[] = [
  {
    id: "builders",
    label: "Developers & integrators",
    side: "technical",
    brief:
      "A developer evaluating or wiring up an Eco integration. Wants to know what the primitive actually is, what the call looks like, and where the sharp edges are. Rewards precision and code; punishes marketing language. Concepts, architecture and API-reference pages are for this reader.",
  },
  {
    id: "wallets",
    label: "Wallets & consumer apps",
    side: "both",
    brief:
      "A wallet or consumer-app team whose product lives or dies on friction. Network switching, gas-token acquisition and bridge UX are the three places their users drop. Cares about cross-chain transfers, gasless deposits and one-click swaps that the user never has to understand.",
    solutionsSlug: "wallets",
  },
  {
    id: "protocols",
    label: "DeFi protocols",
    side: "technical",
    brief:
      "A protocol team that wants deposits from chains they are not deployed on, and treasury that can rebalance itself. Thinks in terms of effective liquidity depth and one-click cross-chain deposits.",
    solutionsSlug: "protocols",
  },
  {
    id: "payments",
    label: "Payment platforms & PSPs",
    side: "commercial",
    brief:
      "A payments or PSP operator who needs predictable settlement, multi-asset acceptance and compliance — three things stablecoin infrastructure rarely delivers together. Speaks settlement, reconciliation and chargeback risk, not blockspace.",
    solutionsSlug: "payments",
  },
  {
    id: "exchanges",
    label: "Exchanges & onramps",
    side: "commercial",
    brief:
      "An exchange or onramp handling withdrawal flows at volume. Wants auto-routing withdrawal addresses and fewer support tickets from users who withdrew to the wrong chain.",
    solutionsSlug: "exchanges-onramps",
  },
  {
    id: "issuers",
    label: "Stablecoin issuers",
    side: "commercial",
    brief:
      "A stablecoin issuer deciding how their asset moves between chains without minting a wrapped version of itself everywhere. Cares about native cross-chain transfer, distribution reach and not ceding control of their own liquidity.",
    solutionsSlug: "issuers",
  },
  {
    id: "treasury",
    label: "Treasury & yield managers",
    side: "commercial",
    brief:
      "A treasury or yield operator moving size. Slippage on AMM-based routing is a real cost line, manual rebalancing across chains is real headcount, and a failed bridge stranding capital is a real tail risk. Responds to execution quality and operational load, not to decentralization.",
    solutionsSlug: "treasury-yield",
  },
  {
    id: "solvers",
    label: "Solvers & market makers",
    side: "technical",
    brief:
      "A solver or market maker deciding whether filling Eco intents is worth their capital. Cares about capital efficiency, quote competition, and how much inventory they must hold to compete.",
    solutionsSlug: "solvers",
  },
  {
    id: "agents",
    label: "AI agents & autonomous systems",
    side: "technical",
    brief:
      "A team building agents that must transact. Needs bounded authority, predictable outcomes, and one API for cross-chain action instead of per-chain wallet sprawl. The newest and least-covered door.",
    solutionsSlug: "agents",
  },
];

export const SITE_AUDIENCES: SiteAudience[] = [
  {
    id: "payment_treasury",
    label: "Payment & Treasury Platforms",
    icps: ["payments", "treasury"],
    brief:
      "Settlement, intraday liquidity, pre-funding, off-hours yield. Reads correspondent banking, nostro, netting and T+1 as their own problems.",
  },
  {
    id: "asset_issuers",
    label: "Asset Issuers",
    icps: ["issuers"],
    brief: "Stablecoin and tokenized-asset issuers: distribution across chains, at-par conversion, primary-market access, reserve and redemption mechanics.",
  },
  {
    id: "trading_platforms",
    label: "Trading Platforms",
    icps: ["exchanges", "solvers"],
    brief: "Exchanges, onramps, OTC and solvers: order types beyond swap-with-slippage, venue neutrality, best execution, signed quotes.",
  },
  {
    id: "wallet_platforms",
    label: "Wallet Platforms",
    icps: ["wallets"],
    brief: "Consumer and business wallets: 1:1 stablecoin UX, gasless flows, deposit addresses, the friction their users drop at.",
  },
  {
    id: "onchain_builders",
    label: "Onchain Builders",
    icps: ["builders", "protocols"],
    brief: "Developers and protocol teams: mechanism depth, what the call looks like, chain fragmentation as an engineering cost.",
  },
  {
    id: "agents",
    label: "Agents",
    icps: ["agents"],
    brief: "Teams building agents that transact: bounded authority, outcomes enforced onchain, policies the agent cannot route around. Newest door, least covered.",
  },
];
