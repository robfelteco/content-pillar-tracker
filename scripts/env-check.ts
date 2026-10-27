// Which lanes are on for this brand, which keys they need, and which of those
// are set. Reads .env and the process environment for PRESENCE only: no value,
// prefix, length or hash is ever printed.
//
//   node scripts/env-check.ts            report, always exits 0
//   node scripts/env-check.ts --strict   exit 1 if a lane that is on lacks a required key
//   node scripts/env-check.ts --file .env.production
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkKeys, laneStatuses, type KeyCheck } from "../lib/lanes.ts";
import { BRAND } from "../brand/identity.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const fileArg = args.indexOf("--file");
const envPath = fileArg >= 0 && args[fileArg + 1] ? args[fileArg + 1] : join(__dirname, "..", ".env");

// Minimal .env parser: KEY=VALUE, optional quotes, # comments. Values are held
// only long enough to test whether they are set.
function readEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, "");
    out[m[1]] = v;
  }
  return out;
}

const fileEnv = readEnvFile(envPath);
const hasFile = existsSync(envPath);
const lanes = laneStatuses();
const checks = checkKeys(fileEnv, process.env);

const pad = (s: string, n: number) => (s.length >= n ? s : s + " ".repeat(n - s.length));

console.log(`Lanes for ${BRAND.name} (@${BRAND.handle})`);
for (const l of lanes) {
  console.log(`  ${l.on ? "on " : "off"}  ${pad(l.label, 44)} ${l.why}`);
  if (l.misconfigured) console.log(`       ! ${l.misconfigured}`);
}

console.log("");
console.log(hasFile ? `Keys (checked ${envPath.replace(join(__dirname, ".."), ".")} and the environment; values are never shown)` : `Keys (no .env found at ${envPath}; checked the environment only. Copy .env.example to .env to start)`);

const byLane = new Map<string, KeyCheck[]>();
for (const c of checks) {
  const lane = c.active[0].lane;
  const list = byLane.get(lane) ?? [];
  list.push(c);
  byLane.set(lane, list);
}

let missingRequired = 0;
let missingPartial = 0;
for (const l of lanes.filter((x) => x.on)) {
  const list = byLane.get(l.id);
  if (!list?.length) continue;
  console.log(`  ${l.label}`);
  // Keys from the same source (the four X keys) are reported as one entry.
  const units: KeyCheck[][] = [];
  for (const c of list) {
    const last = units[units.length - 1];
    if (c.def.group && last && last[0].def.group === c.def.group) last.push(c);
    else units.push([c]);
  }
  for (const unit of units) {
    const c = unit[0];
    const present = unit.every((u) => u.present);
    const missingKeys = unit.filter((u) => !u.present).map((u) => u.key);
    const covered = !present && unit.every((u) => u.present || u.alternativePresent);
    const mark = present ? "set    " : covered ? "covered" : c.level === "required" ? "MISSING" : c.level === "partial" ? "missing" : "unset  ";
    const tag = c.level === "required" ? "required" : c.level === "partial" ? "partial " : "optional";
    const name = c.def.group ?? c.key;
    const froms = [...new Set(unit.map((u) => u.from).filter(Boolean))];
    console.log(`    ${mark}  ${pad(name, 40)} ${tag}  ${present ? `(${froms.join(", ")})` : ""}`);
    if (present) continue;
    if (c.def.group) console.log(`               missing: ${missingKeys.join(", ")}`);
    for (const n of c.active) console.log(`               ${n.lane}: ${n.does}${n.level === "partial" ? " (skipped without it)" : ""}`);
    if (c.level === "optional") continue;
    if (covered) console.log(`               covered by ${c.def.alternative!.key}, but ${c.def.alternative!.loses}`);
    console.log(`               get it: ${c.def.where}`);
    console.log(`               cost:   ${c.def.cost}`);
    if (!covered && c.level === "required") missingRequired++;
    if (!covered && c.level === "partial") missingPartial++;
  }
}

console.log("");
if (missingRequired) {
  console.log(`${missingRequired} required key${missingRequired === 1 ? " is" : "s are"} missing for lanes that are on. Put the values in .env yourself; never paste them into chat.`);
} else if (missingPartial) {
  console.log(`All required keys are set. ${missingPartial} partial key${missingPartial === 1 ? "" : "s"} missing: those parts of their lanes are skipped.`);
} else {
  console.log("All keys for the lanes that are on are set.");
}
console.log("A lane you do not want to pay for can be turned off by giving its pillar draftMode \"generic\" in brand/pillars.ts.");

process.exitCode = strict && missingRequired ? 1 : 0;
