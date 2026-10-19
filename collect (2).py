#!/usr/bin/env python3
"""Collect news items that mention Parlimen Malaysia.

For every outlet in sources.json this script reads:
  1. the outlet's own RSS feeds (if listed), filtered by keyword, and
  2. a Google News RSS search restricted to the outlet's domain
     (works for outlets with no public RSS feed).

Only metadata is stored (title, link, short snippet, source, date).
The result is written to docs/data/articles.json for the dashboard.
"""
import datetime as dt
import hashlib
import html
import json
import re
import sys
import urllib.parse
from pathlib import Path

import feedparser

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "sources.json"
OUT = ROOT / "docs" / "data" / "articles.json"

MAX_AGE_DAYS = 180
MAX_ARTICLES = 6000
SNIPPET_LEN = 220
USER_AGENT = "ParlimenNewsDashboard/1.0 (+https://github.com)"


def clean_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value or "")
    value = html.unescape(value)
    return re.sub(r"\s+", " ", value).strip()


def snippet(value: str) -> str:
    text = clean_text(value)
    if len(text) > SNIPPET_LEN:
        text = text[:SNIPPET_LEN].rsplit(" ", 1)[0] + "…"
    return text


def make_matcher(keywords):
    pattern = re.compile(
        "|".join(r"\b" + re.escape(k) + r"\b" for k in keywords), re.IGNORECASE
    )
    return lambda text: bool(pattern.search(text or ""))


def entry_date(entry) -> str:
    parsed = entry.get("published_parsed") or entry.get("updated_parsed")
    if parsed:
        d = dt.datetime(*parsed[:6], tzinfo=dt.timezone.utc)
    else:
        d = dt.datetime.now(dt.timezone.utc)
    return d.isoformat()


def article_id(link: str, title: str) -> str:
    key = (link or "").split("?")[0] or title.lower()
    return hashlib.sha1(key.encode("utf-8")).hexdigest()[:16]


def google_news_url(config, domain: str) -> str:
    q = f'{config["google_news_query"]} site:{domain} when:{config["google_news_window"]}'
    return (
        "https://news.google.com/rss/search?q="
        + urllib.parse.quote(q)
        + "&hl=en-MY&gl=MY&ceid=MY:en"
    )


def strip_source_suffix(title: str, outlet_name: str) -> str:
    # Google News appends " - Outlet Name" to titles.
    return re.sub(r"\s+-\s+[^-]{2,60}$", "", title).strip() or title


def fetch(url: str):
    return feedparser.parse(url, agent=USER_AGENT)


def collect(config):
    matches = make_matcher(config["keywords"])
    found = []
    for outlet in config["outlets"]:
        sources = [(u, True) for u in outlet.get("feeds", [])]
        if outlet.get("domain"):
            sources.append((google_news_url(config, outlet["domain"]), False))
        for url, needs_filter in sources:
            try:
                feed = fetch(url)
            except Exception as exc:  # network / parse problems must not stop the run
                print(f"[warn] {outlet['name']}: {exc}", file=sys.stderr)
                continue
            if not feed.entries:
                print(f"[info] {outlet['name']}: no entries from {url[:70]}")
                continue
            count = 0
            for e in feed.entries:
                title = clean_text(e.get("title", ""))
                link = e.get("link", "")
                summary = e.get("summary", "") if needs_filter else ""
                if not title or not link:
                    continue
                if needs_filter and not matches(f"{title} {summary}"):
                    continue
                if not needs_filter:
                    title = strip_source_suffix(title, outlet["name"])
                found.append(
                    {
                        "id": article_id(link, title),
                        "title": title,
                        "url": link,
                        "snippet": snippet(summary),
                        "source_id": outlet["id"],
                        "source": outlet["name"],
                        "type": outlet["type"],
                        "language": outlet["language"],
                        "published": entry_date(e),
                    }
                )
                count += 1
            print(f"[ok]   {outlet['name']}: {count} item(s)")
    return found


def merge(existing, new):
    by_id = {a["id"]: a for a in existing}
    # Also dedupe by (source, normalised title) because the same story can arrive
    # both from the outlet's feed and from Google News with different URLs.
    seen_titles = {(a["source_id"], a["title"].lower()): a["id"] for a in existing}
    for a in new:
        tkey = (a["source_id"], a["title"].lower())
        if a["id"] in by_id or tkey in seen_titles:
            continue
        by_id[a["id"]] = a
        seen_titles[tkey] = a["id"]
    cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=MAX_AGE_DAYS)
    kept = [
        a for a in by_id.values() if dt.datetime.fromisoformat(a["published"]) >= cutoff
    ]
    kept.sort(key=lambda a: a["published"], reverse=True)
    return kept[:MAX_ARTICLES]


def main():
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    existing = []
    if OUT.exists():
        try:
            existing = json.loads(OUT.read_text(encoding="utf-8")).get("articles", [])
        except json.JSONDecodeError:
            existing = []
    articles = merge(existing, collect(config))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "updated": dt.datetime.now(dt.timezone.utc).isoformat(),
        "outlets": [
            {k: o[k] for k in ("id", "name", "type", "language")}
            for o in config["outlets"]
        ],
        "articles": articles,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Saved {len(articles)} article(s) to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
