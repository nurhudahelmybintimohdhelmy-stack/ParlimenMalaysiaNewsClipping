import React from 'react';
import { Search, X } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filter: FilterState;
  onChangeFilter: (updates: Partial<FilterState>) => void;
  availableTypes: string[];
  availableLanguages: string[];
  onResetFilters: () => void;
}

const POPULAR_TAGS = ['Dewan Rakyat', 'Dewan Negara', 'Hansard', 'PMQT', 'RUU', 'PAC', 'Belanjawan'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  availableTypes,
  availableLanguages,
  onResetFilters,
}) => {
  const hasActiveFilters =
    Boolean(filter.searchQuery) ||
    Boolean(filter.selectedType) ||
    Boolean(filter.selectedLanguage) ||
    filter.rangeDays !== 7 ||
    Boolean(filter.selectedSourceId) ||
    Boolean(filter.selectedTag) ||
    filter.onlyBookmarked;

  return (
    <div className="space-y-2 mt-4 mb-2">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="q"
            type="search"
            value={filter.searchQuery}
            onChange={(e) => onChangeFilter({ searchQuery: e.target.value })}
            placeholder="Search headlines…"
            className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onChangeFilter({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type Selector */}
        <select
          id="type"
          value={filter.selectedType}
          onChange={(e) => onChangeFilter({ selectedType: e.target.value })}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
        >
          <option value="">All types</option>
          {availableTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Language Selector */}
        <select
          id="lang"
          value={filter.selectedLanguage}
          onChange={(e) => onChangeFilter({ selectedLanguage: e.target.value })}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
        >
          <option value="">All languages</option>
          {availableLanguages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Date Range Selector */}
        <select
          id="range"
          value={filter.rangeDays}
          onChange={(e) => onChangeFilter({ rangeDays: Number(e.target.value) })}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer font-medium"
        >
          <option value={1}>Today</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={0}>All time</option>
        </select>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium px-2 py-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Quick Topic Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mr-1">Topics:</span>
        {POPULAR_TAGS.map((tag) => {
          const isSelected = filter.selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onChangeFilter({ selectedTag: isSelected ? '' : tag })}
              className={`px-2 py-0.5 text-xs rounded-md transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};
