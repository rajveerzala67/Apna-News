import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import NewsCard from '../components/News/NewsCard';
import { Bookmark, History, Settings, Award, Calendar, BookOpen, Trash2, Tag, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const availableCategories = [
  'technology',
  'business',
  'sports',
  'entertainment',
  'health',
  'science',
  'politics',
  'world'
];

export default function Dashboard() {
  const { user, updateProfile, loadUser } = useAuth();
  
  // Tab control
  const [activeTab, setActiveTab] = useState('bookmarks');

  // Stats State
  const [stats, setStats] = useState({
    totalBookmarks: 0,
    totalArticlesRead: 0,
    mostReadCategory: 'None',
    memberSince: 'Recent'
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [selectedCats, setSelectedCats] = useState(user?.favoriteCategories || []);
  const [savingProfile, setSavingProfile] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/user/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
        setHistory(res.data.readingHistory || []);
        if (res.data.user) {
          setName(res.data.user.name);
          setSelectedCats(res.data.user.favoriteCategories || []);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update profile handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSuccessMsg('');
    setErrorMsg('');

    const res = await updateProfile(name, selectedCats);
    if (res.success) {
      setSuccessMsg('Profile settings updated successfully!');
      loadDashboardData(); // Refresh stats/categories
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.message || 'Failed to save settings');
    }
    setSavingProfile(false);
  };

  const handleCategoryToggle = (cat) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your reading history?')) return;

    try {
      const res = await api.delete('/api/user/history');
      if (res.data.success) {
        setHistory([]);
        setStats(prev => ({
          ...prev,
          totalArticlesRead: 0,
          mostReadCategory: 'None'
        }));
      }
    } catch (err) {
      console.error('Failed to clear reading history:', err);
      alert('Error clearing reading history');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Reader Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-none">
            Welcome back, {user?.name || 'Reader'}!
          </h1>
          <p className="text-xs text-blue-100/80 font-light flex items-center pt-2">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>Member since {stats.memberSince}</span>
          </p>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Bookmarks Stat */}
        <div 
          onClick={() => setActiveTab('bookmarks')}
          className={`border p-5 rounded-2xl shadow-sm text-center cursor-pointer transition select-none ${
            activeTab === 'bookmarks'
              ? 'bg-blue-50/50 border-blue-200 dark:bg-zinc-800/40 dark:border-zinc-700'
              : 'bg-white border-gray-100 hover:bg-gray-50/60 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800/40'
          }`}
        >
          <Bookmark className="h-5 w-5 mx-auto text-blue-500 mb-2" />
          <div className="text-xl sm:text-2xl font-serif font-black dark:text-white">{stats.totalBookmarks}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1">Bookmarks</div>
        </div>

        {/* Read History Count Stat */}
        <div 
          onClick={() => setActiveTab('history')}
          className={`border p-5 rounded-2xl shadow-sm text-center cursor-pointer transition select-none ${
            activeTab === 'history'
              ? 'bg-blue-50/50 border-blue-200 dark:bg-zinc-800/40 dark:border-zinc-700'
              : 'bg-white border-gray-100 hover:bg-gray-50/60 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800/40'
          }`}
        >
          <BookOpen className="h-5 w-5 mx-auto text-green-500 mb-2" />
          <div className="text-xl sm:text-2xl font-serif font-black dark:text-white">{stats.totalArticlesRead}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1">Articles Read</div>
        </div>

        {/* Favorite Category Stat */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm text-center col-span-2">
          <Award className="h-5 w-5 mx-auto text-yellow-500 mb-2" />
          <div className="text-sm sm:text-base font-bold dark:text-white truncate px-2">
            {stats.mostReadCategory}
          </div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-2.5">Most Read Topic</div>
        </div>

      </div>

      {/* Main Tab System Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tab Selection Column */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-zinc-800 pb-4 lg:pb-0 lg:pr-6 whitespace-nowrap overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center justify-center lg:justify-start space-x-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'bookmarks'
                ? 'bg-blue-50 dark:bg-zinc-800 text-brand dark:text-blue-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Bookmark className="h-4.5 w-4.5" />
            <span>Saved Bookmarks</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center lg:justify-start space-x-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'history'
                ? 'bg-blue-50 dark:bg-zinc-800 text-brand dark:text-blue-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/60'
            }`}
          >
            <History className="h-4.5 w-4.5" />
            <span>Reading History</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-center lg:justify-start space-x-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-blue-50 dark:bg-zinc-800 text-brand dark:text-blue-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Tab Body Column */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            
            {/* BOOKMARKS TAB */}
            {activeTab === 'bookmarks' && (
              <motion.div
                key="bookmarks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-base font-serif font-bold dark:text-white">Saved Articles</h3>
                  <span className="text-xs text-gray-400">{user?.bookmarks?.length || 0} saved</span>
                </div>

                {!user?.bookmarks || user.bookmarks.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50/50 dark:bg-zinc-900/10 border border-dashed rounded-2xl border-gray-200 dark:border-zinc-800">
                    <Bookmark className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-gray-700 dark:text-zinc-300">No bookmarks saved</h4>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                      Articles you bookmark will be stored here for offline/reading access later.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.bookmarks.map((article, idx) => (
                      <NewsCard key={article.url || idx} article={article} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* READING HISTORY TAB */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-base font-serif font-bold dark:text-white">Recent Activities</h3>
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="flex items-center space-x-1 text-xs text-red-500 hover:text-red-600 font-semibold hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Clear Log</span>
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50/50 dark:bg-zinc-900/10 border border-dashed rounded-2xl border-gray-200 dark:border-zinc-800">
                    <History className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-gray-700 dark:text-zinc-300">No reading logs</h4>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                      Articles you explore on Apna News will automatically record view activity logs.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    {history.map((item) => {
                      const itemPath = `/article?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}&category=${encodeURIComponent(item.category || 'general')}&urlToImage=${encodeURIComponent(item.urlToImage || '')}`;
                      return (
                        <div
                          key={item._id}
                          className="flex justify-between items-center p-4 border-b border-gray-50 dark:border-zinc-800/80 last:border-0 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition"
                        >
                          <div className="min-w-0 pr-4">
                            <Link
                              to={itemPath}
                              className="text-sm font-medium text-gray-800 dark:text-zinc-200 hover:text-brand line-clamp-1"
                            >
                              {item.title}
                            </Link>
                            <span className="inline-block mt-1 text-[9px] px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 font-bold uppercase rounded-md">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 whitespace-nowrap">
                            {new Date(item.readAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <h3 className="text-base font-serif font-bold dark:text-white border-b pb-3 border-gray-50 dark:border-zinc-800">
                  Profile & Preferences
                </h3>

                {successMsg && (
                  <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 text-green-600 dark:text-green-400 p-3.5 rounded-xl text-xs font-semibold">
                    <Check className="h-4 w-4" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 dark:text-zinc-300 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2.5 border dark:border-zinc-800 dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:border-brand text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Favorite Categories checklist */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-600 dark:text-zinc-300 uppercase tracking-wider flex items-center">
                      <Tag className="h-4 w-4 mr-1.5" />
                      <span>Preferred Categories</span>
                    </label>
                    <p className="text-[11px] text-gray-400 font-light italic">
                      Select categories to train Apna News algorithms for personalized recommendations.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {availableCategories.map((cat) => {
                        const isSelected = selectedCats.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => handleCategoryToggle(cat)}
                            className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border transition ${
                              isSelected
                                ? 'bg-blue-50 border-blue-200 text-brand dark:bg-zinc-800 dark:border-zinc-700 dark:text-blue-400 font-semibold'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                            }`}
                          >
                            <span className="capitalize">{cat}</span>
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-55"
                  >
                    {savingProfile ? 'Saving Settings...' : 'Save Settings'}
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
