import React from 'react';
import { ExternalLink, Bookmark, Copy, Check } from 'lucide-react';
import { Article } from '../types';
import { formatDateTimeKL } from '../services/newsService';

interface ArticleCardProps {
  article: Article;
  onToggleBookmark: (articleId: string) => void;
  onFilterBySource: (sourceId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onToggleBookmark,
  onFilterBySource,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCitation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const citation = `"${article.title}" — ${article.source} (${formatDateTimeKL(article.published)})\n${article.url}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 mb-2.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs group">
      <div className="flex items-start justify-between gap-3">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#1f4e9c] dark:group-hover:text-blue-400 transition-colors leading-snug flex items-baseline gap-1.5"
        >
          <span>{article.title}</span>
          <ExternalLink className="w-3.5 h-3.5 inline shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 group-hover:text-blue-500" />
        </a>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <button
            onClick={handleCopyCitation}
            title={copied ? 'Copied citation!' : 'Copy headline & link'}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onToggleBookmark(article.id)}
            title={article.bookmarked ? 'Remove bookmark' : 'Bookmark this clipping'}
            className={`p-1 rounded transition-colors cursor-pointer ${
              article.bookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${article.bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Meta Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => onFilterBySource(article.source_id)}
          className="bg-blue-50 dark:bg-blue-950/80 text-[#1f4e9c] dark:text-blue-300 font-semibold rounded-full px-2.5 py-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
        >
          {article.source}
        </button>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span>{formatDateTimeKL(article.published)}</span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 text-[11px]">
          {article.type}
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-[11px] font-mono text-slate-400">
          {article.language}
        </span>
      </div>

      {/* Snippet */}
      {article.snippet && (
        <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
          {article.snippet}
        </p>
      )}
    </article>
  );
};
