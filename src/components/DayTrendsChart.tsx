import React from 'react';
import { formatDateDayKey } from '../services/newsService';
import { Article } from '../types';

interface DayTrendsChartProps {
  articles: Article[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export const DayTrendsChart: React.FC<DayTrendsChartProps> = ({
  articles,
  selectedDate,
  onSelectDate,
}) => {
  const { days, counts, maxCount } = React.useMemo(() => {
    const dayKeys: string[] = [];
    const countsMap: Record<string, number> = {};

    // 14 days back to today
    for (let i = 13; i >= 0; i--) {
      const dKey = formatDateDayKey(Date.now() - i * 864e5);
      dayKeys.push(dKey);
      countsMap[dKey] = 0;
    }

    articles.forEach((a) => {
      const k = formatDateDayKey(a.published);
      if (k in countsMap) {
        countsMap[k]++;
      }
    });

    const max = Math.max(1, ...Object.values(countsMap));
    return { days: dayKeys, counts: countsMap, maxCount: max };
  }, [articles]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Last 14 days
        </h2>
        {selectedDate && (
          <button
            onClick={() => onSelectDate('')}
            className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Clear date filter
          </button>
        )}
      </div>

      <div className="flex items-end gap-1.5 h-[130px] pt-4 pb-1">
        {days.map((d) => {
          const count = counts[d] || 0;
          const isSelected = selectedDate === d;
          const heightPercent = count > 0 ? Math.max(10, (count / maxCount) * 85) : 3;
          const dayNumber = d.slice(8);

          return (
            <div
              key={d}
              onClick={() => onSelectDate(isSelected ? '' : d)}
              title={`${d}: ${count} article(s)`}
              className={`flex-1 flex flex-col justify-end items-center h-full group cursor-pointer transition-all ${
                isSelected ? 'opacity-100' : 'opacity-85 hover:opacity-100'
              }`}
            >
              {/* Count label above bar */}
              <span
                className={`text-[10px] font-semibold mb-1 tabular-nums transition-colors ${
                  isSelected
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : count > 0
                    ? 'text-slate-600 dark:text-slate-400'
                    : 'text-transparent group-hover:text-slate-400'
                }`}
              >
                {count > 0 ? count : '0'}
              </span>

              {/* Bar track and fill */}
              <div className="w-full flex items-end justify-center h-16">
                <div
                  className={`w-full max-w-[18px] rounded-t transition-all duration-300 ${
                    isSelected
                      ? 'bg-blue-600 dark:bg-blue-400 ring-2 ring-blue-300'
                      : count > 0
                      ? 'bg-[#3b6fc4] dark:bg-blue-500 group-hover:bg-blue-700'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day label */}
              <span
                className={`text-[10px] mt-1.5 tabular-nums ${
                  isSelected
                    ? 'font-bold text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                }`}
              >
                {dayNumber}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
