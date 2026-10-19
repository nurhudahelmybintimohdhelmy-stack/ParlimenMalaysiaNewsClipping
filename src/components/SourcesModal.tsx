import React from 'react';
import { X, ExternalLink, Globe, Tag, Radio } from 'lucide-react';
import { SourcesConfig } from '../types';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SourcesConfig;
}

export const SourcesModal: React.FC<SourcesModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Monitored Outlets & Parliament Keywords
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configured sources and search terms from sources.json
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* Keywords Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Tracking Keywords ({config.keywords.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {config.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1f4e9c] dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                >
                  {kw}
                </span>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Google News Query: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">{config.google_news_query}</code> (window: {config.google_news_window})
            </div>
          </div>

          {/* Outlets Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              Monitored Outlets ({config.outlets.length})
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              {config.outlets.map((o) => (
                <div
                  key={o.id}
                  className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {o.name}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{o.type}</span>
                      <span>•</span>
                      <span>{o.language}</span>
                      {o.domain && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{o.domain}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {o.domain && (
                    <a
                      href={`https://${o.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-600 p-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
