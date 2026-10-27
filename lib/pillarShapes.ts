import { TEMPLATE_BY_ID, type Template } from "./taxonomy.ts";
import { PILLAR_SHAPES } from "../brand/pillars.ts";
import type { PillarShape } from "./brand/types.ts";

// How a post should be BUILT, per pillar. The data is brand/pillars.ts
// PILLAR_SHAPES; this module formats it for the drafter prompt.

export type { PillarShape };
export { PILLAR_SHAPES };

// `lane` distinguishes the two jobs inside an educational pillar, which are
// different enough to need different instructions.
export function pillarShapeBlock(template: Template, lane?: "curriculum" | "news"): string {
  const s = PILLAR_SHAPES[template];
  if (!s) return "";
  const laneNote =
    TEMPLATE_BY_ID[template]?.externalOnly && lane
      ? lane === "curriculum"
        ? "\nLANE: analog curriculum. Long form in ONE post is usually right. Teach the mechanism, land the break, cite the source."
        : "\nLANE: market news. Tight, one post. Lead with the fact."
      : "";
  return [
    `HOW THIS PILLAR'S POSTS ARE BUILT:`,
    `  Form: ${s.form}`,
    `  Build: ${s.build}`,
    `  What earns the copy-link share here: ${s.citable}`,
    `  Avoid: ${s.avoid}`,
    laneNote,
  ]
    .filter(Boolean)
    .join("\n");
}
