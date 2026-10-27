# brand/

Everything the tracker knows about the company it tracks. The core in `lib/`
reads these files and nothing else about the brand. To adapt the tracker, edit
here. To see a complete, production-tested configuration, read `examples/eco/`.

| File | Holds | Read by |
| --- | --- | --- |
| `identity.ts` | Name, handle, own handles and domains, docs origin, the one-line description, URL to pillar rules | classification rules, every upstream prompt |
| `pillars.ts` | The pillar ids, labels, classifier descriptions, staleness thresholds, draft mode, ratio buckets, and how each pillar's posts are built | classifier, dashboard, prioritize, drafter |
| `positioning.ts` | The drafter's system prompt | copy generation |
| `audiences.ts` | Personas (ICPs) and the coarser site audiences | docs and video shelves, educational lane, drafter |
| `products.ts` | Products, their fact sheets and guardrails, and the shapes a product post takes | product dimension, drafter, prioritize |
| `voice.ts` | Commodity phrases, substantiation-gated words, the brand's own slop risk | anti-slop scan and brief |
| `entities.ts` | The platforms you integrate with ("chains": vocabulary, momentum account, live-without-article), the partners you highlight, the three data-visual lanes | post tagging, integration and data pillars, chain momentum, partner lanes |
| `curriculum.ts` | The analog curriculum: legacy concepts, where your mechanism breaks from each, teaching shapes | broad educational lane, angle bank, question mining |
| `channels.ts` | YouTube channels the curriculum lane watches | channel sweep and triage |
| `quoteRoster.ts` | Orgs, people and watch sources for quote discovery | quote lanes |
| `market.ts` | The market's vocabulary: name, keywords, on-domain terms, quote disqualifiers and examples, educational themes, discovery lenses, clip series | quote, discovery, education and video lanes |

Any registry may be empty; its lane then has nothing to do and stays quiet.

## Pillars are yours

A brand defines its own pillar set in `pillars.ts`: any snake_case ids, any
number, plus `other` (the review bucket). Ids are stored as text, so no
database change is needed to add, rename or remove one; renaming after posts
are classified means `node --env-file=.env scripts/reclassify.ts <pillar>`.

The core never names a pillar. It reads what each one declares:

- `draftMode`, the SOURCE it drafts from: `products`, `articles`, `docs`,
  `videos`, `chains` (integrated platforms), `dmv` (data visuals),
  `education` (the educational pipeline), `quotes`, or `generic` (no shelf).
  Several pillars may share a source; a source with no pillar is off.
- `media`, the media kinds a post in it can carry; the rule classifier
  narrows candidates by this before any model call.
- traits: `externalOnly` (the company is never named), `visualAnchor` (the
  image is the identity, so the classifier is shown a reference), `teaches`
  (explanation is the job), `easyWin`.

`node scripts/brand-check.ts` verifies the set.

## Swapping in the example

```bash
cp examples/eco/*.ts brand/
```
