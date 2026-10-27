# The interview

Organised by file, in dependency order. Each block says what the file needs,
why, and what a good answer looks like. Skip anything the material already
answered, and say so ("your boilerplate gives me the one-liner, I'll draft from
that"). Ask a block at a time, not the whole list.

## identity.ts

Needed: company name as written in posts, X handle, other handles that count
as "us" (CEO, founders, team accounts), company-owned domains, the blog domain,
the docs origin, the YouTube handle, who recurs on camera.

Why: `name`, `ownHandles` and `domains` are how the classifier decides whether
a post is about the company. A missing CEO handle means every CEO quote-post
is classified as external content.

Ask: "Which X accounts, besides @handle, post as the company? Your CEO,
founders, a product account?" and "Which domains do your posts link to that
are yours? Marketing site, docs, blog, app?"

Good: `ownHandles: ["acme", "janedoe", "acmedevs"]`,
`domains: ["acme.com", "docs.acme.com", "blog.acme.com"]`.

If there is no docs site, `docsOrigin: ""`. If no YouTube, `youtubeHandle: ""`.
Both disable their shelf cleanly.

### The one-liner

One paragraph telling a model what the company is. It feeds idea discovery,
docs tagging, video tagging and the classifier, so it should carry the
category, the customer, the mechanism and the outcome, in the company's own
vocabulary.

Draft it from the boilerplate or the homepage, then ask: "Here is how I'd
describe you to a model. What's wrong?" Watch for: the word they refuse
(a category they are often mistaken for), and the word they own.

## pillars.ts

Needed: for each of the nine starter pillars, whether it applies, its label,
and a classifier description that names visible signals.

Why: the description is the only thing the classifier reads about a pillar.
"Posts about our vision" classifies nothing. "Long-form text, no media,
often links to an essay on our blog, often quotes the CEO" classifies.

Ask, pillar by pillar, with the starter description on screen: "Does your
account post this? What does one look like: media type, where it links, who
is named, how it's phrased?" If they pull recent posts, sort five or ten into
pillars together; the descriptions write themselves from the sort.

Then: "Roughly how often should each one appear?" That sets `staleDays`.
Weekly is 7, twice a month is 14, daily is 1 or 2. A pillar they don't post
keeps its id with `staleDays: 9999`.

Then the ratio: "Of every six posts, how many should be pure education with
you not named, how many soft (you're in frame but it stands alone), how many
hard (announce or sell)?" Default 4-1-1. Assign each pillar a bucket.

`PILLAR_SHAPES` can keep the starter wording unless they have evidence.
Ask once: "Is there a pillar where you know what works, a form or a number?"
and fold that in.

## products.ts

Needed: each product's id, label, a fact-sheet paragraph, a guardrail, and
the tokens that name it in a post.

Why: the drafter writes from `brief`. Without a mechanism in it, every product
post reads as generic infrastructure copy. `guardrail` is the one line that
stops the drafter claiming early-access as GA or roadmap as shipped.

Ask: "List your products or named features. For each: what it is, who it's
for, how it works in one sentence, when it shipped, and what you must not
say about it." Draft briefs from the docs if you have them, then confirm.

`terms` are unambiguous ("acme routes", "permit3"). `looseTerms` are ordinary
words that only count on a company post ("routes", "api"). Ask: "Which
product names are also ordinary words?"

Keep `PRODUCT_POST_SHAPES` as shipped unless they object; the seven shapes
are generic.

## audiences.ts

Needed: the personas the docs or site name (`ICP_DEFS`), and the coarser
audiences the educational lane picks from (`SITE_AUDIENCES`).

Why: the docs and video shelves group on persona, and the prioritize card can
only say "you've never written for the commercial door" if the sides are set.

Ask: "Who do you sell to? Which of them are technical readers, which are
commercial, which both?" If the docs have a Solutions-for-X section, mirror
its slugs as `solutionsSlug` so docs pages tag themselves without a model
call. Each `brief` is what that reader already believes and what would make
them click. Two to nine personas; two to six site audiences; every persona
appears in exactly one site audience's `icps`.

## positioning.ts

Needed: the company sections of the drafter's system prompt: who we are, the
central reframe, vocabulary (avoid / fine / ownable), voice do and don't,
narrative pillars, the two audience doors, guardrails.

Why: this is the whole voice of the copy generator. Everything else in the
tracker measures; this file writes.

If they have a positioning doc, distil it: the brief should read like a
senior marketer's notes to a new writer, not like the doc. If they don't,
interview against the starter's angle-bracket placeholders, one section at a
time, and draft. The vocabulary section is the highest-value question:
"Which words do all your competitors use? Which words do you alone get to
use? Which words sound like a claim but mean nothing without proof?"

Keep the X ALGORITHM RULES and VOICE MECHANICS sections verbatim.

## voice.ts

Needed: commodity phrases, substantiation-gated words, exceptions, and the
terms that count as substantiation.

Why: the generic anti-slop engine catches model prose. This file catches the
company's own worn-out phrases, which no generic list knows.

The vocabulary answer from positioning fills most of it: the "avoid" column is
`commodityPhrases`; the "sounds like a claim" words are `substantiationGated`;
`substantiationTerms` are the mechanism nouns from their product briefs.
Ask one more: "Are there phrases you've decided to stop saying about
yourselves?" and "Is there a sense of a gated word that is fine? ('trusted
third party' as a critique, say)."

`voiceNote` is one paragraph on this account's particular slop risk. For a
precise, institutional voice the starter's note is right. For a casual
consumer voice, say what the tell is there instead (enthusiasm, exclamation,
"we're so excited").
