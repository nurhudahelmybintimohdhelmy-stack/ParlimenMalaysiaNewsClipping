export interface Outlet {
  id: string;
  name: string;
  type: string;
  language: string;
  domain?: string;
  feeds?: string[];
}

export interface Article {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source_id: string;
  source: string;
  type: string;
  language: string;
  published: string; // ISO date string
  bookmarked?: boolean;
}

export interface SourcesConfig {
  keywords: string[];
  google_news_query: string;
  google_news_window: string;
  outlets: Outlet[];
}

export interface FilterState {
  searchQuery: string;
  selectedType: string;
  selectedLanguage: string;
  rangeDays: number; // 1 = today, 7 = 7 days, 30 = 30 days, 0 = all time
  selectedSourceId: string;
  onlyBookmarked: boolean;
  selectedTag: string;
}
