import { BRAND } from "../brand/identity.ts";
import { ANALOG_DEFS } from "../brand/curriculum.ts";
import { CHANNEL_DEFS } from "../brand/channels.ts";
import { pillarsByMode, platformLaneEnabled } from "./taxonomy.ts";

// Which lanes are on for this brand, and which environment keys each one
// needs. One definition, read by the cron routes (to skip work for a lane
// that is off) and by scripts/env-check.ts (to tell an adopter which keys to
// get). Kept free of db and SDK imports so the check script can load it with
// nothing configured.
//
// A lane is on when a pillar drafts from its source and the brand supplies
// what the source reads (a docs origin, a channel list). The engine core is
// always on.

export type LaneId = "core" | "docs" | "videos" | "platforms" | "education" | "curriculum" | "channels" | "quotes";

export interface LaneStatus {
  id: LaneId;
  label: string;
  on: boolean;
  /** Why it is on or off, in one line. */
  why: string;
  /** Set when a pillar uses the source but the brand file it needs is empty. */
  misconfigured?: string;
}

function pillarList(mode: Parameters<typeof pillarsByMode>[0]): string {
  return pillarsByMode(mode).join(", ");
}

export function laneStatuses(): LaneStatus[] {
  const docsPillars = pillarsByMode("docs").length > 0;
  const videoPillars = pillarsByMode("videos").length > 0;
  const eduPillars = pillarsByMode("education").length > 0;
  const quotePillars = pillarsByMode("quotes").length > 0;

  return [
    { id: "core", label: "Engine core", on: true, why: "always on: ingest, classification, scoring, drafting" },
    {
      id: "docs",
      label: "Developer docs shelf",
      on: docsPillars && !!BRAND.docsOrigin,
      why: docsPillars ? `pillar ${pillarList("docs")} drafts from docs` : "no pillar drafts from docs",
      misconfigured: docsPillars && !BRAND.docsOrigin ? "a pillar drafts from docs but brand/identity.ts docsOrigin is empty" : undefined,
    },
    {
      id: "videos",
      label: "Short-form video shelf",
      on: videoPillars && !!BRAND.youtubeHandle,
      why: videoPillars ? `pillar ${pillarList("videos")} drafts from videos` : "no pillar drafts from videos",
      misconfigured: videoPillars && !BRAND.youtubeHandle ? "a pillar drafts from videos but brand/identity.ts youtubeHandle is empty" : undefined,
    },
    {
      id: "platforms",
      label: "Integrated platforms and momentum",
      on: platformLaneEnabled(),
      why: platformLaneEnabled()
        ? `pillar ${[...pillarsByMode("chains"), ...pillarsByMode("dmv")].join(", ")} drafts from platforms or data visuals`
        : "no pillar drafts from chains or dmv",
    },
    {
      id: "education",
      label: "Educational pipeline (intake and discovery)",
      on: eduPillars,
      why: eduPillars ? `pillar ${pillarList("education")} drafts from education` : "no pillar drafts from education",
    },
    {
      id: "curriculum",
      label: "Curriculum source sweep",
      on: eduPillars && ANALOG_DEFS.length > 0,
      why: !eduPillars ? "education lane is off" : ANALOG_DEFS.length ? `${ANALOG_DEFS.length} concept${ANALOG_DEFS.length === 1 ? "" : "s"} in brand/curriculum.ts` : "brand/curriculum.ts is empty",
    },
    {
      id: "channels",
      label: "Watched YouTube channels",
      on: eduPillars && CHANNEL_DEFS.length > 0,
      why: !eduPillars ? "education lane is off" : CHANNEL_DEFS.length ? `${CHANNEL_DEFS.length} channel${CHANNEL_DEFS.length === 1 ? "" : "s"} in brand/channels.ts` : "brand/channels.ts is empty",
    },
    {
      id: "quotes",
      label: "Quote discovery",
      on: quotePillars,
      why: quotePillars ? `pillar ${pillarList("quotes")} drafts from quotes` : "no pillar drafts from quotes",
    },
  ];
}

