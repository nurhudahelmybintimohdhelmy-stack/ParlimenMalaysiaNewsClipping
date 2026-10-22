import React, { useState, useEffect, useMemo } from 'react';
import { Article, FilterState, SourcesConfig } from './types';
import { DEFAULT_CONFIG } from './data/defaultData';
import {
  formatDateDayKey,
  fetchStoredArticles,
  triggerCollection,
  exportArticlesToCSV,
  exportArticlesToJSON,
} from './services/newsService';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { SourceBreakdown } from './components/SourceBreakdown';
import { DayTrendsChart } from './components/DayTrendsChart';
import { FilterBar } from './components/FilterBar';
import { ArticleCard } from './components/ArticleCard';
import { SourcesModal } from './components/SourcesModal';

const PAGE_SIZE = 40;
const STORAGE_BOOKMARKS_KEY = 'parlimen_news_bookmarks_v2';
const STORAGE_THEME_KEY = 'parlimen_news_theme';

export function App() {
  const [config] = useState<SourcesConfig>(DEFAULT_CONFIG);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Bookmarks are personal, so they stay in this browser
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to parse stored bookmarks:', e);
    }
    return new Set();
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [shownCount, setShownCount] = useState(PAGE_SIZE);
  const [selectedDayFilter, setSelectedDayFilter] = useState('');

  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    selectedType: '',
    selectedLanguage: '',
    rangeDays: 7, // Default: last 7 days as in original
    selectedSourceId: '',
    onlyBookmarked: false,
    selectedTag: '',
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_THEME_KEY, 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(Array.from(bookmarkedIds)));
  }, [bookmarkedIds]);

  const loadArticles = async () => {
    const data = await fetchStoredArticles();
    setArticles(data.articles);
    setLastUpdated(data.lastUpdated);
    return data;
  };

  useEffect(() => {
    loadArticles()
      .catch((err) => {
        console.error(err);
        showToast('Could not load clippings right now.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await triggerCollection();
      await loadArticles();
      if (result.skipped) {
        showToast('Feeds were checked moments ago. Showing the latest clippings.');
      } else if (result.inserted > 0) {
        showToast(`Refreshed! Added ${result.inserted} new parliamentary clipping(s).`);
      } else {
        showToast('All feeds up to date. No new articles found.');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not fetch feed updates right now.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdateFilter = (updates: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
    setShownCount(PAGE_SIZE);
  };

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      selectedType: '',
      selectedLanguage: '',
      rangeDays: 7,
      selectedSourceId: '',
      onlyBookmarked: false,
      selectedTag: '',
    });
    setSelectedDayFilter('');
    setShownCount(PAGE_SIZE);
  };

  // Helper matching original inRange logic
  const inRange = (a: Article, days: number): boolean => {
    if (!days) return true;
    if (days === 1) {
      return formatDateDayKey(a.published) === formatDateDayKey(Date.now());
    }
    const t = new Date(a.published).getTime();
    return Date.now() - t <= days * 864e5;
  };

  const articlesWithBookmarks = useMemo(
    () => articles.map((a) => (bookmarkedIds.has(a.id) ? { ...a, bookmarked: true } : a)),
    [articles, bookmarkedIds]
  );

  // Base filtered for stats and source counts (ignoring source filter so breakdown shows full context)
  const baseFiltered = useMemo(() => {
    const q = filter.searchQuery.trim().toLowerCase();
    const tag = filter.selectedTag.trim().toLowerCase();
    return articlesWithBookmarks.filter((a) => {
      const matchesSearch =
        !q || (a.title + ' ' + (a.snippet || '')).toLowerCase().includes(q);
      const matchesTag =
        !tag || (a.title + ' ' + (a.snippet || '')).toLowerCase().includes(tag);
      const matchesType = !filter.selectedType || a.type === filter.selectedType;
      const matchesLang =
        !filter.selectedLanguage || a.language === filter.selectedLanguage;
      const matchesRange = inRange(a, filter.rangeDays);
      const matchesDay = !selectedDayFilter || formatDateDayKey(a.published) === selectedDayFilter;
      const matchesBookmark = !filter.onlyBookmarked || Boolean(a.bookmarked);

      return (
        matchesSearch &&
        matchesTag &&
        matchesType &&
        matchesLang &&
        matchesRange &&
        matchesDay &&
        matchesBookmark
      );
    });
  }, [articlesWithBookmarks, filter.searchQuery, filter.selectedTag, filter.selectedType, filter.selectedLanguage, filter.rangeDays, selectedDayFilter, filter.onlyBookmarked]);

  // Final filtered list including source filter
  const filteredArticles = useMemo(() => {
    if (!filter.selectedSourceId) return baseFiltered;
    return baseFiltered.filter((a) => a.source_id === filter.selectedSourceId);
  }, [baseFiltered, filter.selectedSourceId]);

  // Calculate statistics exactly like original
  const todayKey = formatDateDayKey(Date.now());
  const todayCount = articles.filter((a) => formatDateDayKey(a.published) === todayKey).length;
  const weekCount = articles.filter((a) => Date.now() - new Date(a.published).getTime() <= 7 * 864e5).length;
  const activeSourcesCount = new Set(articles.map((a) => a.source_id)).size;
  const bookmarkedCount = articlesWithBookmarks.filter((a) => a.bookmarked).length;

  // Source counts map for breakdown
  const sourceCountsMap = useMemo(() => {
    const counts: Record<string, number> = {};
    baseFiltered.forEach((a) => {
      counts[a.source_id] = (counts[a.source_id] || 0) + 1;
    });
    return counts;
  }, [baseFiltered]);

  const availableTypes = useMemo(() => {
    return Array.from(new Set(config.outlets.map((o) => o.type)));
  }, [config.outlets]);

  const availableLanguages = useMemo(() => {
    return Array.from(new Set(config.outlets.map((o) => o.language)));
  }, [config.outlets]);

  const displayedArticles = filteredArticles.slice(0, shownCount);

  return (
    <div className="min-h-screen bg-[#f6f7f9] dark:bg-[#12161c] text-[#1b2430] dark:text-[#e8ecf2] transition-colors duration-200">
      <Header
        lastUpdated={lastUpdated}
        totalArticles={articles.length}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onOpenSources={() => setShowSourcesModal(true)}
        onExportCSV={() => exportArticlesToCSV(filteredArticles)}
        onExportJSON={() => exportArticlesToJSON(filteredArticles, config.outlets)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        bookmarkedCount={bookmarkedCount}
        showOnlyBookmarked={filter.onlyBookmarked}
        onToggleOnlyBookmarked={() =>
          handleUpdateFilter({ onlyBookmarked: !filter.onlyBookmarked })
        }
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xl transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Stats Grid */}
        <StatsCards
          todayCount={todayCount}
          weekCount={weekCount}
          totalCount={articles.length}
          activeSources={activeSourcesCount}
          totalSources={config.outlets.length}
          onFilterToday={() => handleUpdateFilter({ rangeDays: 1 })}
          onFilterWeek={() => handleUpdateFilter({ rangeDays: 7 })}
          onFilterAll={() => handleUpdateFilter({ rangeDays: 0 })}
          currentRange={filter.rangeDays}
        />

        {/* Breakdown Panels */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-3">
          <SourceBreakdown
            outlets={config.outlets}
            sourceCounts={sourceCountsMap}
            selectedSourceId={filter.selectedSourceId}
            onSelectSource={(id) =>
              handleUpdateFilter({
                selectedSourceId: filter.selectedSourceId === id ? '' : id,
              })
            }
          />

          <DayTrendsChart
            articles={articles}
            selectedDate={selectedDayFilter}
            onSelectDate={(d) => setSelectedDayFilter(d)}
          />
        </section>

        {/* Filter Controls */}
        <FilterBar
          filter={filter}
          onChangeFilter={handleUpdateFilter}
          availableTypes={availableTypes}
          availableLanguages={availableLanguages}
          onResetFilters={handleResetFilters}
        />

        {/* Articles Count & Active Filter Indicator */}
        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 my-2 flex items-center justify-between">
          <div>
            <span>
              {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'}
            </span>
            {filter.selectedSourceId && (
              <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium">
                · filtered by {config.outlets.find((o) => o.id === filter.selectedSourceId)?.name || filter.selectedSourceId}
              </span>
            )}
            {selectedDayFilter && (
              <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium">
                · filtered on date {selectedDayFilter}
              </span>
            )}
            {filter.selectedTag && (
              <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium">
                · topic: {filter.selectedTag}
              </span>
            )}
          </div>
          {filteredArticles.length > shownCount && (
            <span className="text-xs text-slate-400">
              Showing {shownCount} of {filteredArticles.length}
            </span>
          )}
        </div>

        {/* Article Items List */}
        <div id="list" className="mt-2">
          {displayedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onToggleBookmark={handleToggleBookmark}
              onFilterBySource={(sourceId) =>
                handleUpdateFilter({
                  selectedSourceId: filter.selectedSourceId === sourceId ? '' : sourceId,
                })
              }
            />
          ))}

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl my-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {isLoading
                  ? 'Loading clippings…'
                  : articles.length
                  ? 'No articles match these filters.'
                  : 'No articles yet. New clippings are collected automatically every 30 minutes, or click Fetch Updates to retrieve the first batch now.'}
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination: Show More Button */}
        {filteredArticles.length > shownCount && (
          <button
            onClick={() => setShownCount((prev) => prev + PAGE_SIZE)}
            className="block mx-auto my-5 px-6 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            Show more ({filteredArticles.length - shownCount} remaining)
          </button>
        )}
      </main>

      <footer className="text-slate-500 dark:text-slate-500 text-xs text-center py-6 px-4 border-t border-slate-200 dark:border-slate-800">
        Headlines link to the original publishers. Parliament-related clippings are collected automatically every 30 minutes from Google News and outlet RSS feeds.
      </footer>

      {/* Sources & Keywords Modal */}
      <SourcesModal
        isOpen={showSourcesModal}
        onClose={() => setShowSourcesModal(false)}
        config={config}
      />
    </div>
  );
}
export default App;
