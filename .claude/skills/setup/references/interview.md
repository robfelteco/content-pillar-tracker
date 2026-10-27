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

If there is no docs site, or the docs pillar is parked, `docsOrigin: ""`. If
there is no YouTube channel, or the video pillar is parked, `youtubeHandle: ""`.
Both disable their shelf cleanly; a channel nobody drafts from should not be
synced and tagged every night.

### The one-liner

One paragraph telling a model what the company is. It feeds idea discovery,
docs tagging, video tagging and the classifier, so it should carry the
category, the customer, the mechanism and the outcome, in the company's own
vocabulary.

Draft it from the boilerplate or the homepage, then ask: "Here is how I'd
describe you to a model. What's wrong?" Watch for: the word they refuse
(a category they are often mistaken for), and the word they own.

## pillars.ts

This is the question to ask first, in the person's own words: "What are
your content pillars?" Then make each one real. Needed per pillar: an id, a
label, a classifier description that names visible signals, the source it
drafts from, the media it carries, its traits, cadence and ratio bucket.

The starter ships four generic pillars plus `other`; the Eco example has
nine. Neither is a template to fill in: the set is whatever the account
actually posts. Four to nine is the usual range.

Why: the description is the only thing the classifier reads about a pillar.
"Posts about our vision" classifies nothing. "Long-form text, no media,
often links to an essay on our blog, often quotes the CEO" classifies.

Ask for the list, then pillar by pillar: "What does one look like: media
type, where it links, who is named, how it's phrased?" If there are recent
posts, sort ten or twenty into piles together; the pillars and their
descriptions fall out of the sort, and so does the `media` list.

Then the source: "When you need a post in this pillar, where does the
material come from?" Your products (`products`), your blog (`articles`),
your docs (`docs`), your clips (`videos`), platforms you integrate with
(`chains`), data you chart (`dmv`), outside material you find and teach
(`education`), people you quote (`quotes`), or nothing in particular
(`generic`). A source only exists if a pillar uses it, and the files that
feed it (identity's docsOrigin and youtubeHandle, the registries) only
matter for sources in use.

Traits: `externalOnly` when the company is never named in the post;
`visualAnchor` when the image is what identifies the pillar; `teaches` when
explanation is the job; `easyWin` for the quick, high-frequency formats.

Then: "Roughly how often should each one appear?" That sets `staleDays`.
Weekly is 7, twice a month is 14, daily is 1 or 2. If they do not know, keep
the starter values and say so. A pillar they don't post is parked: id kept,
`staleDays: 9999`, `draftMode: "generic"`, bucket unchanged.

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
call; one persona that owns two solutions pages takes an array of slugs. Each `brief` is what that reader already believes and what would make
them click. Two to nine personas; two to six site audiences; every persona
appears in exactly one site audience's `icps`.

## positioning.ts

Needed: the company sections of the drafter's system prompt, matching the
starter's placeholders: who we are (category claim, the capability stack in
order of emphasis, the positioning line, the product list), the central
reframe, vocabulary (avoid / fine / ownable), voice do and don't, four
narrative pillars (the starter expects one each of inevitability, mechanism,
execution quality and defensibility; rename them if the company's story has
different beats), the two audience doors, guardrails.

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

Spelling and casing rules ("fintech, not FinTech", "onchain, one word") go in
the positioning brief's voice section, not here: the matcher is
case-insensitive and would flag every correct use.

`voiceNote` is one paragraph on this account's particular slop risk. For a
precise, institutional voice the starter's note is right. For a casual
consumer voice, say what the tell is there instead (enthusiasm, exclamation,
"we're so excited").

## entities.ts (only if the integration or data pillars are live)

Needed: the platforms the company integrates with and announces, each with
the X handles that mean it, distinctive keywords, the account to read its
momentum from, and whether the company is live there without ever having
published a piece about it. Then the partners the account highlights, with
handles and domains, and for each one that runs the product in production, a
one-line reason.

Why: handles are how a post gets tagged with a platform; the momentum account
is what the "they're ripping, you haven't posted" nudge reads; the
in-production flag is what lets a partner lane be drawn at all.

Ask: "List the platforms you've integrated with or announced. For each: their
X handle(s), is it live today or only announced, and should we watch their
account daily?" and "Which companies run your product in production today?"
Announced-but-not-live platforms get `announcedNotLive` with the reason, so a
"coming soon" post cannot mark them integrated. Keywords: only names that are not
ordinary English words; the handle carries the rest. Chains that are live
with no dedicated piece need the reason stated.

The three data-visual lanes keep their ids; relabel them in the company's
terms and set cadences. If the data pillar is parked, leave the starter.

## curriculum.ts (only if the educational pillar is live)

Needed: the legacy concepts the audience already thinks in, tiered, each with
the parallel to the company's mechanism and, required, where the parallel
breaks. Detection vocabulary per concept. Which personas care.

Why: the curriculum lane scores coverage, so an empty registry means it never
has anything to teach. The break is the post; a registry of parallels alone
produces "we're the X of Y" copy.

Ask: "What does your buyer's old world look like? Name the mechanisms,
institutions and jargon they already know." Then for each: "Where does your
way of doing it break from theirs?" Start with four to eight concepts; the
registry grows. Vocabulary must be jargon, never ordinary words.

## channels.ts and quoteRoster.ts (only if those lanes are live)

Channels: "Which podcasts or publishers regularly cover your market's
mechanisms?" Pin the channelId (the handle is optional), note whether the
publisher has a commercial position in what it explains, and whether its
Shorts are worth taking.

Roster: "Whose quotes would you be proud to put on a card? Which institutions
carry the most weight with your buyers?" Aim for 40 to 60 people across three
org tiers before expecting the lane to produce. Every person's org must be an
org in the list.
