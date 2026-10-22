import { pgTable, serial, text, timestamp, integer, uniqueIndex, index } from "drizzle-orm/pg-core";

export const articles = pgTable(
  "articles",
  {
    id: text().primaryKey(),
    title: text().notNull(),
    titleKey: text("title_key").notNull(),
    url: text().notNull(),
    snippet: text().notNull().default(""),
    sourceId: text("source_id").notNull(),
    source: text().notNull(),
    type: text().notNull(),
    language: text().notNull(),
    published: timestamp({ withTimezone: true }).notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("articles_source_title_idx").on(t.sourceId, t.titleKey),
    index("articles_published_idx").on(t.published),
  ]
);

export const collectionRuns = pgTable("collection_runs", {
  id: serial().primaryKey(),
  ranAt: timestamp("ran_at", { withTimezone: true }).notNull().defaultNow(),
  found: integer().notNull().default(0),
  inserted: integer().notNull().default(0),
  trigger: text().notNull().default("schedule"),
});
