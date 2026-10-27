import type { ChainDef, PartnerDef, DmvLaneDef, DmvLaneId, ChainArticleDef } from "@/lib/brand/types.ts";

// The platforms the company integrates with ("chains" in the schema) and the
// companies it highlights. Three things collapse into one entry per chain:
// the vocabulary that tags a post with it (handles, keywords), the X account
// its momentum is read from, and whether the company is live there without a
// dedicated piece. Keywords deliberately exclude ordinary English words
// (base, tempo, stellar, optimism, avalanche); the handle carries those.

export const CHAINS: ChainDef[] = [
  {
    id: "ethereum",
    label: "Ethereum",
    handles: ["ethereum"],
    keywords: ["ethereum"],
    momentumHandle: "ethereum",
    momentumEnabled: true,
    liveWithoutArticle: "Origin chain for Routes; never had a dedicated integration post.",
  },
  {
    id: "solana",
    label: "Solana",
    handles: ["solana"],
    keywords: ["solana"],
    momentumHandle: "solana",
    momentumEnabled: true,
  },
  {
    id: "polygon",
    label: "Polygon",
    handles: ["polygon", "0xpolygon"],
    keywords: ["polygon"],
    momentumHandle: "0xpolygon",
    momentumEnabled: true,
  },
  {
    id: "tron",
    label: "Tron",
    handles: ["trondao"],
    keywords: ["tron"],
    momentumHandle: "trondao",
    momentumEnabled: true,
  },
  {
    id: "bnb",
    label: "BNB Chain",
    handles: ["bnbchain", "binancechain"],
    keywords: ["bnb chain", "bnbchain"],
    momentumHandle: "bnbchain",
    momentumEnabled: true,
  },
  {
    id: "base",
    label: "Base",
    handles: ["base"],
    momentumHandle: "base",
    momentumEnabled: true,
    liveWithoutArticle: "Routed through since Portal launch; never had a dedicated integration post.",
  },
  {
    id: "arbitrum",
    label: "Arbitrum",
    handles: ["arbitrum"],
    keywords: ["arbitrum"],
    momentumHandle: "arbitrum",
    momentumEnabled: true,
  },
  {
    id: "optimism",
    label: "Optimism",
    handles: ["optimism", "optimismfnd"],
    momentumHandle: "optimism",
    momentumEnabled: true,
  },
  {
    id: "avalanche",
    label: "Avalanche",
    handles: ["avax", "avalancheavax"],
    momentumHandle: "avax",
    momentumEnabled: false,
  },
  {
    id: "hyperliquid",
    label: "Hyperliquid",
    handles: ["hyperliquidx"],
    keywords: ["hyperliquid"],
    momentumHandle: "hyperliquidx",
    momentumEnabled: true,
  },
  {
    id: "robinhood",
    label: "Robinhood Chain",
    handles: ["robinhoodcrypto"],
    momentumHandle: "robinhoodcrypto",
    momentumEnabled: true,
  },
  {
    id: "tempo",
    label: "Tempo",
    handles: ["tempo"],
    momentumHandle: "tempo_xyz",
    momentumEnabled: false,
  },
  {
    id: "plasma",
    label: "Plasma",
    handles: ["plasma"],
    momentumHandle: "plasma",
    momentumEnabled: false,
  },
  {
    id: "sei",
    label: "Sei",
    handles: ["sei", "seinetwork"],
    momentumHandle: "seinetwork",
    momentumEnabled: false,
  },
  {
    id: "sui",
    label: "Sui",
    handles: ["suinetwork"],
    momentumHandle: "suinetwork",
    momentumEnabled: false,
  },
  {
    id: "aptos",
    label: "Aptos",
    handles: ["aptos", "aptoslabs"],
    keywords: ["aptos"],
    momentumHandle: "aptos",
    momentumEnabled: false,
  },
  {
    id: "ton",
    label: "TON",
    handles: ["ton_blockchain", "the_open_network"],
    momentumHandle: "ton_blockchain",
    momentumEnabled: false,
  },
  {
    id: "celo",
    label: "Celo",
    handles: ["celo"],
    momentumHandle: "celo",
    momentumEnabled: false,
  },
  {
    id: "stellar",
    label: "Stellar",
    handles: ["stellarorg"],
    momentumHandle: "stellarorg",
    momentumEnabled: false,
  },
  {
    id: "xrpl",
    label: "XRPL",
    handles: ["ripple"],
    momentumHandle: "ripplexdev",
    momentumEnabled: false,
  },
  {
    id: "near",
    label: "NEAR",
    handles: ["nearprotocol"],
    momentumHandle: "nearprotocol",
    momentumEnabled: false,
  },
  {
    id: "zksync",
    label: "zkSync",
    handles: ["zksync"],
    keywords: ["zksync"],
    momentumHandle: "zksync",
    momentumEnabled: false,
  },
  {
    id: "starknet",
    label: "Starknet",
    handles: ["starknet"],
    keywords: ["starknet"],
    momentumHandle: "starknet",
    momentumEnabled: false,
  },
  {
    id: "unichain",
    label: "Unichain",
    handles: ["unichain"],
    momentumHandle: "unichain",
    momentumEnabled: true,
  },
  {
    id: "monad",
    label: "Monad",
    handles: ["monad_xyz"],
    momentumHandle: "monad",
    momentumEnabled: false,
  },
  {
    id: "berachain",
    label: "Berachain",
    handles: ["berachain"],
    keywords: ["berachain"],
    momentumHandle: "berachain",
    momentumEnabled: false,
  },
];

