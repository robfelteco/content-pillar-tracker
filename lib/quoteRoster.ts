import { sql } from "./db.ts";
import { ORG_SEED, PEOPLE_SEED, WATCH_SEED } from "../brand/quoteRoster.ts";
import type { OrgSeed, PersonSeed, WatchSeed } from "./brand/types.ts";

// The roster — the credibility filter for quote discovery.
//
// Per the spec (§4, §12 step 1): "hand-seed 40-60 people across the three org
// tiers before writing any fetch code. The pipeline is only as good as this
// table." Everything downstream — scoring, the read budget, who is even
// eligible to produce a candidate — keys off these two tables.
//
// The seeds live in brand/quoteRoster.ts. Titles
// drift, so nothing here is treated as verified: `handles_verified_at` stays
// null until an operator confirms it in the UI, and the review card shows an
// unverified badge. Verify before a card ships.

export type { OrgSeed, PersonSeed, WatchSeed };
export { ORG_SEED, PEOPLE_SEED, WATCH_SEED };

// --- Reads -----------------------------------------------------------------

export interface RosterPerson {
  id: number;
  fullName: string;
  title: string;
  seniority: number;
  xHandle: string | null;
  xAuthorId: string | null;
  xSinceId: string | null;
  ytChannel: string | null;
  orgId: number | null;
  orgName: string | null;
  orgTier: number | null;
  isCompetitor: boolean;
  handlesVerifiedAt: string | null;
}

export async function getRoster(onlyWithX = false): Promise<RosterPerson[]> {
  return sql<RosterPerson>`
    SELECT p.id, p.full_name AS "fullName", p.title, p.seniority,
           p.x_handle AS "xHandle", p.x_author_id AS "xAuthorId", p.x_since_id AS "xSinceId",
           p.yt_channel AS "ytChannel",
           p.org_id AS "orgId", o.name AS "orgName", o.org_tier AS "orgTier",
           COALESCE(o.is_competitor, false) AS "isCompetitor",
           p.handles_verified_at AS "handlesVerifiedAt"
    FROM people p
    LEFT JOIN orgs o ON o.id = p.org_id
    WHERE p.active = true
      AND (${!onlyWithX} OR p.x_handle IS NOT NULL)
    ORDER BY o.org_tier NULLS LAST, p.seniority, p.full_name
  `;
}

export async function getWatchSources(kind?: string) {
  return sql<{ id: number; kind: string; identifier: string; label: string; lastRunAt: string | null }>`
    SELECT id, kind, identifier, label, last_run_at AS "lastRunAt"
    FROM watch_sources
    WHERE active = true AND (${kind ?? null}::text IS NULL OR kind = ${kind ?? null})
    ORDER BY kind, label
  `;
}

export async function rosterCounts(): Promise<{ people: number; orgs: number; withX: number; suggestions: number }> {
  const rows = await sql<{ people: number; orgs: number; withX: number; suggestions: number }>`
    SELECT
      (SELECT COUNT(*)::int FROM people WHERE active) AS people,
      (SELECT COUNT(*)::int FROM orgs) AS orgs,
      (SELECT COUNT(*)::int FROM people WHERE active AND x_handle IS NOT NULL) AS "withX",
      (SELECT COUNT(*)::int FROM roster_suggestions WHERE status = 'new') AS suggestions
  `;
  return rows[0];
}
