// Verify brand/ against the contract and the database. Run: node scripts/brand-check.ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PILLAR_IDS, PILLAR_DEFS, PILLAR_SHAPES } from "../brand/pillars.ts";
import { BRAND } from "../brand/identity.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(__dirname, "..", "db", "schema.sql"), "utf8");
if (/CREATE TYPE content_template/.test(schema)) {
  console.error("db/schema.sql still declares the content_template enum; pillar ids are text now");
  process.exit(1);
}

let problems = 0;
const brandIds = new Set<string>(PILLAR_IDS);
for (const id of PILLAR_IDS) {
  if (!PILLAR_DEFS.some((d) => d.id === id)) { console.error(`PILLAR_DEFS has no entry for "${id}"`); problems++; }
  if (!(id in PILLAR_SHAPES)) { console.error(`PILLAR_SHAPES has no entry for "${id}"`); problems++; }
}
if (!brandIds.has("other")) { console.error(`PILLAR_IDS must include "other": the review queue routes to it`); problems++; }
for (const r of BRAND.urlRules) {
  if (!brandIds.has(r.pillar)) { console.error(`urlRules points at unknown pillar "${r.pillar}"`); problems++; }
}

for (const id of PILLAR_IDS) if (!/^[a-z][a-z0-9_]*$/.test(id)) { console.error(`pillar id "${id}" must be snake_case`); problems++; }
for (const d of PILLAR_DEFS) {
  if (d.id !== "other" && d.draftMode !== "generic" && !d.media?.length) console.log(`note: pillar "${d.id}" lists no media, so the rule classifier never proposes it; the model still can`);
}
if (!problems) {
  console.log(`brand ok: ${PILLAR_IDS.length} pillars, ${BRAND.name} (@${BRAND.handle})`);
}
process.exitCode = problems ? 1 : 0;

// Audience invariants the types cannot express: every persona appears in
// exactly one site audience, every listed persona exists, and the lists are
// in the range the prompts were written for.
import { ICP_DEFS, SITE_AUDIENCES } from "../brand/audiences.ts";
{
  let audienceProblems = 0;
  const icpIds = new Set(ICP_DEFS.map((i) => i.id));
  const seen = new Map<string, number>();
  for (const a of SITE_AUDIENCES) {
    for (const id of a.icps) {
      if (!icpIds.has(id)) { console.error(`SITE_AUDIENCES "${a.id}" lists unknown persona "${id}"`); audienceProblems++; }
      seen.set(id, (seen.get(id) ?? 0) + 1);
    }
  }
  for (const id of icpIds) {
    const n = seen.get(id) ?? 0;
    if (n !== 1) { console.error(`persona "${id}" appears in ${n} site audiences; it must appear in exactly one`); audienceProblems++; }
  }
  if (ICP_DEFS.length < 2 || ICP_DEFS.length > 9) { console.error(`ICP_DEFS has ${ICP_DEFS.length} personas; expected 2 to 9`); audienceProblems++; }
  if (SITE_AUDIENCES.length < 2 || SITE_AUDIENCES.length > 6) { console.error(`SITE_AUDIENCES has ${SITE_AUDIENCES.length} audiences; expected 2 to 6`); audienceProblems++; }
  if (audienceProblems) process.exitCode = 1;
  else console.log(`audiences ok: ${ICP_DEFS.length} personas in ${SITE_AUDIENCES.length} site audiences`);
}

