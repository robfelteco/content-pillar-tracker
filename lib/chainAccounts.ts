import { CHAINS } from "../brand/entities.ts";
// The X account each chain's momentum is read from.
//
// Handles only — no ids. A user lookup costs one read and the id never changes,
// so it is resolved once and cached in chain_momentum_sources.user_id
// (Migration 018).
//
// Derived from brand/entities.ts: a chain with a momentumHandle is watched, and
// momentumEnabled says whether it is read daily or only on demand.

export interface ChainAccount {
  chain: string;
  handle: string;
  /**
   * Scanned by default. False for chains whose official account posts rarely
   * enough that a daily read is mostly wasted — they can be switched on in
   * chain_momentum_sources without a deploy.
   */
  enabled: boolean;
}

export const CHAIN_ACCOUNTS: ChainAccount[] = CHAINS.filter((c) => c.momentumHandle).map((c) => ({
  chain: c.id,
  handle: c.momentumHandle!,
  enabled: c.momentumEnabled ?? false,
}));

export const CHAIN_ACCOUNT_BY_CHAIN = new Map(CHAIN_ACCOUNTS.map((c) => [c.chain, c]));
