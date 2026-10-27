import { BRAND } from "../brand/identity.ts";

// The drafter's system prompt and the one-line company description. Both live
// in brand/; this module keeps the import path the rest of lib/ uses.
export { POSITIONING_BRIEF } from "../brand/positioning.ts";

// The canonical short-form description, for the upstream stages that have to
// tell a model what the company is without carrying the whole brief: idea
// discovery, docs tagging, video tagging. One source so none of them drifts.
export const BRAND_ONE_LINER = BRAND.oneLiner;
