---
name: setup
description: Configure the Content Pillar Tracker for a new company by interviewing the adopter and writing the brand/ folder (identity, pillars, positioning, audiences, products, voice, and the optional-lane registries for integrated platforms, partners, curriculum, watched channels and the quote roster). Use this whenever someone opens this repo and wants to point the tracker at their own X account, says "set this up for us", "configure it for <company>", "replace the Acme placeholders", asks how to adapt the pillars or positioning to their brand, or asks what to put in brand/. Also use it when they want to re-run part of the setup later, such as adding a product, a pillar, or new vocabulary rules.
---

# Set up the tracker for a brand

You are turning the neutral starter in `brand/` into a real configuration for
the person in front of you. The core reads nothing else about the company, so
when `brand/` is right the whole app is right: classification, the dashboard,
the prioritize scoring and the copy drafter all key off these eleven files:
six core, four registries, and the market vocabulary.

Two things make this go well. First, write from material, not from thin air:
a positioning doc, a boilerplate, the website, the docs site, a few months of
their posts. Ask for those before asking questions a document would answer.
Second, quality over completeness: a pillar description that names the
signals a classifier can see beats one that describes an aspiration, and a
product brief with a mechanism and a date beats one with adjectives.
`examples/eco/` is the bar. Read `pillars.ts`, `positioning.ts`, `products.ts`
and `identity.ts` there in full before you write anything; `curriculum.ts` and
`quoteRoster.ts` are large, so read one entry of each for the shape and skim
the rest for scale.

## The flow

1. **Orient.** Read `brand/README.md`, `lib/brand/types.ts`, the eleven
   brand data files (six core, four registries, `market.ts`; `index.ts` is
   just the re-exports), and the example files named below. The types are the
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
   notes. Pillar ids are free: they are stored as text and the core reads
   the pillar's declarations, not its name.

5. **Verify.** From the repo root:

   ```bash
   node scripts/brand-check.ts
   npx tsc --noEmit
   node scripts/export-copy-brief.ts
   ```

   `brand-check` prints `brand ok` when the pillar set, the audience lists
   and the registries are consistent, or says exactly what is off. On a
   re-run where pillar ids changed, tell the person which pillars to
   reclassify (`scripts/reclassify.ts`). A type error means a
   file does not match the contract; fix the file, do not loosen the types.
   The last command regenerates `COPY-BRIEF.md`, the human-readable copy of
   what the drafter reads. It needs no `.env` and no database; always run it,
   and hand the person the file: it is the one artefact that shows them what
   the drafter will be told.

6. **Keys.** Run `npm run env:check`. It works with no `.env` at all: it
   lists the lanes this brand turned on, the keys each one needs, whether
   each is set, where to get it and how it is billed, and nothing for lanes
   that are off. Walk the person through it:

   - Copy `.env.example` to `.env` if they have not, and tell them which
     keys to fill, in the order the check lists them. Required keys for the
     core first; a lane's keys only if they want that lane.
   - They paste the values into `.env` themselves. Never ask for a key
     value in chat, never write one into a file for them, and never print
     one: transcripts get shared. If they paste a key into the chat anyway,
     do not repeat it, tell them to move it into `.env`, and suggest
     rotating it if the conversation will be shared.
   - If they do not want to pay for a lane, that is a brand change, not a
     missing key: give its pillar `draftMode: "generic"` (or empty the
     registry), re-run brand-check, and the lane goes quiet.
   - Re-run `npm run env:check` until no lane that is on shows MISSING.
     "missing" (lower case) means part of a lane is skipped, which is fine.

7. **Report.** One line per file on what it now holds. Then the fields you
   guessed at and why, and every placeholder you left, so the person can grep
   for them. Then the two or three things worth refining after a week of
   real drafts. Then the lanes that are on and any key still missing.
   Close with the runtime steps from the README that come after setup:
   migrate, first sync.

## Judgment calls

- **The name is matched as a whole word in post text.** A company called
  "Flow" will match the ordinary word. Say so, and suggest a more specific
  `name` only if the collision would be common in their posts; otherwise the
  domain and handle checks carry it.
- **Pillars are the brand's to define.** Any set, any snake_case ids, plus
  `other`. Start from what the account actually posts: sort twenty recent
  posts into piles with the person and the pillars fall out. Each one then
  declares its source (`draftMode`), its media, and its traits; the core
  reads those and never the id. A source no pillar uses is off, so there is
  no need to park pillars for things the company does not do: leave them out.
- **Parking a pillar** (keeping one the account posts rarely): `staleDays:
  9999` hides it from the board, `draftMode: "generic"` keeps shelves out of
  it, bucket stays non-null (only `other` is null).
- **Shelves follow pillars.** If the video pillar is parked, set
  `youtubeHandle: ""` even when a channel exists, or the shelf keeps syncing
  and tagging clips nobody drafts from. Same for `docsOrigin: ""` when the
  docs pillar is parked.
- **Unknown cadence.** Keep the 4-1-1 ratio and these `staleDays` defaults by
  source, and say so in the report: products 10, articles 14, docs 14,
  videos 14, chains 14, dmv 10, education 3, quotes 14. A week of data fixes
  them faster than guessing.
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
- **Pre-announcements need both halves.** The integration pillar's description
  excludes "coming soon" posts (they go to `other`, where the review queue
  sees them), AND the platform carries `announcedNotLive` in entities.ts. The description steers the classifier; only the flag keeps
  a misfiled post from marking the platform live.
- **Reference images come from their own corpus.** `visualAnchor` tells the
  classifier to show a reference image for the pillar, drawn from posts
  already classified in the database (a human-verified one when there is
  one). A fresh brand has none until the first posts are labelled, so the
  trait costs nothing and helps once the review queue has been worked.
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
- `market.ts`: the market's vocabulary (name, keywords, on-domain terms,
  quote disqualifiers and examples, educational themes, discovery lenses,
  clip series). Needed whenever the quotes, education or videos sources are
  in use; the lanes cannot tell on-topic from off-topic without it.

Do these AFTER the six core files, and only for the sources the person's
pillars use. A source no pillar uses is off: its registry stays empty, its
tab and lanes do not render, its nightly sweep does not run. The interview
reference has a block for each. The platform lane calls its platforms
whatever `platformNoun` in identity.ts says ("chain", "processor",
"marketplace"); the schema keeps the column name `chains` regardless.
