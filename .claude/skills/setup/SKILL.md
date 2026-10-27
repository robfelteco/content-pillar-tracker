---
name: setup
description: Configure the Content Pillar Tracker for a new company by interviewing the adopter and writing the brand/ folder (identity, pillars, positioning, audiences, products, voice). Use this whenever someone opens this repo and wants to point the tracker at their own X account, says "set this up for us", "configure it for <company>", "replace the Acme placeholders", asks how to adapt the pillars or positioning to their brand, or asks what to put in brand/. Also use it when they want to re-run part of the setup later, such as adding a product, a pillar, or new vocabulary rules.
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

1. **Orient.** Read `brand/README.md`, `lib/brand/types.ts` and every file in
   `examples/eco/`. The types are the contract; the example is the quality bar.
   Check `git status`: if `brand/` already differs from the starter, this is a
   revision, so read what is there and ask what should change rather than
   starting over.

2. **Collect material.** Ask for whatever exists: positioning or messaging
   doc, boilerplate, website URL, docs URL, the X handle, a product list, any
   written voice rules. Fetch the URLs if you have a web tool. Pull the
   account's recent posts if the X keys are in `.env` and the database already
   has posts (`SELECT text FROM posts ORDER BY created_at DESC LIMIT 50`).
   Everything you learn here removes a question from the interview.

3. **Interview.** Follow `references/interview.md`. It is organised by file,
   in the order the files depend on each other: identity, pillars, products,
   audiences, positioning, voice. Ask only what the material did not answer.
   Batch related questions. Offer a draft and ask for corrections rather than
   asking the person to compose from scratch; people edit faster than they
   write.

4. **Write the files.** Follow `references/writing-the-files.md`, one file at
   a time, in the same order. Keep the starter's structure and comments; swap
   the values. The pillar ids are the one thing you should keep unless the
   person really needs a different set, because they are the database enum.

5. **Verify.** Run, in order:

   ```bash
   node scripts/brand-check.ts
   npx tsc --noEmit
   ```

   `brand-check` prints `brand ok` or the SQL the database needs. If pillar
   ids changed, show the person the `ALTER TYPE` statements, add the new ids
   to the enum in `db/schema.sql`, and tell them to run the migration before
   the next sync. A type error means a file does not match the contract; fix
   it, do not loosen the types.

6. **Report.** Say what each file now holds in one line each, name the
   fields you guessed at (and why), and list the two or three things worth
   refining after a week of real drafts. Then point at the runtime steps in
   the README: fill `.env`, migrate, first sync.

## Judgment calls

- **The name is matched as a whole word in post text.** A company called
  "Flow" will match the ordinary word. Say so, and suggest a more specific
  `name` only if the collision would be common in their posts; otherwise the
  domain and handle checks carry it.
- **Fewer pillars is fine.** A company with no docs site or no video sets
  those pillars' `staleDays` to 9999 and keeps the id; the board hides
  nothing and the enum stays valid. Do not delete ids.
- **Draft modes are hooks, not labels.** `chains` ranks tracked entities,
  `products` ranks products, `docs` and `videos` need those shelves, `dmv`
  needs the data-visual lanes. A pillar with no natural shelf takes
  `discovery` or `generic`.
- **The one-liner is pasted into every upstream prompt.** Write it the way
  they want models to describe them, in their words, with the mechanism. It
  is not a tagline.
- **The positioning brief keeps the algorithm section.** The X ranking
  weights in the starter are public and generic; only the company sections
  change.
- **Voice rules are soft.** Commodity phrases and gated words flag drafts for
  the operator; they do not reject them. Start with the phrases their own
  posts overuse, which you can see if you pulled recent posts.
- **Do not invent facts about the product.** A brief with a `<placeholder>`
  left in it is better than a confident wrong claim, because the drafter will
  repeat the claim in copy. Leave the placeholder and name it in the report.
