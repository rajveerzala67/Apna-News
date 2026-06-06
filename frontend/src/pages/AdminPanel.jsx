import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { ShieldAlert, Users, Bookmark, Search, Award, Eye, Trash2, ArrowUpCircle, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookmarks: 0,
    popularCategories: [],
    trendingSearches: [],
    topArticles: []
  });
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const statsRes = await api.get('/api/admin/stats');
      const usersRes = await api.get('/api/admin/users');

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }
    } catch (err) {
      console.error('Failed to load admin panel details:', err);
      setErrorMsg(err.response?.data?.message || 'Access denied or server error loading administration desk.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) return;

    try {
      const res = await api.put(`/api/admin/users/${userId}/role`, { role: nextRole });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        loadAdminData(); // Refresh tables
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Role promotion failed');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Are you sure you want to delete this user profile? This action will purge all their bookmarks and history.')) return;

    try {
      const res = await api.delete(`/api/admin/users/${userId}`);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        loadAdminData(); // Refresh registry
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Delete operation failed');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand"></div>
      </div>
    );
  }

  if (errorMsg && stats.totalUsers === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-zinc-200">Access Restricted</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1">{errorMsg}</p>
      </div>
    );
  }

  // Calculate highest click count for visual scaling
  const maxCatCount = stats.popularCategories[0]?.count || 1;
  const maxSearchCount = stats.trendingSearches[0]?.count || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-5 mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight uppercase dark:text-white flex items-center">
          <ShieldAlert className="h-8 w-8 mr-3 text-red-600" />
          <span>Admin Control Room</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light mt-1">
          System analytics overview, search tracking indices, and user registry administration.
        </p>
      </div>

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

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Users */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-blue-50 dark:bg-zinc-800 rounded-xl text-brand">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-black dark:text-white">{stats.totalUsers}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Accounts</div>
          </div>
        </div>

        {/* Total Bookmarks */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-zinc-800 rounded-xl text-indigo-500">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-black dark:text-white">{stats.totalBookmarks}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Saved Bookmarks</div>
          </div>
        </div>

        {/* Trending Search Term */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-red-50 dark:bg-zinc-800 rounded-xl text-red-500">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold dark:text-white truncate max-w-[180px]">
              "{stats.trendingSearches[0]?.term || 'None'}"
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1">Top Query</div>
          </div>
        </div>

      </div>

      {/* Analytics widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category breakdown bar meters */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200 border-b border-gray-50 dark:border-zinc-800 pb-3 flex items-center">
            <Award className="h-4.5 w-4.5 mr-2 text-brand" />
            <span>Category Click Indices</span>
          </h3>

          <div className="space-y-4">
            {stats.popularCategories.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700 dark:text-zinc-300">{item.category}</span>
                  <span className="text-gray-400">{item.count} hits</span>
                </div>
                <div className="w-full bg-gray-50 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-300"
                    style={{ width: `${(item.count / maxCatCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Term trends breakdown */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200 border-b border-gray-50 dark:border-zinc-800 pb-3 flex items-center">
            <Search className="h-4.5 w-4.5 mr-2 text-brand" />
            <span>Search Term Popularity</span>
          </h3>

          <div className="space-y-4">
            {stats.trendingSearches.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700 dark:text-zinc-300 font-mono"># {item.term}</span>
                  <span className="text-gray-400">{item.count} queries</span>
                </div>
                <div className="w-full bg-gray-50 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${(item.count / maxSearchCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Viewed Articles Grid */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200 border-b border-gray-50 dark:border-zinc-800 pb-3 flex items-center">
          <Eye className="h-4.5 w-4.5 mr-2 text-brand" />
          <span>Top Viewed Coverage</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-2">Article Coverage</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2 text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {stats.topArticles.map((article, idx) => (
                <tr key={idx} className="border-b border-gray-50 dark:border-zinc-800/80 last:border-0 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition">
                  <td className="py-3 px-2 max-w-[320px] sm:max-w-[500px] truncate">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-800 dark:text-zinc-300 hover:text-brand line-clamp-1"
                    >
                      {article.title}
                    </a>
                  </td>
                  <td className="py-3 px-2">
                    <span className="inline-block px-2.5 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 font-bold uppercase rounded-md text-[9px]">
                      {article.category}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-gray-800 dark:text-white">
                    {article.views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User registry administration table */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200 border-b border-gray-50 dark:border-zinc-800 pb-3 flex items-center">
          <Users className="h-4.5 w-4.5 mr-2 text-brand" />
          <span>User Registry & Access</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-2">User details</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Saved</th>
                <th className="py-3 px-2">Registered</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userReg) => (
                <tr key={userReg.id} className="border-b border-gray-50 dark:border-zinc-800/80 last:border-0 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition">
                  <td className="py-3 px-2 font-medium text-gray-800 dark:text-zinc-300">
                    {userReg.name}
                  </td>
                  <td className="py-3 px-2 text-gray-500 dark:text-zinc-400">
                    {userReg.email}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      userReg.role === 'admin'
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                        : 'bg-blue-50 text-brand dark:bg-blue-950/20 dark:text-blue-400'
                    }`}>
                      {userReg.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-500">
                    {userReg.bookmarksCount} items
                  </td>
                  <td className="py-3 px-2 text-gray-400">
                    {new Date(userReg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <button
                      onClick={() => handleRoleChange(userReg.id, userReg.role)}
                      className="p-1 text-gray-400 hover:text-brand transition"
                      title={userReg.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    >
                      <ArrowUpCircle className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(userReg.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition"
                      title="Delete user profile"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
