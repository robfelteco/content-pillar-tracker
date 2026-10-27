# Writing the files

Six files, written in this order because later ones reference earlier ones.
Keep each file's imports, exports and explanatory comments from the starter;
replace the values and delete the "STARTER VALUES" notes.

Placeholders, in any file, take one form so they can be grepped:
`<what is missing: not in the setup material>`. The contract is `lib/brand/types.ts`; if a field is
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
- A parked pillar: `staleDays: 9999`, `draftMode: "generic"`, bucket kept.
- `draftMode` `chains` and `dmv` read `brand/entities.ts`; use them when the
  company integrates with platforms worth announcing and charting.
- The integration pillar's description must exclude pre-announcements ("X
  coming soon"): a post filed there marks the platform as live.
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
  only when a docs page `/solutions/<slug>` defines the persona; a string or
  an array of strings.
- `SITE_AUDIENCES`: each persona id appears in exactly one audience's
  `icps`. The educational lane's prompt lists these with their briefs, so
  write each brief as what that reader wants from an educational post.

## positioning.ts

- A single template literal export, `POSITIONING_BRIEF`, `.trim()`ed.
- Replace every `<angle bracket>` placeholder in the starter with the
  company's content, or with the standard placeholder when the material does
  not say. Search for `<` when done; what remains should be standard
  placeholders and the `<-` arrows in the algorithm table.
- Keep X ALGORITHM RULES and VOICE MECHANICS verbatim.
- Write the vocabulary section with the three columns and the substantiation
  rule; the voice file mirrors it.
- Backticks inside the prose must be escaped or avoided, since the brief is
  a template literal.

## voice.ts

- `commodityPhrases` lowercase; matched as whole words, case-insensitive.
  Casing rules therefore go in positioning.ts, not here.
- `substantiationGated` single words or hyphenated tokens ("real-time"),
  matched case-insensitively as whole words.
- `gatedExceptions` keyed by the gated word, value a case-insensitive regex.
  Omit words with no exception.
- `substantiationTerms` nouns and verbs, matched case-insensitively; the
  engine also counts any digit. Include the mechanism words from the product briefs.
- `voiceNote` is injected into the anti-slop brief after the test
  paragraph; two or three lines, no leading label.
- `contrastExample` uses the company's own world: a "not X, it's Y" sentence
  a writer would plausibly produce, and its direct rewrite.

## entities.ts

- `id` snake_case; `handles` lowercase, no `@`, unique across all chains. A
  partner may reuse a chain's handle: a feed provider is often both.
- `keywords` only for names that are unambiguous in text.
- `momentumHandle` plus `momentumEnabled: true` only for platforms worth a
  daily read; the rest stay off and can be switched on in the database.
- `liveWithoutArticle` carries the reason; an unexplained line is
  indistinguishable from a mistake.
- `announcedNotLive` for a platform that has been announced but is not live:
  it is kept out of the integrated set even if a post about it is filed under
  the integration pillar.
- Partners: `inProduction` only when the partner runs the product today.
- `DMV_LANES` keeps its three keys.

## curriculum.ts

- Keep the four tiers; relabel them.
- `icps` reference `brand/audiences.ts` ids.
- `breaksWhere` is required and specific; a placeholder is acceptable, an
  empty string is not.
- Keep the six `EDUCATION_SHAPES` unless asked.

## channels.ts and quoteRoster.ts

- Channel `id` is the YouTube channelId (UC…); `handle` is optional. Add
  each channel to `WATCH_SEED` as well.
- `PersonSeed.title` spelled out ("Chief Executive Officer", not "CEO"), as
  it prints on a card. `xHandle` on orgs and people as the account writes
  it; case does not matter there.
- `PersonSeed.org` must match an `OrgSeed.name` exactly.
- `WATCH_SEED.kind` is one of `yt_channel`, `report_site`, `x_search`.

`brand-check` verifies all of the above.

## After writing

Run the three verification commands in SKILL.md step 5. Then
`grep -rn "not in the setup material" brand/` should list only placeholders:
keep the phrase out of comments.
