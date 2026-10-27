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

## Pillar ids are special

`PILLAR_IDS` in `pillars.ts` is a compile-time union the whole app codes
against, and it must match the `content_template` enum in `db/schema.sql`.
Labels, descriptions, thresholds, shapes and buckets change freely. To add or
rename a pillar:

1. Edit `PILLAR_IDS`, `PILLAR_DEFS` and `PILLAR_SHAPES`.
2. Run `node scripts/brand-check.ts`. It prints the `ALTER TYPE` statement for
   any id the enum is missing and lists any enum value the brand no longer has.
3. Apply the statement, then `node --env-file=.env scripts/reclassify.ts <pillar>`.

The draft modes (`chains`, `products`, `articles`, `discovery`, `docs`,
`videos`, `dmv`, `generic`) are the generic hooks a pillar can use. A pillar
with no natural source shelf takes `discovery` or `generic`.

## Swapping in the example

```bash
cp examples/eco/*.ts brand/
```
