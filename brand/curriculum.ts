import type { AnalogDef, AnalogTier, EducationShape } from "@/lib/brand/types.ts";

// The analog-education curriculum: the legacy concepts your audience already
// thinks in, and where the company's mechanism breaks from each. STARTER
// VALUES: one worked entry to copy. The list may be empty; the curriculum lane
// then has nothing to teach and stays quiet.
//
// A registry scores by COVERAGE, not freshness: a concept never taught stays
// worth teaching, and stops being worth it once taught well. The one
// non-negotiable field is `breaksWhere`. A registry that only stores the
// parallel produces "we're the X of Y" copy. The parallel earns attention; the
// break is the post. This is a teaching input, never a positioning output.
//
// `icps` must be ids from brand/audiences.ts; brand-check verifies it.

export const TIER_LABEL: Record<AnalogTier, string> = {
  1: "Tier 1 — Direct analogs",
  2: "Tier 2 — Adjacent mechanisms",
  3: "Tier 3 — Specialist depth",
  4: "Tier 4 — Context",
};

export const TIER_HINT: Record<AnalogTier, string> = {
  1: "Where the parallel is tightest, and where the miscategorisation risk is highest. Teach these to counter-position out of the category, never into it.",
  2: "Mechanisms next door to yours that break in your favour on shipped product.",
  3: "Highest technical credibility per post, smallest audience.",
  4: "Widest reach and the most familiar hooks: the entry tier for a reader new to the category.",
};

export const ANALOG_DEFS: AnalogDef[] = [
  {
    id: "month_end_close",
    label: "The month-end close",
    tier: 1,
    side: "commercial",
    icps: ["operators"],
    breakStrength: 2,
    vocab: ["month-end close", "month end close", "close process", "closing the books"],
    parallel:
      "Finance teams reconcile every feed once a month because matching used to be manual: the close is a project, with a calendar, a checklist and a sign-off.",
    breaksWhere:
      "<where your mechanism makes the monthly cadence unnecessary, in one or two sentences: not in the setup material>",
    guardrail: "Do not claim the close disappears. Argue the narrow, correct point: the matching step stops being monthly.",
  },
];

// The teaching SHAPES: the narrative moves a curriculum post can take, so it
// does not default to "here is a fact about the old system". These six are
// generic and worth keeping.
export const EDUCATION_SHAPES: EducationShape[] = [
  {
    id: "kill_the_model",
    label: "Kill the naive model",
    brief: "Open by demolishing an assumption the reader holds, then let the post be the repair. The strongest cold open most accounts never use.",
  },
  {
    id: "condition_then_discipline",
    label: "Condition, then the discipline it forces",
    brief: "Two beats that make an argument feel inevitable instead of promotional: name the market condition, then the practice it forced into existence.",
  },
  {
    id: "three_variable_tradeoff",
    label: "The three-variable tradeoff",
    brief: "Show that optimising one variable wrecks another. Name all three and let the reader see the corner they are in.",
  },
  {
    id: "hidden_cost",
    label: "Price the cost they can't see",
    brief: "Name a cost the reader is already paying and has never measured, and give it the industry's own word for it. Ends naturally on a question the reader cannot answer.",
  },
  {
    id: "integrate_vs_operate",
    label: "Integration is a week, operating it is forever",
    brief: "The integration is cheap; the maintenance is the cost. The most persuasive form of 'without building it yourself'.",
  },
  {
    id: "closed_loop",
    label: "The closed loop",
    brief: "Do one narrow thing, then show the measurement that feeds the next decision. What makes a capability read as a system.",
  },
];