export function laneOn(id: LaneId): boolean {
  return laneStatuses().find((l) => l.id === id)?.on ?? false;
}

// ---------------------------------------------------------------------------
// Keys
// ---------------------------------------------------------------------------

/**
 * "required": the lane fails without it. "partial": the lane runs, but the
 * named part of it is skipped. "optional": a default applies.
 */
export type KeyLevel = "required" | "partial" | "optional";

export interface KeyNeed {
  lane: LaneId;
  level: KeyLevel;
  /** What this lane uses the key for. */
  does: string;
}

export interface KeyDef {
  key: string;
  /** Where to get it, in one line. */
  where: string;
  /** How it is billed, qualitatively. */
  cost: string;
  needs: KeyNeed[];
  /** Keys that come from the same place are reported together under this label. */
  group?: string;
  /** Another key that can stand in for this one, and what is lost. */
  alternative?: { key: string; loses: string };
}

const X_WHERE = "developer.x.com: a project app with OAuth 1.0a user context for the account you track";

export const KEY_DEFS: KeyDef[] = [
  {
    key: "DATABASE_URL",
    where: "Any Postgres. On Neon (console.neon.tech) use the pooled connection string",
    cost: "Neon's free tier covers one account",
    needs: [{ lane: "core", level: "required", does: "stores posts, daily metric snapshots, labels and every shelf" }],
  },
  ...["TWITTER_CONSUMER_KEY", "TWITTER_CONSUMER_SECRET", "TWITTER_ACCESS_TOKEN", "TWITTER_ACCESS_TOKEN_SECRET"].map(
    (key): KeyDef => ({
      key,
      group: "X API keys (OAuth 1.0a user context)",
      where: X_WHERE,
      cost: "pay per read; a backfill is a few dollars, the daily sync a few dollars a month",
      needs: [
        { lane: "core", level: "required", does: "reads your posts and their impressions every night" },
        { lane: "platforms", level: "required", does: "reads each watched platform's own account for momentum" },
        { lane: "quotes", level: "partial", does: "runs the X search lane for quotes and roster suggestions" },
      ],
      alternative: { key: "TWITTER_BEARER_TOKEN", loses: "app-only auth reads public metrics only, so impressions are missing" },
    }),
  ),
  {
    key: "X_ACCOUNT_HANDLE",
    where: "the handle you track, no @",
    cost: "free",
    needs: [{ lane: "core", level: "optional", does: "overrides brand/identity.ts handle for this deployment" }],
  },
  {
    key: "ANTHROPIC_API_KEY",
    where: "console.anthropic.com, API keys",
    cost: "pay per token; Claude runs only on posts the rules cannot decide and on drafts you ask for",
    needs: [
      { lane: "core", level: "required", does: "classifies posts the rules cannot settle, matches articles, drafts copy on a deployed server" },
      { lane: "docs", level: "required", does: "tags each docs page with an audience and postability tier" },
      { lane: "videos", level: "required", does: "tags clips and matches them to the posts that used them" },
      { lane: "education", level: "required", does: "frames each intake candidate" },
      { lane: "curriculum", level: "required", does: "grades swept sources" },
      { lane: "channels", level: "required", does: "triages channel videos and extracts claims" },
    ],
  },
  {
    key: "AUTH_GOOGLE_ID",
    where: "console.cloud.google.com, APIs and services, Credentials: an OAuth client ID for a web application",
    cost: "free",
    needs: [{ lane: "core", level: "required", does: "Google sign-in" }],
  },
  {
    key: "AUTH_GOOGLE_SECRET",
    where: "the same OAuth client in Google Cloud",
    cost: "free",
    needs: [{ lane: "core", level: "required", does: "Google sign-in" }],
  },
  {
    key: "AUTH_SECRET",
    where: "generate it: openssl rand -base64 32",
    cost: "free",
    needs: [{ lane: "core", level: "required", does: "signs sessions" }],
  },
  {
    key: "AUTH_ALLOWED_DOMAIN",
    where: "your Google Workspace domain, e.g. yourcompany.com",
    cost: "free",
    needs: [{ lane: "core", level: "required", does: "limits sign-in to your workspace; the app refuses to start without it" }],
  },
  {
    key: "CRON_SECRET",
    where: "generate it: openssl rand -hex 32",
    cost: "free",
    needs: [{ lane: "core", level: "required", does: "guards the nightly sync and sweep routes" }],
  },
  {
    key: "NEXT_PUBLIC_BRAND_NAME",
    where: "any display name",
    cost: "free",
    needs: [{ lane: "core", level: "optional", does: "overrides the header title, which defaults to brand/identity.ts name" }],
  },
  {
    key: "YOUTUBE_API_KEY",
    where: "console.cloud.google.com: enable YouTube Data API v3, then create an API key",
    cost: "free daily quota; listing uploads costs a few units a channel",
    needs: [
      { lane: "videos", level: "required", does: "lists your channel's uploads every night" },
      { lane: "channels", level: "required", does: "lists each watched channel's new videos" },
      { lane: "quotes", level: "partial", does: "lists watched YouTube channels for the quote lane" },
      { lane: "curriculum", level: "partial", does: "finds talks for a concept during the source sweep" },
    ],
  },
  {
    key: "GEMINI_API_KEY",
    where: "aistudio.google.com, Get API key",
    cost: "pay per token; reading video needs a paid tier",
    needs: [
      { lane: "quotes", level: "required", does: "extracts verbatim quotes from every source, and transcribes video" },
      { lane: "channels", level: "required", does: "transcribes watched-channel episodes" },
    ],
  },
  {
    key: "FIRECRAWL_API_KEY",
    where: "firecrawl.dev, dashboard, API keys",
    cost: "credit-based, per page scraped",
    needs: [
      { lane: "education", level: "required", does: "scrapes the nightly intake candidates so drafts have the text" },
      { lane: "curriculum", level: "required", does: "scrapes institutional hubs for each concept" },
      { lane: "quotes", level: "partial", does: "scrapes report sites for the web quote lane" },
    ],
  },
  {
    key: "XAI_API_KEY",
    where: "console.x.ai, API keys",
    cost: "pay per token",
    needs: [
      { lane: "education", level: "partial", does: "runs the discovery lenses (web and X search for new ideas)" },
      { lane: "curriculum", level: "partial", does: "finds new sources for a concept and mines audience questions" },
    ],
  },
];

