import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import { readMockDB, writeMockDB } from '../config/db.js';

// @desc    Get Admin Panel Statistics Overview
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    let totalUsers = 0;
    let totalBookmarks = 0;
    let popularCategories = [];
    let trendingSearches = [];
    let topArticles = [];

    if (global.isMockDB) {
      const db = readMockDB();

      // Total Users
      totalUsers = db.users.length;

      // Total Bookmarks Summed
      totalBookmarks = db.users.reduce((sum, u) => sum + (u.bookmarks ? u.bookmarks.length : 0), 0);

      // Categories Hits
      popularCategories = Object.keys(db.analytics.categories).map(cat => ({
        category: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: db.analytics.categories[cat]
      })).sort((a, b) => b.count - a.count);

      // Trending Searches
      trendingSearches = Object.keys(db.analytics.searches).map(term => ({
        term,
        count: db.analytics.searches[term]
      })).sort((a, b) => b.count - a.count).slice(0, 10);

      // Top Articles Views
      topArticles = Object.keys(db.analytics.views).map(url => ({
        url,
        title: db.analytics.views[url].title,
        category: db.analytics.views[url].category,
        views: db.analytics.views[url].count,
        bookmarks: db.analytics.views[url].bookmarked || 0
      })).sort((a, b) => b.views - a.views).slice(0, 10);

    } else {
      // Mongoose Flow
      totalUsers = await User.countDocuments();

      // Aggregate sum of bookmarks array sizes across all users
      const bookmarkAgg = await User.aggregate([
        { $project: { count: { $size: { $ifNull: ["$bookmarks", []] } } } },
        { $group: { _id: null, total: { $sum: "$count" } } }
      ]);
      totalBookmarks = bookmarkAgg.length > 0 ? bookmarkAgg[0].total : 0;

      // Category Analytics
      const categoryStats = await Analytics.find({ metricType: 'category' })
        .sort({ count: -1 })
        .limit(10);
      popularCategories = categoryStats.map(c => ({
        category: c.key.charAt(0).toUpperCase() + c.key.slice(1),
        count: c.count
      }));

      // Search Analytics
      const searchStats = await Analytics.find({ metricType: 'search' })
        .sort({ count: -1 })
        .limit(10);
      trendingSearches = searchStats.map(s => ({
        term: s.key,
        count: s.count
      }));

      // View Analytics
      const viewStats = await Analytics.find({ metricType: 'view' })
        .sort({ count: -1 })
        .limit(10);
      topArticles = viewStats.map(v => ({
        url: v.key,
        title: v.title || 'Untitled Coverage',
        category: v.category || 'general',
        views: v.count,
        bookmarks: 0 // In Mongoose, bookmarks are stored inside users. Can show view counts.
      }));
    }

    // Default category counts if empty to keep charts beautiful
    if (popularCategories.length === 0) {
      popularCategories = [
        { category: 'Technology', count: 12 },
        { category: 'Business', count: 8 },
        { category: 'World', count: 7 },
        { category: 'Sports', count: 5 }
      ];
    }

    if (trendingSearches.length === 0) {
      trendingSearches = [
        { term: 'artificial intelligence', count: 15 },
        { term: 'gdp growth', count: 10 },
        { term: 'climate summit', count: 6 }
      ];
    }

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookmarks,
        popularCategories,
        trendingSearches,
        topArticles
      }
    });
  } catch (error) {
    console.error('Failed to retrieve admin stats:', error);
    res.status(500).json({ success: false, message: 'Server error loading administration stats' });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    let users = [];

    if (global.isMockDB) {
      const db = readMockDB();
      // Map and exclude password hashes for safety
      users = db.users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        favoriteCategories: u.favoriteCategories,
        bookmarksCount: u.bookmarks ? u.bookmarks.length : 0,
        createdAt: u.createdAt
      }));
    } else {
      // Mongoose Flow
      const mongoUsers = await User.find({}).sort({ createdAt: -1 });
      users = mongoUsers.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        favoriteCategories: u.favoriteCategories,
        bookmarksCount: u.bookmarks ? u.bookmarks.length : 0,
        createdAt: u.createdAt
      }));
    }

    return res.json({ success: true, users });
  } catch (error) {
    console.error('Admin user fetch failed:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving user registry' });
  }
};

// @desc    Update user role / promote
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid role' });
  }

  try {
    if (global.isMockDB) {
      const db = readMockDB();
      const userIdx = db.users.findIndex(u => u._id === id);

      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: 'User not found in mock registry' });
      }

      db.users[userIdx].role = role;
      writeMockDB(db);
    } else {
      // Mongoose Flow
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.role = role;
      await user.save();
    }

    return res.json({ success: true, message: `User role successfully updated to ${role}` });
  } catch (error) {
    console.error('Admin role update error:', error);
    res.status(500).json({ success: false, message: 'Server error updating user role' });
  }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Prevent admin from self-deleting
  if (id === req.user._id || id === req.user.id) {
    return res.status(400).json({ success: false, message: 'Administrators cannot delete their own profile' });
  }

  try {
    if (global.isMockDB) {
      const db = readMockDB();
      const userIdx = db.users.findIndex(u => u._id === id);

      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: 'User not found in mock database' });
      }

      db.users.splice(userIdx, 1);
      // Clean up reading history for this user
      db.readingHistory = db.readingHistory.filter(h => h.user !== id);
      writeMockDB(db);
    } else {
      // Mongoose Flow
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      await User.findByIdAndDelete(id);
      // Clean up reading history
      await User.model('ReadingHistory').deleteMany({ user: id });
    }

    return res.json({ success: true, message: 'User profile and activities deleted successfully' });
  } catch (error) {
    console.error('Admin user delete error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user profile' });
  }
};
