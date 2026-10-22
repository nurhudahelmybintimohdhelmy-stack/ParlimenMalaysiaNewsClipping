import { Article } from '../types';

export const KL_TIMEZONE = "Asia/Kuala_Lumpur";

export function formatDateTimeKL(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleString("en-GB", {
      timeZone: KL_TIMEZONE,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoDate;
  }
}

export function formatDateDayKey(isoDate: string | number): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-CA", { timeZone: KL_TIMEZONE });
  } catch {
    return "";
  }
}

// Load clippings collected automatically on the server
export async function fetchStoredArticles(): Promise<{ articles: Article[]; lastUpdated: string | null }> {
  const res = await fetch('/api/articles');
  if (!res.ok) throw new Error(`Failed to load articles (${res.status})`);
  return res.json();
}

// Ask the server to run a collection now instead of waiting for the next scheduled run
export async function triggerCollection(): Promise<{ found: number; inserted: number; skipped: boolean }> {
  const res = await fetch('/api/articles', { method: 'POST' });
  if (!res.ok) throw new Error(`Collection failed (${res.status})`);
  return res.json();
}

// Export articles to CSV
export function exportArticlesToCSV(articles: Article[]) {
  const headers = ["Title", "Source", "Type", "Language", "Published (KL Time)", "URL", "Snippet"];
  const rows = articles.map((a) => [
    `"${(a.title || "").replace(/"/g, '""')}"`,
    `"${(a.source || "").replace(/"/g, '""')}"`,
    `"${(a.type || "").replace(/"/g, '""')}"`,
    `"${(a.language || "").replace(/"/g, '""')}"`,
    `"${formatDateTimeKL(a.published)}"`,
    `"${(a.url || "").replace(/"/g, '""')}"`,
    `"${(a.snippet || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `parlimen_news_clippings_${formatDateDayKey(Date.now())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export articles to JSON
export function exportArticlesToJSON(articles: Article[], outlets: any[]) {
  const data = {
    updated: new Date().toISOString(),
    totalArticles: articles.length,
    outlets,
    articles,
  };
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `parlimen_articles_${formatDateDayKey(Date.now())}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
