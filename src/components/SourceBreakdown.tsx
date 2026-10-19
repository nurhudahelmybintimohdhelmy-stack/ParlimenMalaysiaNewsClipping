import React from 'react';
import { Outlet } from '../types';

interface SourceBreakdownProps {
  outlets: Outlet[];
  sourceCounts: Record<string, number>;
  selectedSourceId: string;
  onSelectSource: (sourceId: string) => void;
}

export const SourceBreakdown: React.FC<SourceBreakdownProps> = ({
  outlets,
  sourceCounts,
  selectedSourceId,
  onSelectSource,
}) => {
  const rows = React.useMemo(() => {
    return outlets
      .map((o) => ({
        ...o,
        count: sourceCounts[o.id] || 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [outlets, sourceCounts]);

  const maxCount = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Articles by source (click to filter)
        </h2>
        {selectedSourceId && (
          <button
            onClick={() => onSelectSource('')}
            className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
        {rows.map((r) => {
          const isActive = r.id === selectedSourceId;
          const percentage = (r.count / maxCount) * 100;

          return (
            <div
              key={r.id}
              onClick={() => onSelectSource(r.id)}
              className={`flex items-center gap-2.5 py-1 px-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 font-semibold text-[#1f4e9c] dark:text-blue-300'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="w-36 shrink-0 truncate" title={r.name}>
                {r.name}
              </span>
              <div className="flex-1 bg-blue-100 dark:bg-slate-800 rounded h-2.5 overflow-hidden">
                <div
                  className="bg-[#3b6fc4] dark:bg-blue-500 h-2.5 rounded transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                {r.count}
              </span>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="text-xs text-slate-400 py-4 text-center">No sources configured</div>
        )}
      </div>
    </div>
  );
};
