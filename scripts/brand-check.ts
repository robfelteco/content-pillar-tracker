// Compare brand/pillars.ts to the content_template enum in db/schema.sql and
// print what has to change in the database. Run: node scripts/brand-check.ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PILLAR_IDS, PILLAR_DEFS, PILLAR_SHAPES } from "../brand/pillars.ts";
import { BRAND } from "../brand/identity.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(__dirname, "..", "db", "schema.sql"), "utf8");
const enumBlock = schema.match(/CREATE TYPE content_template AS ENUM \(([\s\S]*?)\);/);
if (!enumBlock) {
  console.error("content_template enum not found in db/schema.sql");
  process.exit(1);
}
const enumIds = [...enumBlock[1].matchAll(/'([a-z0-9_]+)'/g)].map((m) => m[1]);

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

const missingInDb = PILLAR_IDS.filter((id) => !enumIds.includes(id));
const extraInDb = enumIds.filter((id) => !brandIds.has(id));

if (missingInDb.length) {
  console.log("-- Pillars in brand/pillars.ts that the database enum lacks. Apply, then reclassify:");
  for (const id of missingInDb) console.log(`ALTER TYPE content_template ADD VALUE IF NOT EXISTS '${id}';`);
  console.log("-- Also add them to db/schema.sql so a fresh database matches.");
}
if (extraInDb.length) {
  console.log(`-- Enum values no pillar uses: ${extraInDb.join(", ")}. Postgres cannot drop enum values;`);
  console.log("-- reclassify those posts to a live pillar and leave the value in place.");
}
if (!missingInDb.length && !extraInDb.length && !problems) {
  console.log(`brand ok: ${PILLAR_IDS.length} pillars, enum matches, ${BRAND.name} (@${BRAND.handle})`);
}
process.exitCode = problems ? 1 : 0;
