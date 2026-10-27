import { BRAND } from "../../brand/identity.ts";

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-word match for the company name, lowercased. "eco" never matches "economy". */
export const BRAND_NAME_RE = new RegExp(`\\b${escapeRe(BRAND.name.toLowerCase())}\\b`);

const OWN_HANDLES = new Set(BRAND.ownHandles.map((h) => h.toLowerCase()));
const OWN_DOMAINS = new Set(BRAND.domains.map((d) => d.toLowerCase()));

export function isOwnHandle(handle: string | null | undefined): boolean {
  return !!handle && OWN_HANDLES.has(handle.toLowerCase().replace(/^@/, ""));
}

export function isOwnDomain(domain: string | null | undefined): boolean {
  return !!domain && OWN_DOMAINS.has(domain.toLowerCase());
}

/** The handle the tracker ingests. Env wins so one build serves any account. */
export function trackedHandle(): string {
  return process.env.X_ACCOUNT_HANDLE || BRAND.handle;
}

const noun = BRAND.platformNoun ?? { singular: "platform", plural: "platforms" };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The platform noun in four forms: one, many, One, Many. */
export const PLATFORM = { one: noun.singular, many: noun.plural, One: cap(noun.singular), Many: cap(noun.plural) };
