# Contributing

Thanks for looking. This is a small codebase with one strong rule, so most of
this file is that rule and the checks that enforce it.

## The one rule: nothing about a brand lives outside `brand/`

The engine in `lib/` and `app/` must not know which company it is tracking.
Every name, handle, domain, product, pillar, persona, vocabulary word and
registry entry comes from `brand/` through the contract in
`lib/brand/types.ts`. If a change needs a fact about a company, add a field to
the contract, fill it in the starter and in `examples/eco/`, and read it from
there.

Two tests catch most slips:

```bash
npm run check
```

runs `scripts/brand-check.ts` (the brand folder against the contract and the
rules written in `brand/README.md`) and the TypeScript compiler. Then swap the
example in and run it again:

```bash
cp examples/eco/*.ts brand/ && npm run check && git checkout brand/
```

The example is the regression suite: it is a real, production-tested
configuration, and the engine's behaviour on it must not change by accident.
When a change deliberately alters behaviour (a classifier rule, a scoring
weight), say so in the pull request and show the before and after on the
example.

Grep is the third test. A pull request that adds `Eco`, `eco.com`, `@eco` or
a stablecoin term anywhere outside `brand/`, `examples/eco/` and comments will
be asked to move it.

## Conventions

- **Sources, not ids.** The core never names a pillar. It asks
  `pillarsByMode`, `pillarsWith` and `pillarsForMedia` in `lib/taxonomy.ts`.
  A new behaviour that depends on "which pillar" is a new trait or a new
  source on `PillarDef`, never a string comparison.
- **A source no pillar uses is off.** New lanes gate their tab, their
  queries and their nightly work on a pillar declaring the source.
- **Modules are plain ES modules with explicit `.ts` extensions** in relative
  imports, because the scripts run directly under Node's type stripping with
  no build step. Path aliases (`@/`) are for type-only imports and app code.
- **Prompts read the brand.** Any string handed to a model that mentions the
  company, its market or its people interpolates `BRAND`, `MARKET` or the
  relevant registry.
- **Placeholders have one form**, `<what is missing: not in the setup
  material>`, and never appear in comments, so `grep` finds exactly the
  gaps.
- **Comments explain why.** Much of the engine's value is the reasoning
  recorded next to each rule. Keep it, and add yours.

## Adding a source

A source is what a pillar drafts from. To add one (say, a podcast feed):

1. Add the value to `DraftMode` in `lib/brand/types.ts` and describe it.
2. Add any registry it needs to the contract, the starter and the example.
3. Write the shelf in `lib/` and gate everything on `pillarsByMode("yours")`.
4. Add the Prioritize branch in `app/page.tsx` and the hint in
   `app/components/RecActions.tsx`.
5. Document it in `brand/README.md` and in the setup skill's references.

## The setup skill

`.claude/skills/setup/` is how most adopters will configure the tracker. When
you change the contract, change the interview and the writing reference too,
and dry-run the skill: copy the repo, hand a fresh Claude Code session a brief
for a fictional company, and ask it to follow the skill and report what was
unclear. Every contract change so far has been shaken out this way.

## Pull requests

- One change per pull request, with the reasoning in the description.
- `npm run check` on the starter and on the example, and `npm run build`.
- No secrets, no `.env`, no exports of a real brand's data beyond what is
  already in `examples/eco/`.
- Keep `examples/eco/` faithful to the original deployment unless the change
  is a correction the original would also want.

## Licence

MIT. By contributing you agree your contribution is licensed the same way.
