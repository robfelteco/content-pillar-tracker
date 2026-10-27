import type { ProductDef, PostShape } from "@/lib/brand/types.ts";

// The product registry: what Product Posts rotate on. STARTER VALUES: one
// product per entry. `brief` is pasted into the drafter prompt, so write the
// fact sheet you want a model to work from. `guardrail` is what may NOT be
// claimed. `terms` are unambiguous tokens; `looseTerms` are ordinary English
// words only matched when the post also mentions the company.

export const PRODUCT_DEFS: ProductDef[] = [
  {
    id: "core_api",
    label: "Acme API",
    brief:
      "The Acme API is <what it is>, for <who>. A caller <does X>; the system <does Y>; the result is <Z>. It replaces <the thing customers used to build or buy>. Shipped <when>; <adoption or scale fact if you have one>.",
    guardrail: "Only claim what is generally available. Early-access features are 'early access', never 'live for everyone'.",
    terms: ["acme api"],
    looseTerms: ["api"],
  },
];

// The distinct jobs a product post does. The drafter picks one; the Prioritize
// card shows which have gone cold. These seven are generic enough to keep.
export const PRODUCT_POST_SHAPES: PostShape[] = [
  {
    id: "launch",
    label: "Launch / Introducing",
    brief: "Announce the release itself. State plainly what is now live, who it is for, and what it replaces. Confident, not press-release-y.",
  },
  {
    id: "problem_mechanism",
    label: "Problem → mechanism",
    brief: "Open on the concrete failure the reader already lives with, in their language, then show the mechanism that removes it. The workhorse shape. No product name in the first line.",
  },
  {
    id: "how_it_works",
    label: "How it works (numbered)",
    brief: "A short numbered walkthrough of the integration or the flow, 3-4 steps, developer-facing. Ends on what the builder no longer has to do.",
  },
  {
    id: "diagram",
    label: "Architecture / diagram",
    brief: "Copy that sets up a visual: an architecture diagram, a lifecycle, a flow chart. The text names the tension the diagram resolves; the image carries the detail.",
  },
  {
    id: "partner_proof",
    label: "Partner in production",
    brief: "Proof it is live in someone else's product. Lead with the partner's outcome, not your feature. Amplify the logo, never claim their credit.",
  },
  {
    id: "icp_objection",
    label: "ICP objection hook",
    brief: "Open on the exact objection the target persona would raise, then answer it.",
  },
  {
    id: "article_amplifier",
    label: "Article amplifier",
    brief: "Push the underlying article. A tight standalone thesis in the post body that earns the click, link in the body.",
  },
];
