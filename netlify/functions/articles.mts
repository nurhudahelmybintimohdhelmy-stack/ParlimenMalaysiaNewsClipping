import type { Config } from "@netlify/functions";
import { desc, gte } from "drizzle-orm";
import { db } from "../../db/index.js";
import { articles, collectionRuns } from "../../db/schema.js";
import { collectParliamentNews } from "../lib/collect.js";

// Minimum gap between manual collections so the button can't hammer the feeds
const MANUAL_COOLDOWN_MS = 2 * 60 * 1000;

async function lastRun() {
  const [run] = await db.select().from(collectionRuns).orderBy(desc(collectionRuns.ranAt)).limit(1);
  return run;
}

export default async (req: Request) => {
  if (req.method === "POST") {
    const run = await lastRun();
    if (run && Date.now() - run.ranAt.getTime() < MANUAL_COOLDOWN_MS) {
      return Response.json({ found: 0, inserted: 0, skipped: true, lastUpdated: run.ranAt });
    }
    const result = await collectParliamentNews("manual");
    return Response.json({ ...result, skipped: false, lastUpdated: new Date().toISOString() });
  }

  if (req.method === "GET") {
    const cutoff = new Date(Date.now() - 180 * 864e5);
    const rows = await db
      .select()
      .from(articles)
      .where(gte(articles.published, cutoff))
      .orderBy(desc(articles.published))
      .limit(2000);
    const run = await lastRun();

    return Response.json({
      lastUpdated: run?.ranAt ?? null,
      articles: rows.map((a) => ({
        id: a.id,
        title: a.title,
        url: a.url,
        snippet: a.snippet,
        source_id: a.sourceId,
        source: a.source,
        type: a.type,
        language: a.language,
        published: a.published.toISOString(),
      })),
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/articles",
};
