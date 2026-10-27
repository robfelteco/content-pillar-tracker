---
name: setup
description: Configure the Content Pillar Tracker for a new company by interviewing the adopter and writing the brand/ folder (identity, pillars, positioning, audiences, products, voice, and the optional-lane registries for integrated platforms, partners, curriculum, watched channels and the quote roster). Use this whenever someone opens this repo and wants to point the tracker at their own X account, says "set this up for us", "configure it for <company>", "replace the Acme placeholders", asks how to adapt the pillars or positioning to their brand, or asks what to put in brand/. Also use it when they want to re-run part of the setup later, such as adding a product, a pillar, or new vocabulary rules.
---

# Set up the tracker for a brand

You are turning the neutral starter in `brand/` into a real configuration for
the person in front of you. The core reads nothing else about the company, so
when `brand/` is right the whole app is right: classification, the dashboard,
the prioritize scoring and the copy drafter all key off these six files.

Two things make this go well. First, write from material, not from thin air:
a positioning doc, a boilerplate, the website, the docs site, a few months of
their posts. Ask for those before asking questions a document would answer.
Second, quality over completeness: a pillar description that names the
signals a classifier can see beats one that describes an aspiration, and a
product brief with a mechanism and a date beats one with adjectives.
`examples/eco/` is the bar. Read it once before you write anything.

## The flow

1. **Orient.** Read `brand/README.md`, `lib/brand/types.ts`, the ten current
   `brand/*.ts` files (six core, four registries), and every file in
   `examples/eco/`. The types are the
   contract, the current files are the structure you keep, the example is the
   quality bar. If `brand/identity.ts` no longer says Acme, this is a
   revision: read what is there and ask what should change rather than
   starting over.

2. **Collect material.** Ask for whatever exists: positioning or messaging
   doc, boilerplate, website URL, docs URL, the X handle, a product list, any
   written voice rules. Fetch the URLs if you have a web tool. On a re-run,
   when the database already has posts, pull the account's recent ones
   (`SELECT text FROM posts ORDER BY created_at DESC LIMIT 50`); on a fresh
   install there are none yet, and the vocabulary interview stands in for
   them. Everything you learn here removes a question from the interview.

3. **Interview.** Follow `references/interview.md`. It is organised by file,
   in the order the files depend on each other: identity, pillars, products,
   audiences, positioning, voice. Ask only what the material did not answer.
   Batch related questions. Offer a draft and ask for corrections rather than
   asking the person to compose from scratch; people edit faster than they
   write.

4. **Write the files.** Follow `references/writing-the-files.md`, one file at
   a time, in the same order. Keep each file's imports, exports and the
   explanatory comments; replace the values and drop the "STARTER VALUES"
   notes. The pillar ids are the one thing you keep unless the person really
   needs a different set, because they are the database enum.

5. **Verify.** From the repo root:

   ```bash
   node scripts/brand-check.ts
   npx tsc --noEmit
   node --env-file=.env scripts/export-copy-brief.ts
   ```

   `brand-check` prints `brand ok` when the pillar ids match the database
   enum and the audience lists are consistent, or says exactly what is off,
   with the `ALTER TYPE` SQL when ids changed. If ids changed, show the
   statements, add the new ids to the enum in `db/schema.sql`, and tell the
   person to run the migration before the next sync. A type error means a
   file does not match the contract; fix the file, do not loosen the types.
   The last command regenerates `COPY-BRIEF.md`, the human-readable copy of
   what the drafter reads; skip it and say so when `.env` is not filled in.

6. **Report.** One line per file on what it now holds. Then the fields you
   guessed at and why, and every placeholder you left, so the person can grep
   for them. Then the two or three things worth refining after a week of
   real drafts. Close with the runtime steps from the README (fill `.env`,
   migrate, first sync) and, if the integration pillar is live, the note at
   the end of "The optional-lane registries" below about the word "chain".

## Judgment calls

- **The name is matched as a whole word in post text.** A company called
  "Flow" will match the ordinary word. Say so, and suggest a more specific
  `name` only if the collision would be common in their posts; otherwise the
  domain and handle checks carry it.
- **Parking a pillar.** A pillar the account does not post keeps its id,
  takes `staleDays: 9999` (the board hides it), `draftMode: "generic"` (so
  no shelf is consulted for it), and keeps a non-null `ratioBucket` (only
  `other` is null). Never delete an id.
- **Shelves follow pillars.** If the video pillar is parked, set
  `youtubeHandle: ""` even when a channel exists, or the shelf keeps syncing
  and tagging clips nobody drafts from. Same for `docsOrigin: ""` when the
  docs pillar is parked.
- **Unknown cadence.** Keep the starter's `staleDays` and the 4-1-1 ratio and
  say so in the report; a week of data fixes them faster than guessing.
- **The one-liner is pasted into every upstream prompt.** Write it the way
  they want models to describe them, in their words, with the mechanism. It
  is not a tagline.
- **The positioning brief keeps the algorithm section.** The X ranking
  weights in the starter are public and generic; only the company sections
  change.
- **Voice rules are soft and case-insensitive.** Commodity phrases and gated
  words flag drafts for the operator; they do not reject them. Without a
  post corpus, seed them from the vocabulary interview's "avoid" column and
  mark them as category words, not observed overuse. Spelling and casing
  rules ("fintech, not FinTech") cannot live in `voice.ts`, because the
  matcher ignores case; they go in the positioning brief's voice section.
- **Do not invent facts.** A placeholder is better than a confident wrong
  claim, because the drafter will repeat the claim in copy. Use one form
  everywhere, `<what is missing: not in the setup material>`, so the person
  can grep for `not in the setup material`, and keep that phrase out of
  comments so the grep stays clean. This applies to the positioning
  brief as much as to product briefs. The `<-` arrows in the algorithm table
  are not placeholders.

## The optional-lane registries

Four more files in `brand/` feed the optional lanes, and every one of them
may be left empty, which switches its lane off cleanly:

- `entities.ts`: the platforms the company integrates with (the schema calls
  them chains), the partners it highlights, and the three data-visual lanes.
  Needed by the `chains` and `dmv` draft modes and the chain-momentum tab.
- `curriculum.ts`: legacy concepts the audience thinks in and where the
  company's mechanism breaks from each. Needed by the curriculum half of
  `discovery`, the angle bank and question mining.
- `channels.ts`: YouTube channels the curriculum lane watches.
- `quoteRoster.ts`: orgs, people and watch sources for quote discovery.

Do these AFTER the six core files, and only for the lanes the person's
pillars use. A parked pillar's registry stays empty. The interview reference
has a block for each. The one thing `brand/` does not rename is the word
"chain": it is in the schema and the UI, so a company whose "chains" are
payment processors or marketplaces will see that word on the integration
pillar's screens until a later change renames it.
