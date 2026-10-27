# Content Pillar Tracker

A self-hosted tracker for a company's X account. It files every post into the
content pillars you define, shows which pillar has gone cold and what each one
earns, and drafts a sourced starting point for the next post. Open-sourced from
a tracker built for one company's social lead and extracted so any brand can
plug in its own pillars, products, audiences, voice and sources.

## What you get

- **A daily record, not a snapshot.** Posts come in through the X API every
  night with a metrics snapshot per day, so you see trends instead of
  overwritten counts.
- **Classification you can audit.** Deterministic rules first (your URL
  patterns, media, mentions), Claude for the rest, and a review queue for
  anything uncertain. Human labels always win.
- **A prioritized board.** Each pillar scores 0 to 100 on staleness, cadence
  drift and performance, with the posting ratio you aim for (four educational
  posts to one soft and one hard promo by default) kept honest.
- **Drafts with receipts.** The top pick drafts from material you actually
  have on file: your articles, docs pages, products, clips, quotes, or a
  curriculum of concepts your buyers already know. A hard anti-slop pass and a
  grounding check sit on the way out. No source, no draft.
- **A closed loop.** Mark a draft as used and the next sync finds the
  published post and attributes its impressions back to the draft, the source
  and the pillar.

## How it is put together

Three layers, and only one of them is yours to write.

| Layer | Where | What it is |
| --- | --- | --- |
| Engine | `lib/`, `app/` | Ingest, snapshots, classification, scoring, drafting, attribution. Knows nothing about any company. |
| Sources | `lib/` modules gated by `brand/` | Articles, docs, videos, products, integrated platforms, data visuals, an educational pipeline, quote discovery. Each is on only when a pillar uses it. |
| Brand | `brand/` | Eleven typed data files: who you are, your pillars, positioning, audiences, products, voice, the platforms and partners you track, your curriculum, watched channels, quote roster, and your market's vocabulary. |

The engine never names a pillar. Each pillar declares the source it drafts
from, the media it carries and a few traits, and the engine reads those. Any
set of pillars works, and ids are stored as plain text.

## Requirements

- Node 22.18 or newer (the scripts run as TypeScript directly, no build step)
- A Postgres database (built on Neon; any Postgres works)
- An X developer app with OAuth 1.0a user context for the account you track
- An Anthropic API key
- A Google Workspace domain for sign-in (NextAuth)
- Claude Code, for the setup interview (optional but recommended)

## Quick start

1. Clone, then `npm install`.
2. Copy `.env.example` to `.env` and fill the minimum set: `DATABASE_URL`,
   the four `TWITTER_*` values, `X_ACCOUNT_HANDLE`, `ANTHROPIC_API_KEY`,
   `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, `AUTH_ALLOWED_DOMAIN`,
   `CRON_SECRET`.
3. Open the folder in Claude Code and run `/setup`. It asks what your content
   pillars are, where each one's material comes from, who you sell to, what
   you own and refuse in your vocabulary, and writes `brand/` for you. Or edit
   the starter by hand; `brand/README.md` explains every file.
4. Check it:

```bash
npm run check
```

5. Apply the schema:

```bash
npm run migrate
```

6. Run it:

```bash
npm run dev
```

7. Trigger the first sync by calling `/api/sync` with
   `Authorization: Bearer $CRON_SECRET`. On Vercel the schedule in
   `vercel.json` takes over from there.

A complete, production-tested configuration lives in `examples/eco/`. Read it
to see what a finished brand folder looks like, or copy it over the starter to
run the tracker exactly as the original deployment did.

## Optional lanes

Each lane is off until a pillar uses its source and its key is set.

| Lane | Source | Needs |
| --- | --- | --- |
| Developer docs shelf | `docs` | `docsOrigin` in identity, a docs site that publishes `llms.txt` |
| Short-form video shelf | `videos` | `youtubeHandle` in identity, `YOUTUBE_API_KEY`, `GEMINI_API_KEY` for tagging |
| Integrated platforms and momentum | `chains`, `dmv` | `entities.ts` |
| Curriculum and watched channels | `education` | `curriculum.ts`, `channels.ts`, `YOUTUBE_API_KEY`, `GEMINI_API_KEY`, `FIRECRAWL_API_KEY` |
| Discovery (web search) | `education` | `XAI_API_KEY` |
| Quote discovery | `quotes` | `quoteRoster.ts`, `market.ts`, `YOUTUBE_API_KEY`, `GEMINI_API_KEY`, `FIRECRAWL_API_KEY` |

## Running it in production

Deploy to Vercel with the same environment variables. Five cron routes are
declared in `vercel.json`: the nightly post sync, the source sweep, the
channel sweep and transcription, and the educational intake. Each one is a
no-op for lanes that are off.

Cost: the X API is pay per read, so a backfill of a few hundred posts is a
one-time charge of a few dollars and the daily sync is a few dollars a month.
Claude runs only on posts the rules could not decide and on drafts you ask
for. Optional lanes add their own provider costs.

## Useful commands

| Command | Does |
| --- | --- |
| `npm run check` | Verifies `brand/` against the contract and type-checks |
| `npm run copy-brief` | Writes `COPY-BRIEF.md`, a readable copy of everything the drafter is told |
| `node --env-file=.env scripts/reclassify.ts <pillar>` | Re-decides a pillar after its description changed |
| `node --env-file=.env scripts/seed-quote-roster.ts` | Seeds the quote roster from `brand/quoteRoster.ts` |
| `node --env-file=.env scripts/ingest-articles.ts "kind:/path"` | Seeds the article shelf from blog PDFs |

The full operator's reference, carried over from the original deployment, is
in [docs/OPERATIONS.md](docs/OPERATIONS.md).

## Layout

```
app/            Next.js routes and components
lib/            the engine and the source modules
lib/brand/      the contract (types) and helpers the engine reads the brand through
brand/          your configuration (starter values shipped)
examples/eco/   the original brand's complete configuration
db/schema.sql   the schema, idempotent
scripts/        seeds, backfills, checks; run directly with node
docs/           operator's reference and design notes
.claude/skills/setup   the Claude Code setup interview
```

## Status and origin

Extracted from a tracker that ran in production for one company for several
months. The extraction was checked by swapping that company's configuration
back in and confirming the engine behaves identically, and the setup skill was
shaken out by four blind dry runs on a fictional brand. No second brand has
run it in production yet; if you are the first, open an issue with what you
hit.

One naming artefact remains: the database column for integrated platforms is
called `chains`, because the original brand's were blockchains. The UI and
prompts call them whatever your identity file says.

## Contributing and licence

See [CONTRIBUTING.md](CONTRIBUTING.md). MIT, see `LICENSE`.
