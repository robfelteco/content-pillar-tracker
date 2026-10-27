# Writing the files

Six files, written in this order because later ones reference earlier ones.
Keep each file's imports, exports and comment structure from the starter;
replace the values. The contract is `lib/brand/types.ts`; if a field is
optional there, it is optional here.

## identity.ts

- `name` is matched as a whole word, case-insensitive, in post text.
- `ownHandles` lowercase, no `@`, and always includes `handle`.
- `urlRules`: only substrings that settle the pillar on their own. The docs
  domain is the usual one. Point each at an id that exists in `PILLAR_IDS`.
- `onCamera` is optional; omit the key when there is no video.

## pillars.ts

- Keep `PILLAR_IDS` unless the person insists. The `other` id must stay: the
  review queue routes to it.
- Every id needs an entry in `PILLAR_DEFS` and in `PILLAR_SHAPES`; the types
  enforce this, and `brand-check` says which is missing.
- Descriptions: signals first, exclusions second. Say what the post looks
  like (media, link target, phrasing, who is named), then "NOT X (that is
  pillar_y)" for the neighbour it is confused with. The Eco example's
  `integration_announcement` is the model.
- `staleDays` in days. `9999` hides the pillar from the staleness board.
- `ratioBucket`: `edu` for content with the company unnamed, `soft` for
  company-in-frame but standalone, `hard` for announce or sell, `null` to
  keep out of the meter (only `other`).

## products.ts

- `id` snake_case; `label` as the company writes it.
- `brief` is one paragraph, pasted into the prompt: what it is, who it is
  for, the mechanism, what it replaces, when it shipped. Numbers and dates
  earn their place. No adjectives doing the work of facts.
- `guardrail` where there is anything the drafter must not claim. Leave the
  key out when there is nothing.
- `terms` unambiguous, lowercase; `looseTerms` for ordinary-English names.
- Keep the seven `PRODUCT_POST_SHAPES` unless asked.

## audiences.ts

- `ICP_DEFS`: `side` is `technical`, `commercial` or `both`. `solutionsSlug`
  only when a docs page `/solutions/<slug>` defines the persona.
- `SITE_AUDIENCES`: each persona id appears in exactly one audience's
  `icps`. The educational lane's prompt lists these with their briefs, so
  write each brief as what that reader wants from an educational post.

## positioning.ts

- A single template literal export, `POSITIONING_BRIEF`, `.trim()`ed.
- Replace every `<angle bracket>` placeholder in the starter. Search for `<`
  when done; the only ones left should be inside prose that uses the
  character on purpose.
- Keep X ALGORITHM RULES and VOICE MECHANICS verbatim.
- Write the vocabulary section with the three columns and the substantiation
  rule; the voice file mirrors it.
- Backticks inside the prose must be escaped or avoided, since the brief is
  a template literal.

## voice.ts

- `commodityPhrases` lowercase; matched as whole words.
- `substantiationGated` lowercase single words.
- `gatedExceptions` keyed by the gated word, value a case-insensitive regex.
  Omit words with no exception.
- `substantiationTerms` lowercase nouns and verbs; the engine also counts any
  digit. Include the mechanism words from the product briefs.
- `voiceNote` is injected into the anti-slop brief after the test
  paragraph; two or three lines, no leading label.
- `contrastExample` uses the company's own world: a "not X, it's Y" sentence
  a writer would plausibly produce, and its direct rewrite.

## After writing

```bash
node scripts/brand-check.ts
npx tsc --noEmit
```

Then regenerate the copy brief so the human-readable version matches:

```bash
node --env-file=.env scripts/export-copy-brief.ts
```

If `.env` is not filled in yet, skip that last step and say so.
