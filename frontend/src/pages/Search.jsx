import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../context/AuthContext';
import NewsCard from '../components/News/NewsCard';
import { NewsCardSkeleton } from '../components/Common/Skeleton';
import { Search as SearchIcon, Filter, SlidersHorizontal, RefreshCw, Calendar, Globe, Tag, UserRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const countries = [
  { code: '', name: 'Any Country' },
  { code: 'in', name: 'India' },
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'jp', name: 'Japan' }
];

const categories = [
  { code: '', name: 'Any Category' },
  { code: 'technology', name: 'Technology' },
  { code: 'business', name: 'Business' },
  { code: 'sports', name: 'Sports' },
  { code: 'entertainment', name: 'Entertainment' },
  { code: 'health', name: 'Health' },
  { code: 'science', name: 'Science' },
  { code: 'politics', name: 'Politics' },
  { code: 'world', name: 'World News' }
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';

  // Filter States
  const [q, setQ] = useState(qParam);
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');
  const [author, setAuthor] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        q: q || undefined,
        category: category || undefined,
        country: country || undefined,
        author: author || undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
        sortBy
      };

      const res = await api.get('/api/news/search', { params });

      if (res.data.success) {
        setArticles(res.data.articles || []);
      } else {
        setError('Failed to retrieve search results');
      }
    } catch (err) {
      console.error('Search query failed:', err);
      setError(err.response?.data?.message || 'Error executing search query');
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on component mount or URL query change
  useEffect(() => {
    setQ(qParam);
    performSearch();
  }, [qParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(q ? { q } : {});
    performSearch();
  };

  const handleResetFilters = () => {
    setCategory('');
    setCountry('');
    setAuthor('');
    setFromDate('');
    setToDate('');
    setSortBy('publishedAt');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Title */}
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-5 mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight uppercase dark:text-white flex items-center">
          <SearchIcon className="h-8 w-8 mr-3 text-brand dark:text-blue-400" />
          <span>Advanced Discovery</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light mt-1">
          Perform filtered scans across international press indices.
        </p>
      </div>

      {/* Primary Search Input Panel */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by keywords (e.g. artificial intelligence, inflation, championship)..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm focus:outline-none focus:border-brand dark:focus:border-zinc-700 transition"
            />
            <SearchIcon className="absolute left-4.5 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 rounded-2xl border flex items-center space-x-2 text-sm font-semibold transition ${showFilters || category || country || author || fromDate || toDate
                  ? 'bg-blue-50 border-blue-200 text-brand dark:bg-zinc-800 dark:border-zinc-700 dark:text-blue-400'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-gray-300'
                }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters Box */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl shadow-inner p-5 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    <span>Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl text-xs sm:text-sm focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center">
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    <span>Country</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl text-xs sm:text-sm focus:outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center">
                    <UserRound className="h-3.5 w-3.5 mr-1" />
                    <span>Author</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Reporter Name..."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl text-xs sm:text-sm focus:outline-none px-3"
                  />
                </div>

                {/* Sorting options */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center">
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    <span>Sort By</span>
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl text-xs sm:text-sm focus:outline-none"
                  >
                    <option value="publishedAt">Latest Headlines</option>
                    <option value="popularity">Popularity Views</option>
                    <option value="relevancy">Relevancy Weight</option>
                  </select>
                </div>

              </div>

              {/* Date selection & control buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>From Date</span>
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="p-2 bg-gray-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>To Date</span>
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="p-2 bg-gray-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex w-full sm:w-auto justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 transition text-center"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={performSearch}
                    className="flex-1 sm:flex-initial px-5 py-2 bg-gray-900 dark:bg-zinc-800 text-white rounded-xl text-xs font-semibold hover:bg-black transition text-center"
                  >
                    Apply & Search
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Search Output Section */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-2xl bg-gray-50 dark:bg-zinc-900/10 border-gray-200 dark:border-zinc-800">
            <RefreshCw className="h-10 w-10 text-red-500 mb-4 animate-spin" />
            <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-zinc-200">Search Failed</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-1">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-zinc-900/10 border border-transparent rounded-2xl">
            <SlidersHorizontal className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-serif font-bold text-gray-700 dark:text-zinc-300">No matching reports</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mt-1 text-center px-4">
              We couldn't locate any records matching your keywords or filter parameters. Try checking your spelling or adjusting date selections.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Located {articles.length} news files
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {articles.map((article, idx) => (
                  <NewsCard key={article.url || idx} article={article} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
