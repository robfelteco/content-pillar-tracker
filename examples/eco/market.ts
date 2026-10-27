import type { MarketDef } from "@/lib/brand/types.ts";

// The vocabulary of the world @eco posts about: the stablecoin market as seen
// by institutions and developers. Read by the quote, discovery, education and
// video lanes; the pillars and positioning say what Eco is, this says what
// the market around it sounds like.

export const MARKET: MarketDef = {
  name: "the stablecoin market",

  keywords: [
    "stablecoin", "usdc", "usdt", "digital dollar", "tokenized deposit", "settlement",
    "clearing", "orchestration", "payment rail", "onchain payment", "treasury",
    "cross-border", "remittance", "custody", "tokenization", "rwa", "genius act", "mica",
  ],

  domainTerms: [
    "stablecoin", "stablecoins", "digital dollar", "tokenized deposit", "tokenised deposit",
    "tokenized cash", "tokenised cash", "tokenized money", "tokenised money", "usdc", "usdt",
    "onchain dollar", "onchain money", "onchain payment", "money movement", "settlement", "clearing",
  ],

  // Framing a neutral institutional platform must not amplify, by reason.
  quoteDisqualifiers: {
    price_speculation: /\b(price target|market cap|moon|pump|all[- ]time high|ath|rally|bull run|bear market|token price|\$[a-z]{2,6} to \$)/i,
    retail_framing: /\b(degen|ape|wagmi|ngmi|gm |fren|hodl|to the moon|diamond hands)\b/i,
    chain_tribalism: /\b(ethereum killer|solana killer|evm maxi|flippening|l1 wars|chain war)\b/i,
    // Adjacent to the market, but political commentary, not a claim about how money moves.
    regulatory_politics:
      /\b(clarity act|genius act|senate|congress|house committee|banking committee|white house|regulator[sy]?\s+(?:environment|framework)|idi\b|insured depository|bank charter|trust bank|occ\b|lower the standard|legislation|bill\b|political cycle|regulatory leadership|administrations)/i,
  },

  // A branded stablecoin ticker (MGUSD, SoFiUSD, FIUSD). USDC and USDT are the
  // market's reference assets and are excluded on purpose.
  ownTickerPattern: /\b(?!USDC\b|USDT\b)[A-Za-z]{2,8}USD\b/,

  quoteExamples: {
    take: [
      "stablecoins would become the rails of global payments",
      "Stablecoins have moved from the edge of payments to the mainstream",
      "Commerce runs 7 days a week, but moving money has been stuck on a 5-day cycle",
      "Crypto demand is moving past trading and into core financial infrastructure",
    ],
    skipSelfPromo: [
      "@SoFi is the first U.S. nationally chartered bank to offer a stablecoin",
      "MGUSD is a foundation for making money movement simpler",
      "Five years ago, we started turning stablecoins into real-world money infrastructure",
      "And now, with SoFiUSD as a settlement option in Mastercard's network...",
    ],
    skipPolitics: [
      "The current language around yield is a strong step forward towards the Clarity Act",
      "they should apply for a Bank IDI license not ask the Senate to lower the standard",
      "We need a durable regulatory environment for digital assets",
    ],
  },

  // The eco.com themes an educational post can imply.
  themes: [
    { id: "fragmentation", label: "Fragmentation", brief: "Liquidity, chains, venues and rails split into pieces that do not talk to each other." },
    { id: "pre_funding", label: "Pre-funding", brief: "Capital parked in advance (nostro, prefunded wallets, inventory) to make a payment or fill possible." },
    { id: "all_or_nothing", label: "All-or-nothing", brief: "Failsafe execution: every step confirms or nothing executes. PvP, DvP, atomic settlement, stranded funds." },
    { id: "programmable_rules", label: "Programmable rules", brief: "Policies and guardrails enforced in the money movement itself, not by a back office after the fact." },
    { id: "tokenized_assets", label: "Tokenized assets", brief: "RWAs, tokenized deposits, funds and securities moving on the same rails as stablecoins." },
    { id: "at_par", label: "At-par conversion", brief: "1:1 stablecoin-to-stablecoin and stablecoin-to-fiat conversion, signed quotes, no slippage." },
    { id: "agents", label: "Agents", brief: "Software agents that transact: bounded authority, machine-readable rails, outcomes enforced onchain." },
  ],

  discoveryLenses: [
    {
      id: "market-data",
      label: "Market data",
      brief:
        "Find a recent, verifiable stablecoin-market DATA point or trend (market cap milestone, volume crossover, growth curve, chain fragmentation, share shift) from data providers / research desks (DeFiLlama, Artemis, Visa Onchain Analytics, McKinsey, bank research). Each idea = one surprising number the ICP hasn't internalized yet.",
    },
    {
      id: "company-moves",
      label: "Company moves",
      brief:
        "Find a recent NAMED-company stablecoin move (a bank, card network, fintech, Fortune 500, asset manager issuing / settling / paying out in stablecoins) that signals where the market is going. Amplify the logo; never bash it.",
    },
    {
      id: "policy-infra",
      label: "Policy & infrastructure",
      brief:
        "Find a recent structural shift in rules or rails (GENIUS Act rollout, MiCA, state charters, new settlement rails/chains, custody approvals) and what it unlocks for institutions or developers.",
    },
  ],

  clipSeries: [
    { id: "product_explainer", label: "Product explainer", brief: "Head of Product / team explaining a mechanism to camera" },
    { id: "ceo_interview", label: "CEO interview clip", brief: "A cut from a podcast or show appearance" },
    { id: "concept_101", label: "Concept 101", brief: "'What is X' educational explainer, no Eco pitch" },
    { id: "market_take", label: "Market take", brief: "Commentary on a stablecoin-market development" },
    { id: "brand_film", label: "Brand film", brief: "Produced brand/marketing piece, not a talking head" },
    { id: "demo", label: "Product demo", brief: "Screen or in-app footage" },
    { id: "third_party", label: "Third-party clip", brief: "Someone outside Eco saying something useful" },
  ],

  stopwords: ["stablecoin", "stablecoins", "crypto", "market", "markets"],

  angleExamples: {
    frame: "Swift moves $X a day at Y cost, stablecoins settle the same value for Z. First inning.",
    mechanism: "Correspondent banking: nostro/vostro prefunding, and why it costs what it costs.",
  },
};
