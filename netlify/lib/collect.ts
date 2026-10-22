import { XMLParser } from "fast-xml-parser";
import { db } from "../../db/index.js";
import { articles, collectionRuns } from "../../db/schema.js";
import { DEFAULT_CONFIG } from "../../src/data/defaultData.js";
import type { Outlet } from "../../src/types.js";

const FALLBACK_OUTLET: Outlet = {
  id: "other",
  name: "Other Malaysian Media",
  type: "News agency / TV",
  language: "BM/EN",
};

// Extra parliament-specific terms checked alongside the configured keywords
const EXTRA_TERMS = [
  "pmqt",
  "ruu",
  "yang dipertua dewan",
  "speaker dewan",
  "dewan speaker",
  "jawatankuasa pilihan khas",
  "select committee",
  "public accounts committee",
  "jawatankuasa kira-kira wang awam",
  "pac",
  "mp",
  "mps",
  "senator",
  "senat",
  "bill tabled",
  "dibentang",
  "bacaan kali",
  "first reading",
  "second reading",
];

// Google News sometimes lists social posts; keep clippings to actual news outlets
const EXCLUDED_SOURCES = /^(facebook|youtube|instagram|tiktok|x|twitter|threads|reddit)$/i;

interface RawItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
  sourceName?: string;
  sourceUrl?: string;
}

interface CollectResult {
  found: number;
  inserted: number;
}

function buildMatcher(): RegExp {
  const terms = [...DEFAULT_CONFIG.keywords, ...EXTRA_TERMS]
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"));
  return new RegExp(`(^|[^\\p{L}\\p{N}])(${terms.join("|")})(?=$|[^\\p{L}\\p{N}])`, "iu");
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function hashId(base: string): string {
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return "art_" + Math.abs(hash).toString(16) + base.length.toString(16);
}

function textOf(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)["#text"]);
  }
  return "";
}

async function fetchFeed(url: string): Promise<RawItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ParlimenNewsMonitor/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.warn(`Feed ${url} returned ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const doc = parser.parse(xml);
    const rawItems = doc?.rss?.channel?.item ?? doc?.feed?.entry ?? [];
    const list = Array.isArray(rawItems) ? rawItems : [rawItems];

    return list
      .map((it: Record<string, any>): RawItem => {
        const link =
          typeof it.link === "object" && it.link?.["@_href"] ? it.link["@_href"] : textOf(it.link);
        return {
          title: stripHtml(textOf(it.title)),
          link: link.trim(),
          pubDate: textOf(it.pubDate || it.published || it.updated || it["dc:date"]),
          description: stripHtml(textOf(it.description || it.summary || it["content:encoded"])),
          sourceName: textOf(it.source),
          sourceUrl: it.source?.["@_url"],
        };
      })
      .filter((it) => it.title && it.link);
  } catch (err) {
    console.warn(`Failed to fetch feed ${url}:`, err);
    return [];
  }
}

function matchOutlet(item: RawItem, defaultOutlet?: Outlet): Outlet {
  const haystack = `${item.sourceUrl || ""} ${item.link}`.toLowerCase();
  const name = (item.sourceName || "").toLowerCase();
  const found = DEFAULT_CONFIG.outlets.find(
    (o) =>
      (o.domain && haystack.includes(o.domain)) ||
      (name && (name.includes(o.name.toLowerCase()) || o.name.toLowerCase().includes(name)))
  );
  if (found) return found;
  if (defaultOutlet) return defaultOutlet;
  return item.sourceName ? { ...FALLBACK_OUTLET, name: item.sourceName } : FALLBACK_OUTLET;
}

export async function collectParliamentNews(trigger = "schedule"): Promise<CollectResult> {
  const matcher = buildMatcher();
  const q = `${DEFAULT_CONFIG.google_news_query} when:${DEFAULT_CONFIG.google_news_window}`;
  const googleFeeds = [
    `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-MY&gl=MY&ceid=MY:en`,
    `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ms&gl=MY&ceid=MY:ms`,
  ];

  const jobs: Promise<{ items: RawItem[]; outlet?: Outlet; google: boolean }>[] = [
    ...googleFeeds.map(async (u) => ({ items: await fetchFeed(u), google: true })),
    ...DEFAULT_CONFIG.outlets.flatMap((o) =>
      (o.feeds || []).map(async (u) => ({ items: await fetchFeed(u), outlet: o, google: false }))
    ),
  ];
  const results = await Promise.all(jobs);

  const cutoff = Date.now() - 180 * 864e5;
  const rows = new Map<string, typeof articles.$inferInsert>();
  const seenTitles = new Set<string>();

  for (const { items, outlet: feedOutlet, google } of results) {
    for (const item of items) {
      if (item.sourceName && EXCLUDED_SOURCES.test(item.sourceName.trim())) continue;
      let title = item.title;
      if (google) {
        // Google News appends " - Publisher" to every headline
        const suffix = item.sourceName ? ` - ${item.sourceName}` : "";
        if (suffix && title.endsWith(suffix)) title = title.slice(0, -suffix.length).trim();
        else title = title.replace(/\s+-\s+[^-]{2,60}$/, "").trim();
      }

      // Google descriptions just repeat the headline, so only use them for direct feeds
      const snippet = google ? "" : item.description || "";
      if (!matcher.test(`${title} ${snippet}`)) continue;

      const published = item.pubDate ? new Date(item.pubDate) : new Date();
      if (isNaN(published.getTime()) || published.getTime() < cutoff) continue;

      const outlet = matchOutlet(item, feedOutlet);
      const titleKey = title.toLowerCase().replace(/\s+/g, " ").trim();
      const dedupeKey = `${outlet.id}:${titleKey}`;
      if (seenTitles.has(dedupeKey)) continue;
      seenTitles.add(dedupeKey);

      const id = hashId(item.link.split("?")[0] || titleKey);
      rows.set(id, {
        id,
        title,
        titleKey,
        url: item.link,
        snippet: snippet.slice(0, 220) + (snippet.length > 220 ? "…" : ""),
        sourceId: outlet.id,
        source: outlet.name,
        type: outlet.type,
        language: outlet.language,
        published,
      });
    }
  }

  const values = Array.from(rows.values());
  let inserted = 0;
  for (let i = 0; i < values.length; i += 100) {
    const res = await db
      .insert(articles)
      .values(values.slice(i, i + 100))
      .onConflictDoNothing()
      .returning({ id: articles.id });
    inserted += res.length;
  }

  await db.insert(collectionRuns).values({ found: values.length, inserted, trigger });
  console.log(`Collected ${values.length} relevant item(s), ${inserted} new`);
  return { found: values.length, inserted };
}