export const PARTNERS: PartnerDef[] = [
  {
    id: "circle",
    label: "Circle",
    handles: ["circle"],
    domains: ["circle.com"],
    inProduction: "Gateway + Agent Stack run Eco underneath; the most-posted partner in the pillar.",
  },
  {
    id: "tether",
    label: "Tether",
    handles: ["tether_to", "tether"],
  },
  {
    id: "paxos",
    label: "Paxos",
    handles: ["paxos"],
  },
  {
    id: "stripe",
    label: "Stripe",
    handles: ["stripe"],
    domains: ["stripe.com"],
  },
  {
    id: "visa",
    label: "Visa",
    handles: ["visa"],
  },
  {
    id: "mastercard",
    label: "Mastercard",
    handles: ["mastercard"],
  },
  {
    id: "paypal",
    label: "PayPal",
    handles: ["paypal"],
  },
  {
    id: "moneygram",
    label: "MoneyGram",
    handles: ["moneygram"],
  },
  {
    id: "doordash",
    label: "DoorDash",
    handles: ["doordash"],
  },
  {
    id: "revolut",
    label: "Revolut",
    handles: ["revolut"],
  },
  {
    id: "binance",
    label: "Binance",
    handles: ["binance", "binanceresearch"],
  },
  {
    id: "coinbase",
    label: "Coinbase",
    handles: ["coinbase"],
  },
  {
    id: "robinhood",
    label: "Robinhood",
    handles: ["robinhoodcrypto"],
  },
  {
    id: "citi",
    label: "Citi",
    handles: ["citi", "citigroup"],
    domains: ["citigroup.com"],
  },
  {
    id: "fireblocks",
    label: "Fireblocks",
    handles: ["fireblocks"],
    domains: ["fireblocks.com"],
  },
  {
    id: "zerohash",
    label: "Zero Hash",
    handles: ["zerohash"],
    domains: ["zerohash.com"],
  },
  {
    id: "para",
    label: "Para",
    handles: ["getpara"],
    domains: ["getpara.com", "blog.getpara.com"],
    inProduction: "Shipped Permit3 in production as Transaction Permissions.",
  },
  {
    id: "bridge",
    label: "Bridge",
    handles: ["stablecoin", "bridge_xyz"],
  },
  {
    id: "lifi",
    label: "LI.FI",
    handles: ["lifi"],
    domains: ["li.fi"],
    inProduction: "Routes @eco liquidity through LI.FI / Jumper.",
  },
  {
    id: "galaxy",
    label: "Galaxy",
    handles: ["galaxyhq"],
    domains: ["galaxy.com"],
  },
  {
    id: "nubank",
    label: "Nubank",
    handles: ["nubank"],
  },
  {
    id: "grab",
    label: "Grab",
    handles: ["grab"],
  },
  {
    id: "mercadolibre",
    label: "MercadoLibre",
    handles: ["mercadolibre"],
  },
  {
    id: "worldpay",
    label: "Worldpay",
    handles: ["worldpay"],
  },
  {
    id: "sphere",
    label: "Sphere",
    handles: ["sphere"],
  },
  {
    id: "tempo",
    label: "Tempo",
    handles: [],
    domains: ["tempo.xyz"],
  },
];

// The three data-visual lanes. The ids are fixed in lib/dmvLanes.ts; the
// labels, hints and cadences are yours.
export const DMV_LANES: Record<DmvLaneId, DmvLaneDef> = {
  integrated: {
    label: "Integrated-chain data",
    hint: "Data about a chain Eco is live on. These can close on routing through Eco.",
    staleDays: 10,
  },
  other_chain: {
    label: "Non-integrated chain data",
    hint: "Chain-specific data where Eco isn't live yet. No Eco CTA — this lane buys credibility on the market, and builds the case for integrating.",
    staleDays: 21,
  },
  market_wide: {
    label: "Market-wide data",
    hint: "Stablecoin supply, volume, share shifts — no single chain as the subject.",
    staleDays: 14,
  },
};

// The articles that carried each chain integration, so the chain pillar drafts
// from a published piece. `anchorStatusId` is the @eco status that carried the
// X article: pasting it into the composer unfurls the article card.
export const CHAIN_ARTICLES: ChainArticleDef[] = [
  { chain: "bnb", slug: "eco-expands-to-bnb-chain", anchorStatusId: "2046240619530444944", xArticleId: "2046240449535004672" },
  { chain: "hyperliquid", slug: "eco-upgrades-hyperliquid", anchorStatusId: "2037897563742908782", xArticleId: "2037897388148334592" },
  { chain: "tron", slug: "eco-integrates-tron", anchorStatusId: "2029591573473902875", xArticleId: "2029591340669685760" },
  { chain: "robinhood", slug: "eco-integrates-robinhood-chain", anchorStatusId: "2028478726963118287", xArticleId: "2028478534683176960" },
  { chain: "solana", slug: "eco-powers-stablecoin-bridging-between-solana-in-seconds-not-steps" },
  { chain: "polygon", slug: "eco-powers-next-chapter-of-polygons-stablecoin-economy" },
  { chain: "arbitrum", slug: "arbitrum-leads-usage-across-eco" },
];
