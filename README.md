# Parlimen News Monitor (React SPA)

A modern, responsive React web application monitoring news headlines and media clippings related to **Parlimen Malaysia** (Dewan Rakyat, Dewan Negara, Hansard, parliamentary select committees, bills, and ministerial statements).

## Features

- **Live Activity Metrics**: Real-time counter for today's headlines, last 7 days, total stored articles, and active news sources.
- **Source Breakdown Panel**: Interactive horizontal distribution bars showcasing news frequency across Malaysian news outlets (Official, News Agencies, English and Malay press). Click any outlet to filter.
- **14-Day Activity Trend**: Interactive bar chart displaying daily legislative coverage frequency over the past two weeks. Click any day bar to filter to that date.
- **Advanced Filtering**: Full-text search across headlines and snippets, filtering by media type, language (`BM`, `EN`, `BM/EN`), and time window (Today, Last 7 days, Last 30 days, All time).
- **Parliamentary Topic Chips**: 1-click filters for common parliamentary affairs: Dewan Rakyat, Dewan Negara, Hansard, PMQT, RUU, PAC, and Belanjawan.
- **Article Clippings**: Headline link to original publisher, publisher badge, publication timestamp formatted in Kuala Lumpur time (`Asia/Kuala_Lumpur`), media type, language, and excerpt snippet.
- **Clipping Tools**:
  - 1-click citation and URL copy for briefings and reports.
  - Bookmarking/starring to save clippings for parliamentary research.
  - Export clippings to CSV or JSON.
  - Automatic collection every 30 minutes: a scheduled Netlify Function searches Google News (English and Malay) and outlet RSS feeds, keeps only headlines mentioning parliament keywords, and stores them in Netlify Database. **Fetch Updates** triggers a collection on demand.
- **Theme Support**: Seamless Light and Dark mode with persistent user preference.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6 (running on port 3000)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Backend**: Netlify Functions (`/api/articles` + scheduled collector) with Netlify Database (Postgres via Drizzle ORM)