# Parlimen News Monitor

A free, automatic dashboard that collects news headlines mentioning **Parlimen Malaysia**
(Dewan Rakyat, Dewan Negara, Hansard, etc.) from official sources, news agencies and
English / Malay newspapers.

- **Collector** (`scripts/collect.py`) reads RSS feeds and Google News searches limited to each outlet's domain.
- **GitHub Actions** (`.github/workflows/collect.yml`) runs it every 3 hours and saves the result to `docs/data/articles.json`.
- **Dashboard** (`docs/index.html`) is hosted on GitHub Pages: search, filter by source / type / language / date, counts per source and a 14-day trend.

Only the headline, link, short snippet, source and date are stored. Each item links to the original publisher.

## Setup (about 5 minutes)

1. Create a new GitHub repository (for example `parlimen-news-dashboard`) and upload everything in this folder, keeping the structure.
2. Go to **Settings → Actions → General → Workflow permissions** and choose **Read and write permissions**. Save.
3. Go to **Settings → Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch `main`, folder `/docs`. Save.
4. Go to the **Actions** tab, open **Collect parliament news** and click **Run workflow** for the first fetch.
5. After a minute or two, open your Pages address (shown in Settings → Pages), usually `https://<your-username>.github.io/<repo-name>/`.

From then on it refreshes itself every 3 hours.

## Customising

Edit `sources.json`:

- `keywords`: words that make an article count as parliament-related (used on outlets' own feeds).
- `google_news_query` and `google_news_window`: the Google News search used for every outlet.
- `outlets`: add or remove outlets. Put any known RSS URL in `feeds`; the `domain` is always searched through Google News as a fallback.

Change the schedule by editing the `cron` line in `.github/workflows/collect.yml`.

## Notes and limits

- Google News gives a limited number of recent results per search, so very busy days can be under-counted. Running more often (for example hourly) helps.
- Some outlets (Malaysiakini, The Edge) are partly paywalled; only the headline is collected.
- Parlimen's live streams on YouTube/Facebook are not collected here; those are video, not articles.
- Feed addresses can change. If an outlet shows 0 articles, check the Actions log and update its `feeds` entry.
- Items older than 180 days are removed to keep the file small.
- Please respect each publisher's terms of use; this tool only links to the original articles.
