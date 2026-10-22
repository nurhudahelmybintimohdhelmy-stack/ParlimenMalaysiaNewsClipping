CREATE TABLE "articles" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"title_key" text NOT NULL,
	"url" text NOT NULL,
	"snippet" text DEFAULT '' NOT NULL,
	"source_id" text NOT NULL,
	"source" text NOT NULL,
	"type" text NOT NULL,
	"language" text NOT NULL,
	"published" timestamp with time zone NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_runs" (
	"id" serial PRIMARY KEY,
	"ran_at" timestamp with time zone DEFAULT now() NOT NULL,
	"found" integer DEFAULT 0 NOT NULL,
	"inserted" integer DEFAULT 0 NOT NULL,
	"trigger" text DEFAULT 'schedule' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "articles_source_title_idx" ON "articles" ("source_id","title_key");--> statement-breakpoint
CREATE INDEX "articles_published_idx" ON "articles" ("published");