// Registry invariants for the optional lanes.
import { CHAINS, PARTNERS } from "../brand/entities.ts";
import { ANALOG_DEFS, EDUCATION_SHAPES } from "../brand/curriculum.ts";
import { CHANNEL_DEFS } from "../brand/channels.ts";
import { ORG_SEED, PEOPLE_SEED, WATCH_SEED } from "../brand/quoteRoster.ts";
{
  let p = 0;
  const dup = (label: string, xs: string[]) => {
    const seen = new Set<string>();
    for (const x of xs) { if (seen.has(x)) { console.error(`${label}: duplicate "${x}"`); p++; } seen.add(x); }
  };
  dup("CHAINS id", CHAINS.map((c) => c.id));
  dup("CHAINS handle", CHAINS.flatMap((c) => c.handles.map((h) => h.toLowerCase())));
  dup("PARTNERS id", PARTNERS.map((x) => x.id));
  dup("PARTNERS handle", PARTNERS.flatMap((x) => x.handles.map((h) => h.toLowerCase())));
  for (const c of CHAINS) if (!c.handles.length) { console.error(`CHAINS "${c.id}" has no handles; it can never be detected`); p++; }
  const lowerNoAt = (label: string, id: string, hs: string[]) => {
    for (const h of hs) if (h.startsWith("@") || h !== h.toLowerCase()) { console.error(`${label} "${id}": "${h}" must be lowercase with no @`); p++; }
  };
  for (const c of CHAINS) { lowerNoAt("CHAINS handle", c.id, [...c.handles, ...(c.momentumHandle ? [c.momentumHandle] : [])]); lowerNoAt("CHAINS keyword", c.id, c.keywords ?? []); }
  for (const x of PARTNERS) { lowerNoAt("PARTNERS handle", x.id, x.handles); lowerNoAt("PARTNERS domain", x.id, x.domains ?? []); }
  for (const c of CHAINS) if (c.liveWithoutArticle && c.announcedNotLive) { console.error(`CHAINS "${c.id}": cannot be both liveWithoutArticle and announcedNotLive`); p++; }
  for (const d of PILLAR_DEFS) if (d.staleDays >= 9999 && d.id !== "other" && d.draftMode !== "generic") { console.error(`parked pillar "${d.id}" (staleDays ${d.staleDays}) should have draftMode "generic", not "${d.draftMode}"`); p++; }
  dup("ANALOG_DEFS id", ANALOG_DEFS.map((a) => a.id));
  dup("EDUCATION_SHAPES id", EDUCATION_SHAPES.map((s) => s.id));
  const icpIds2 = new Set(ICP_DEFS.map((i) => i.id));
  for (const a of ANALOG_DEFS) {
    if (!a.vocab.length) { console.error(`ANALOG_DEFS "${a.id}" has no vocab; it can never be detected`); p++; }
    if (!a.breaksWhere.trim()) { console.error(`ANALOG_DEFS "${a.id}" has an empty breaksWhere`); p++; }
    for (const i of a.icps) if (!icpIds2.has(i)) { console.error(`ANALOG_DEFS "${a.id}" names unknown persona "${i}"`); p++; }
  }
  dup("CHANNEL_DEFS id", CHANNEL_DEFS.map((c) => c.id));
  for (const c of CHANNEL_DEFS) if (!/^UC[\w-]{20,}$/.test(c.id)) { console.error(`CHANNEL_DEFS "${c.label}": id must be a YouTube channelId (UC…), not a handle`); p++; }
  dup("ORG_SEED name", ORG_SEED.map((o) => o.name));
  const orgNames = new Set(ORG_SEED.map((o) => o.name));
  for (const person of PEOPLE_SEED) if (!orgNames.has(person.org)) { console.error(`PEOPLE_SEED "${person.name}": org "${person.org}" is not in ORG_SEED`); p++; }
  const kinds = new Set(["yt_channel", "report_site", "x_search"]);
  for (const w of WATCH_SEED) if (!kinds.has(w.kind)) { console.error(`WATCH_SEED "${w.label}": unknown kind "${w.kind}"`); p++; }
  for (const c of CHANNEL_DEFS) if (!WATCH_SEED.some((w) => w.identifier === c.id)) console.log(`note: channel "${c.label}" is not in WATCH_SEED, so the quote lane will not share its transcripts`);
  if (p) process.exitCode = 1;
  else console.log(`registries ok: ${CHAINS.length} chains (${CHAINS.filter((c) => c.momentumHandle && c.momentumEnabled).length} read daily, ${CHAINS.filter((c) => c.momentumHandle && !c.momentumEnabled).length} on demand, ${CHAINS.filter((c) => c.announcedNotLive).length} announced not live), ${PARTNERS.length} partners (${PARTNERS.filter((x) => x.inProduction).length} in production), ${ANALOG_DEFS.length} curriculum concepts, ${CHANNEL_DEFS.length} channels, ${ORG_SEED.length} orgs / ${PEOPLE_SEED.length} people / ${WATCH_SEED.length} watch sources`);
}
