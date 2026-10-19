import React from 'react';
import { RefreshCw, Download, Moon, Sun, Settings2, Bookmark, Newspaper } from 'lucide-react';
import { formatDateTimeKL } from '../services/newsService';

interface HeaderProps {
  lastUpdated: string | null;
  totalArticles: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenSources: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  bookmarkedCount: number;
  showOnlyBookmarked: boolean;
  onToggleOnlyBookmarked: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  totalArticles,
  isRefreshing,
  onRefresh,
  onOpenSources,
  onExportCSV,
  onExportJSON,
  darkMode,
  onToggleDarkMode,
  bookmarkedCount,
  showOnlyBookmarked,
  onToggleOnlyBookmarked,
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  return (
    <header className="pt-6 pb-2 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1f4e9c] text-white flex items-center justify-center shadow-sm">
              <Newspaper className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Parlimen News Monitor
            </h1>
          </div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2">
            <span>
              {lastUpdated
                ? `Last updated ${formatDateTimeKL(lastUpdated)} (Malaysia time) · ${totalArticles} articles stored`
                : 'No data collected yet'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Fetch latest parliamentary news updates"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-[#1f4e9c] text-white hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Checking Feeds…' : 'Fetch Updates'}</span>
          </button>

          {/* Bookmarked Filter Pill */}
          <button
            onClick={onToggleOnlyBookmarked}
            title="View saved clippings"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
              showOnlyBookmarked
                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarked ? 'fill-current' : ''}`} />
            <span>Saved ({bookmarkedCount})</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="Export clippings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            {showExportMenu && (
              <div
                className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-20"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportCSV();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Export as CSV (.csv)
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportJSON();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Export as JSON (.json)
                </button>
              </div>
            )}
          </div>

          {/* Sources and Keywords Settings */}
          <button
            onClick={onOpenSources}
            title="View monitored news sources and keywords"
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle color theme"
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