export interface KeyCheck {
  key: string;
  def: KeyDef;
  /** The needs that apply because their lane is on. */
  active: KeyNeed[];
  level: KeyLevel | null;
  present: boolean;
  /** Where the value came from, never the value. */
  from: ".env" | "environment" | null;
  alternativePresent: boolean;
}

const LEVEL_RANK: Record<KeyLevel, number> = { required: 0, partial: 1, optional: 2 };

/** A value counts as set when it is non-empty and is not a template placeholder. */
export function isSet(v: string | undefined): boolean {
  if (v == null) return false;
  const t = v.trim();
  return t.length > 0 && !t.startsWith("<");
}

/**
 * Check the keys against the lanes that are on. `fileEnv` is what .env holds,
 * `procEnv` the process environment; only presence is ever reported.
 */
export function checkKeys(fileEnv: Record<string, string>, procEnv: Record<string, string | undefined>): KeyCheck[] {
  const on = new Set(laneStatuses().filter((l) => l.on).map((l) => l.id));
  const out: KeyCheck[] = [];
  for (const def of KEY_DEFS) {
    const active = def.needs.filter((n) => on.has(n.lane));
    if (!active.length) continue;
    const level = active.map((n) => n.level).sort((a, b) => LEVEL_RANK[a] - LEVEL_RANK[b])[0];
    const inFile = isSet(fileEnv[def.key]);
    const inProc = isSet(procEnv[def.key]);
    const alt = def.alternative?.key;
    out.push({
      key: def.key,
      def,
      active,
      level,
      present: inFile || inProc,
      from: inFile ? ".env" : inProc ? "environment" : null,
      alternativePresent: !!alt && (isSet(fileEnv[alt]) || isSet(procEnv[alt])),
    });
  }
  return out;
}
