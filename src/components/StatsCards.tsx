import React from 'react';

interface StatsCardsProps {
  todayCount: number;
  weekCount: number;
  totalCount: number;
  activeSources: number;
  totalSources: number;
  onFilterToday: () => void;
  onFilterWeek: () => void;
  onFilterAll: () => void;
  currentRange: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  todayCount,
  weekCount,
  totalCount,
  activeSources,
  totalSources,
  onFilterToday,
  onFilterWeek,
  onFilterAll,
  currentRange,
}) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
      <div
        onClick={onFilterToday}
        className={`bg-white dark:bg-slate-900 border rounded-xl p-3.5 transition-all cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 shadow-sm ${
          currentRange === 1 ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <span className="block text-2xl font-bold text-slate-900 dark:text-white">
          {todayCount}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">
          Today
        </span>
      </div>

      <div
        onClick={onFilterWeek}
        className={`bg-white dark:bg-slate-900 border rounded-xl p-3.5 transition-all cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 shadow-sm ${
          currentRange === 7 ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <span className="block text-2xl font-bold text-slate-900 dark:text-white">
          {weekCount}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">
          Last 7 days
        </span>
      </div>

      <div
        onClick={onFilterAll}
        className={`bg-white dark:bg-slate-900 border rounded-xl p-3.5 transition-all cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 shadow-sm ${
          currentRange === 0 ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <span className="block text-2xl font-bold text-slate-900 dark:text-white">
          {totalCount}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">
          Total stored
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
        <span className="block text-2xl font-bold text-slate-900 dark:text-white">
          {activeSources} <span className="text-sm font-normal text-slate-400">/ {totalSources}</span>
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">
          Sources with articles
        </span>
      </div>
    </section>
  );
};
