import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import NewsCard from './NewsCard';
import { NewsCardSkeleton, FeaturedCardSkeleton } from '../Common/Skeleton';
import { RefreshCw, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NewsFeed({ category = 'general', country = 'in', search = '' }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = async (pageNum, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const res = await api.get('/api/news/headlines', {
        params: {
          category,
          country,
          search,
          page: pageNum,
          pageSize: reset ? 15 : 9
        }
      });

      if (res.data.success) {
        const newArticles = res.data.articles || [];
        
        if (reset) {
          setArticles(newArticles);
          setHasMore(newArticles.length >= 12); // If we get a decent size, allow paging
        } else {
          // Filter out duplicate URLs
          setArticles(prev => {
            const existingUrls = new Set(prev.map(a => a.url));
            const uniqueNew = newArticles.filter(a => !existingUrls.has(a.url));
            return [...prev, ...uniqueNew];
          });
          
          if (newArticles.length === 0) {
            setHasMore(false);
          }
        }
      } else {
        setError('Failed to retrieve headlines');
      }
    } catch (err) {
      console.error('Fetch articles failed:', err);
      setError(err.response?.data?.message || 'Error connecting to news server');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchArticles(1, true);
  }, [category, country, search]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, false);
  };

  if (loading) {
    return (
      <div className="space-y-10">
        <FeaturedCardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed rounded-2xl bg-gray-50/50 dark:bg-zinc-900/10 border-gray-200 dark:border-zinc-800">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-zinc-200">Unable to load news</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">{error}</p>
        <button
          onClick={() => fetchArticles(1, true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-full text-sm font-semibold shadow-md transition"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent rounded-2xl">
        <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-serif font-bold text-gray-700 dark:text-zinc-300">No articles found</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1">
          We couldn't find any coverage matching your current criteria. Try altering your filters or search keywords.
        </p>
      </div>
    );
  }

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);
  const featuredDetailPath = `/article?url=${encodeURIComponent(featuredArticle.url)}&title=${encodeURIComponent(featuredArticle.title)}&category=${encodeURIComponent(featuredArticle.category || 'general')}&urlToImage=${encodeURIComponent(featuredArticle.urlToImage || '')}`;

  return (
    <div className="space-y-10">
      {/* 1. Large Hero Featured Article Layout */}
      {page === 1 && featuredArticle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 grid grid-cols-1 lg:grid-cols-5"
        >
          <div className="lg:col-span-3 bg-gray-100 dark:bg-zinc-800 overflow-hidden relative aspect-video lg:aspect-auto lg:h-full lg:min-h-[350px]">
            <Link to={featuredDetailPath}>
              <img
                src={featuredArticle.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop'}
                alt={featuredArticle.title}
                className="object-cover w-full h-full transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop';
                }}
              />
            </Link>
            {featuredArticle.category && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow">
                Featured &bull; {featuredArticle.category}
              </span>
            )}
          </div>
          <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block">
                {featuredArticle.source?.name || 'Breaking News'} &bull; {new Date(featuredArticle.publishedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </span>
              <Link to={featuredDetailPath} className="block group-hover:text-brand transition-colors">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                  {featuredArticle.title}
                </h2>
              </Link>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                {featuredArticle.description || 'Global editorial desks are closely tracking this developing story. View the complete coverage file for localized analysis, related headlines, and AI-powered highlight logs.'}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800/80 pt-4">
              <span className="text-xs text-gray-400 truncate max-w-[60%]">
                By {featuredArticle.author || 'Editorial Board'}
              </span>
              <Link
                to={featuredDetailPath}
                className="text-xs font-semibold text-brand dark:text-blue-400 hover:underline flex items-center"
              >
                Read Coverage &rarr;
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Secondary News Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {gridArticles.map((article, idx) => (
            <NewsCard key={article.url || idx} article={article} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 3. Skeleton list for load more */}
      {loadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3].map((i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 4. Paging trigger */}
      {hasMore && !loadingMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2.5 bg-white hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-full shadow-sm transition-all"
          >
            Load More Stories
          </button>
        </div>
      )}
    </div>
  );
}
