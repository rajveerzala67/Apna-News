import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bookmark, Share2, Calendar, User, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsCard({ article }) {
  const { toggleBookmark, isBookmarked, user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);

  const { title, description, url, urlToImage, source, author, publishedAt, category } = article;
  
  const bookmarked = isBookmarked(url);

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const date = new Date(dateStr);
      // If it is today, show relative hours, else calendar date
      const diffMs = new Date() - date;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHrs < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins <= 0 ? 1 : diffMins}m ago`;
      }
      if (diffHrs < 24) {
        return `${diffHrs}h ago`;
      }
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3000);
      return;
    }

    await toggleBookmark(article);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Construct detail page URL
    const articleDetailLink = `${window.location.origin}/article?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&category=${encodeURIComponent(category || 'general')}`;
    
    navigator.clipboard.writeText(articleDetailLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe image fallback
  const imageSrc = urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop';

  const detailPath = `/article?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&category=${encodeURIComponent(category || 'general')}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-black/20 flex flex-col h-full hover:border-gray-200 dark:hover:border-zinc-700 transition-all duration-200"
    >
      <Link to={detailPath} className="relative block overflow-hidden aspect-video bg-gray-100 dark:bg-zinc-800">
        <img
          src={imageSrc}
          alt={title}
          loading="lazy"
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop';
          }}
        />
        {category && (
          <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-brand text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-sm">
            {category}
          </span>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider space-x-1.5">
            <span>{source?.name || 'Top News'}</span>
            <span>&bull;</span>
            <span>{formatDate(publishedAt)}</span>
          </div>

          <Link to={detailPath} className="block group-hover:text-brand transition-colors">
            <h3 className="text-base sm:text-lg font-serif font-bold leading-tight text-gray-900 dark:text-white line-clamp-2">
              {title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed line-clamp-2">
            {description || 'Full coverage of the story is available. Tap read article to explore the analysis, background context, and live reports.'}
          </p>
        </div>

        {/* Card Actions Bottom */}
        <div className="flex items-center justify-between pt-4 mt-5 border-t border-gray-100 dark:border-zinc-800/60 relative">
          <div className="flex items-center text-[11px] text-gray-400 dark:text-zinc-500 max-w-[60%] truncate">
            <User className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{author || 'Correspondent'}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Share action */}
            <button
              onClick={handleShareClick}
              className={`p-1.5 rounded-full border transition flex items-center justify-center ${
                copied
                  ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-400'
                  : 'hover:bg-gray-50 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 hover:text-brand'
              }`}
              title="Copy article link"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            </button>

            {/* Bookmark action */}
            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-full border transition flex items-center justify-center ${
                bookmarked
                  ? 'bg-blue-50 border-blue-200 text-brand dark:bg-zinc-800 dark:border-zinc-700 dark:text-blue-400'
                  : 'hover:bg-gray-50 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 hover:text-brand'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
            >
              <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Login warning popup */}
          <AnimatePresence>
            {showLoginToast && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 bottom-12 bg-gray-900 text-white text-[11px] font-medium py-1.5 px-3 rounded-lg flex items-center space-x-1.5 shadow-lg z-25 whitespace-nowrap"
              >
                <AlertCircle className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />
                <span>Please login to bookmark</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
