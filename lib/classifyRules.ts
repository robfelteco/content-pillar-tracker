import { BRAND_PRODUCT_TERMS, type Template } from "./taxonomy.ts";
import { BRAND } from "../brand/identity.ts";
import { BRAND_NAME_RE, isOwnDomain, isOwnHandle } from "./brand/helpers.ts";

// Stage-1 deterministic classification. Cheap, runs before any Claude call.
// A rule only SETTLES a post when the signal is unambiguous (high confidence);
// otherwise it returns template=null with a narrowed candidate set for Stage 2.

export interface RuleInput {
  text: string;
  domains: string[];
  mentions: string[];
  urls: string[]; // expanded/resolved outbound URLs (lowercased), for path-aware rules
  media_type: string; // video | photo | animated_gif | link-card | text
  is_reply: boolean;
  is_self_reply: boolean;
  is_quote: boolean;
}

export interface RuleResult {
  template: Template | null; // null → hand to Stage 2 (Claude)
  confidence: number;
  reasoning: string;
  candidates: Template[]; // narrowed set for Stage 2 (all templates if unknown)
}

// Links that aren't "external articles": X itself + link shorteners we can't resolve.
const NON_ARTICLE_DOMAINS = new Set(["x.com", "twitter.com", "t.co"]);

// Does the text/domains reference the company or one of its products? The name
// is matched as a whole word (so "eco" never matches "economy"). Product terms,
// own domains, and own @handles (in the text or the mentions list) also count.
export function mentionsBrand(input: RuleInput): boolean {
  const t = input.text.toLowerCase();
  if (BRAND_NAME_RE.test(t)) return true;
  if (BRAND_PRODUCT_TERMS.some((term) => t.includes(term))) return true;
  if (input.domains.some((d) => isOwnDomain(d))) return true;
  if (input.mentions.some((m) => isOwnHandle(m))) return true;
  if (BRAND.ownHandles.some((h) => t.includes(`@${h.toLowerCase()}`))) return true;
  return false;
}

function externalArticleDomains(domains: string[]): string[] {
  return domains.filter((d) => d && !isOwnDomain(d) && !NON_ARTICLE_DOMAINS.has(d));
}

// URL-path → template. The CMO's "the URL is in the post, so you know the category"
// lever. Only PATTERNS that map to exactly one template regardless of anything
// else in the post live here — verified against the corpus. (External media
// domains are deliberately NOT listed: the same outlet shows up as both
// thought_leadership and broad_educational, so a domain-level settle would
// misfire; those stay with the generic external-link rule below.) A substring
// match against any expanded outbound URL. The list lives in brand/identity.ts.
interface UrlRule {
  match: string; // lowercased substring to find in an outbound URL
  template: Template;
  confidence: number;
  reason: string;
}
const URL_TEMPLATE_RULES: UrlRule[] = BRAND.urlRules.map((r) => ({
  match: r.match.toLowerCase(),
  template: r.pillar,
  confidence: r.confidence,
  reason: r.reason,
}));

function matchUrlTemplate(urls: string[]): UrlRule | null {
  for (const u of urls) {
    const lc = u.toLowerCase();
    for (const rule of URL_TEMPLATE_RULES) if (lc.includes(rule.match)) return rule;
  }
  return null;
}

// Media-type narrowing (from the spec's disambiguation rules).
function candidatesForMedia(media: string): Template[] {
  if (media === "video" || media === "animated_gif")
    return ["data_motion_visual", "product_post", "short_form_video_eco"];
  if (media === "photo") return ["quote_card", "integration_announcement", "product_post"];
  if (media === "link-card") return ["integration_announcement", "product_post", "thought_leadership", "dev_doc_post"];
  return ["thought_leadership", "product_post", "broad_educational"]; // plain text
}

export function classifyByRules(input: RuleInput): RuleResult {
  const domains = input.domains || [];
  const ecoBlog = domains.includes(BRAND.blogDomain);
  const external = externalArticleDomains(domains);
  const eco = mentionsBrand(input);

  // R1 — known Eco URL pattern (path-aware) → its template. Covers docs.eco.com
  // AND eco.com/docs/* (a path the old domain-only check missed).
  const urlRule = matchUrlTemplate(input.urls || []);
  if (urlRule) {
    return {
      template: urlRule.template,
      confidence: urlRule.confidence,
      reasoning: urlRule.reason,
      candidates: [urlRule.template],
    };
  }

  // R2 — a STANDALONE post (not a reply) that links out to an external, non-Eco
  // domain AND never mentions Eco/product → broad_educational. Replies are
  // excluded: they're usually source-drops/CTAs on Eco's own threads, not
  // standalone market content, so we leave them for Stage 2. Video/GIF posts
  // are excluded too: a data motion visual cites its source link (ousd.fyi,
  // Dune, Artemis) and often never names Eco, so the link says nothing about
  // the pillar — the media does, and only Stage 2 looks at it.
  const motion = input.media_type === "video" || input.media_type === "animated_gif";
  if (external.length > 0 && !eco && !input.is_reply && !motion) {
    return {
      template: "broad_educational",
      confidence: 0.9,
      reasoning: `Standalone external link (${external[0]}) with no ${BRAND.name}/product mention.`,
      candidates: ["broad_educational"],
    };
  }

  // From here the rules only NARROW — Stage 2 decides. Build a candidate set.
  const candidates = new Set<Template>(candidatesForMedia(input.media_type));

  // eco.com/blog + a partner @-mention → integration vs product (Stage 2 picks).
  if (ecoBlog && input.mentions.some((m) => !isOwnHandle(m))) {
    candidates.add("integration_announcement");
    candidates.add("product_post");
  }

  // No media, no link, longer prose → likely thought_leadership (still Stage 2).
  // (Any docs link already returned via the URL rule above.)
  if (input.media_type === "text" && external.length === 0 && !ecoBlog && input.text.length > 240) {
    candidates.add("thought_leadership");
  }

  // Always allow 'other' as an escape hatch at Stage 2.
  candidates.add("other");

  const reasonBits: string[] = [`media=${input.media_type}`];
  if (eco) reasonBits.push(`mentions ${BRAND.name}/product`);
  if (external.length) reasonBits.push(`ext=${external[0]}`);
  if (input.is_self_reply) reasonBits.push("self-reply");
  if (input.is_quote) reasonBits.push("quote");

  return {
    template: null, // unsettled → Stage 2
    confidence: 0,
    reasoning: `Rules narrowed only (${reasonBits.join(", ")}).`,
    candidates: [...candidates],
  };
}
