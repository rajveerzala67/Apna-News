import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import NewsCard from '../components/News/NewsCard';
import { NewsCardSkeleton } from '../components/Common/Skeleton';
import { Flame, Compass, Tags, Award, CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const defaultHotTopics = [
  'artificial intelligence',
  'gdp growth',
  'climate summit',
  'renewables',
  'gene editing',
  'crispr',
  'bullet trains',
  'space mission',
  'T20 match',
  'indie films'
];

export default function Trending() {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [editorsPicks, setEditorsPicks] = useState([]);
  const [hotTopics, setHotTopics] = useState(defaultHotTopics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const loadTrendingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch popular headlines (sortBy = popularity proxy)
      const trendRes = await api.get('/api/news/headlines?sortBy=popularity&pageSize=6');
      if (trendRes.data.success) {
        setTrendingArticles(trendRes.data.articles || []);
      }

      // Fetch Editor's Picks (e.g. Science category)
      const picksRes = await api.get('/api/news/headlines?category=science&pageSize=3');
      if (picksRes.data.success) {
        setEditorsPicks(picksRes.data.articles || []);
      }

      // Fetch actual trending search queries if admin has some logged
      try {
        const statsRes = await api.get('/api/admin/stats'); // We can try to load, or fallback on error
        if (statsRes.data.success && statsRes.data.stats?.trendingSearches) {
          const terms = statsRes.data.stats.trendingSearches.map(t => t.term);
          if (terms.length > 3) {
            setHotTopics(terms);
          }
        }
      } catch {
        // Silently fallback if user is not admin
      }

    } catch (err) {
      console.error('Failed to load trending highlights:', err);
      setError('Failed to load trending data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrendingData();
  }, []);

  const handleTopicClick = (topic) => {
    navigate(`/search?q=${encodeURIComponent(topic)}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="h-10 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
        <RefreshCw className="h-10 w-10 text-red-500 mb-4 animate-spin" />
        <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-zinc-200">Unable to load trending desk</h3>
        <button
          onClick={loadTrendingData}
          className="mt-4 px-5 py-2.5 bg-brand text-white rounded-full text-sm font-semibold"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-5">
        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight uppercase dark:text-white flex items-center">
          <Flame className="h-8 w-8 mr-3 text-red-600 animate-pulse" />
          <span>Trending Hub</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light mt-1">
          Hottest global content, popular searches, and editors choice columns.
        </p>
      </div>

      {/* Grid containing hot topic cloud and statistics summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Hot Topics tag cloud */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200 border-b border-gray-100 dark:border-zinc-800 pb-3.5 mb-5 flex items-center">
            <Tags className="h-4 w-4 mr-2 text-brand dark:text-blue-400" />
            <span>Hot Topics Right Now</span>
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {hotTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleTopicClick(topic)}
                className="px-4 py-2 bg-gray-50 hover:bg-brand/10 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 hover:text-brand dark:hover:text-blue-400 border border-gray-200/60 dark:border-zinc-700/60 text-xs sm:text-sm font-medium rounded-2xl transition-all"
              >
                # {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Popularity Stats Widget */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200 border-b border-gray-100 dark:border-zinc-800 pb-3.5 mb-5 flex items-center">
            <Compass className="h-4 w-4 mr-2 text-brand dark:text-blue-400" />
            <span>Popular Categories</span>
          </h3>
          <div className="space-y-3">
            {[
              { cat: 'Technology', clicks: '4,280 reads', percent: 'w-full bg-blue-500' },
              { cat: 'Business', clicks: '2,910 reads', percent: 'w-3/4 bg-indigo-500' },
              { cat: 'Sports', clicks: '2,400 reads', percent: 'w-2/3 bg-purple-500' },
              { cat: 'Science', clicks: '1,890 reads', percent: 'w-1/2 bg-pink-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-700 dark:text-zinc-300">{item.cat}</span>
                  <span className="text-gray-400 font-light">{item.clicks}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.percent}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Top Trending news list */}
      <section className="space-y-6">
        <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          <span>Most Read News Stories</span>
        </h3>
        
        {trendingArticles.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No trending coverage logged today.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingArticles.map((article, idx) => (
              <NewsCard key={article.url || idx} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Editor's Choice curated picks */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 border dark:border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6">
        <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-500" />
          <span>Curated Picks from the Editors</span>
        </h3>
        
        {editorsPicks.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No editors picks are loaded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {editorsPicks.map((article, idx) => (
              <NewsCard key={article.url || idx} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
