import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import LiveNewsTicker from '../components/Layout/LiveNewsTicker';
import NewsFeed from '../components/News/NewsFeed';
import { api } from '../context/AuthContext';
import { SidebarSkeleton } from '../components/Common/Skeleton';
import { Globe, TrendingUp, ChevronRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const countries = [
  { code: 'in', name: 'India', flag: '🇮🇳' },
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' }
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'general';
  const [country, setCountry] = useState('in');
  
  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // Fetch trending articles for the sidebar
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoadingTrending(true);
        const res = await api.get('/api/news/headlines?category=general&pageSize=5');
        if (res.data.success && res.data.articles) {
          // Exclude first article (which is likely the main featured hero)
          setTrending(res.data.articles.slice(1, 6));
        }
      } catch (err) {
        console.warn('Failed to load trending sidebar:', err.message);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, []);

  const handleCountryChange = (code) => {
    setCountry(code);
    // Smooth scroll to top of feed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Live Breaking News Ticker */}
      <LiveNewsTicker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header section detailing current segment */}
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight uppercase dark:text-white">
              {category === 'general' ? 'Top Headlines' : `${category} Dispatch`}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light mt-1">
              Real-time coverage from trusted editorial boards worldwide.
            </p>
          </div>
          <div className="text-xs font-semibold text-brand dark:text-blue-400 flex items-center bg-blue-50 dark:bg-zinc-800 py-1.5 px-3.5 rounded-full border border-blue-100 dark:border-zinc-700 select-none">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            <span>Region: {countries.find(c => c.code === country)?.name}</span>
          </div>
        </div>

        {/* Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Column */}
          <main className="lg:col-span-8 xl:col-span-9">
            <NewsFeed category={category} country={country} />
          </main>

          {/* Sidebar Widgets Column */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
            
            {/* Global Coverage Widget */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-zinc-800/80 pb-3 mb-4 flex items-center">
                <Globe className="h-4 w-4 mr-2 text-brand dark:text-blue-400" />
                <span>Global Coverage</span>
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleCountryChange(c.code)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition ${
                      country === c.code
                        ? 'bg-blue-50 border-blue-200 text-brand dark:bg-zinc-800 dark:border-zinc-700 dark:text-blue-400 font-semibold'
                        : 'bg-white hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending / Hot Stories Widget */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/80 pb-3 mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
                  <span>Trending Hub</span>
                </h3>
                <Link
                  to="/trending"
                  className="text-[10px] font-bold text-brand dark:text-blue-400 uppercase tracking-widest hover:underline flex items-center"
                >
                  <span>All</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {loadingTrending ? (
                <SidebarSkeleton />
              ) : (
                <div className="space-y-4">
                  {trending.map((t, idx) => {
                    const detailLink = `/article?url=${encodeURIComponent(t.url)}&title=${encodeURIComponent(t.title)}&category=${encodeURIComponent(t.category || 'general')}&urlToImage=${encodeURIComponent(t.urlToImage || '')}`;
                    return (
                      <div key={idx} className="flex space-x-3.5 pb-4 border-b border-gray-100 dark:border-zinc-800 last:border-0 last:pb-0 last:mb-0">
                        {t.urlToImage ? (
                          <Link to={detailLink} className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border">
                            <img
                              src={t.urlToImage}
                              alt={t.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&auto=format&fit=crop';
                              }}
                            />
                          </Link>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-gray-400">
                            <Award className="h-5 w-5" />
                          </div>
                        )}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <Link
                            to={detailLink}
                            className="text-xs font-serif font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-brand leading-snug"
                          >
                            {t.title}
                          </Link>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide truncate">
                            {t.source?.name || 'Local Press'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
