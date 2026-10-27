# Open-source plan

Working copy of `eco-x-tracker` (snapshot 2026-10-26, commit 9b65c51), with no
git history, no `.vercel` link and no `.env`. The Eco deployment is untouched
and keeps running from the private repo. This folder becomes the public
template.

## Pre-flight findings

- No secrets were ever committed to the original repo (history scanned for
  env files and key-shaped strings: none).
- `auth.ts` already reads `AUTH_ALLOWED_DOMAIN` with an `eco.com` fallback.
  Change the fallback to required.
- `COPY-BRIEF.md` is the brand-layer map: it lists every module the copy
  drafter reads. Those modules are what moves into `brand/`.
- `fonts/Roobert.otf` is a commercially licensed brand font. Cannot ship.
- `public/eco-logo-white.svg` and `db/dropbox-shorts-manifest.json` are
  Eco-only. Drop.

## File classification

### Brand knowledge → `brand/` (plain markdown/JSON the adopter edits)

| Module | Becomes |
| --- | --- |
| `lib/positioning.ts` | `brand/positioning.md` |
| `lib/taxonomy.ts` + `lib/pillarShapes.ts` | `brand/pillars.json` (ids, labels, stale days, draft mode, ratio bucket, shape rules) |
| `lib/icp.ts` | `brand/audiences.md` |
| `lib/products.ts` | `brand/products.json` |
| `lib/antiSlop.ts` + `ANTI-SLOP.md` | `brand/voice-rules.md` (generic standard ships as default; brand additions optional) |
| `lib/analogs.ts`, `lib/analogSources.ts`, `lib/curriculum.ts` | `brand/curriculum/` (optional module) |
| `lib/channels.ts`, `lib/quoteRoster.ts`, `lib/channelSources.ts` | `brand/watch-sources.json` (optional module) |
| `lib/integratedChains.ts`, `lib/chainAccounts.ts`, `lib/dmvLanes.ts` | `brand/entities.json` (generic "tracked entities", Eco's are chains) |
| `lib/angleBank.ts`, `lib/questions.ts` | `brand/angles.md` |
| `lib/classifyRules.ts` | rules live in `brand/pillars.json` per pillar |
| `db/schema.sql` `content_template` enum | generated from `brand/pillars.json` by the setup skill |

### Generic core (stays, de-Eco the comments)

ingest, twitter client, snapshots, stats, classify (rule + Claude), review
queue, dashboard pages, prioritize scoring, mark-as-used + attribution,
generateCopy (reads brand/ instead of importing modules), recency, trend,
format, db, auth, proxy, cron routes.

### Optional modules (gated on their env key being present)

- Quote discovery lanes (Gemini, YouTube Data API)
- Web lane (Firecrawl)
- Broad-educational discover lane (xAI)
- Video shelf (YouTube; Dropbox manifest path removed)
- Docs shelf (`lib/docs.ts`, `lib/docsTag.ts`): generic "sitemap of your docs"

Minimum keys to run: `DATABASE_URL`, X OAuth 1.0a, `ANTHROPIC_API_KEY`,
Google OAuth, `AUTH_SECRET`, `CRON_SECRET`.

### Scrub list (internal references)

Names and internal decision notes appear in ~55 files; heaviest in
`db/schema.sql`, `lib/positioning.ts`, `COPY-BRIEF.md`, `lib/classifyRules.ts`,
`lib/generateCopy.ts`, `lib/antiSlop.ts`, `docs/BROAD-ED-REDESIGN.md`. Keep the
reasoning, remove the names and the dated internal references. `COPY-BRIEF.md`
and `docs/BROAD-ED-REDESIGN.md` are regenerated or dropped, not scrubbed.

## Phases

0. Pillars are brand-defined, 2026-10-27: the core keys on each pillar's
   declared source (`draftMode`), media and traits, never its id; the
   `content_template` enum became text (`scripts/migrate-template-text.sql`
   converts an older database); the starter ships a generic set of four
   plus `other`, the Eco example keeps its nine.

1. Sign-off from Eco on what ships (positioning distillation, anti-slop
   standard, pillar taxonomy as the example). PENDING.
2. Scrub pass. DONE 2026-10-26.
3. Extract `brand/`. DONE 2026-10-26 for identity, pillars and shapes,
   positioning, audiences, products and voice: typed TypeScript data in
   `brand/` (neutral starter) and `examples/eco/` (the real one), contract in
   `lib/brand/types.ts`, `scripts/brand-check.ts` for the enum. Registries
   extracted 2026-10-26 as well: `brand/entities.ts` (chains with vocabulary,
   momentum account and live-without-article; partners with in-production;
   dmv lanes), `brand/curriculum.ts`, `brand/channels.ts`,
   `brand/quoteRoster.ts`. The angle bank is database rows and needs no
   registry. Not extracted: the colour tokens, and the word "chain" in the
   schema, lane code and UI.
4. Module gating by env key. Smoke test with only the minimum keys against a
   fresh Neon database.
5. Claude Code setup skill (`/setup`): interviews the adopter, writes
   `brand/`, generates the enum migration.
6. MIT license, publish, flip public.
7. Later: channel adapter interface (X first, LinkedIn stub).

## Publishing

Repo: `content-pillar-tracker`. Created private under the publishing account
until phase 6, then flipped public. Transfer to an org later is lossless on
GitHub (redirects preserved), so the account choice is not permanent.
