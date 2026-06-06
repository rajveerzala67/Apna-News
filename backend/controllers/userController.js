import User from '../models/User.js';
import ReadingHistory from '../models/ReadingHistory.js';
import { readMockDB } from '../config/db.js';

// @desc    Get user dashboard stats & details
// @route   GET /api/user/dashboard
// @access  Private
export const getUserDashboard = async (req, res) => {
  try {
    let bookmarks = [];
    let readingHistory = [];
    let name = '';
    let email = '';
    let favoriteCategories = [];
    let createdAt = '';

    if (global.isMockDB) {
      const db = readMockDB();
      const user = db.users.find(u => u._id === req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      name = user.name;
      email = user.email;
      favoriteCategories = user.favoriteCategories || [];
      bookmarks = user.bookmarks || [];
      createdAt = user.createdAt;

      // Fetch reading history from JSON DB
      readingHistory = db.readingHistory
        .filter(h => h.user === req.user._id)
        .sort((a, b) => new Date(b.readAt) - new Date(a.readAt));
    } else {
      // Mongoose Flow
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      name = user.name;
      email = user.email;
      favoriteCategories = user.favoriteCategories || [];
      bookmarks = user.bookmarks || [];
      createdAt = user.createdAt;

      readingHistory = await ReadingHistory.find({ user: req.user._id })
        .sort({ readAt: -1 });
    }

    // Calculate user reading statistics
    const totalRead = readingHistory.length;
    const categoryCounts = {};
    readingHistory.forEach(h => {
      categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
    });

    let topCategory = 'None';
    let maxCount = 0;
    Object.keys(categoryCounts).forEach(cat => {
      if (categoryCounts[cat] > maxCount) {
        maxCount = categoryCounts[cat];
        topCategory = cat;
      }
    });

    return res.json({
      success: true,
      stats: {
        totalBookmarks: bookmarks.length,
        totalArticlesRead: totalRead,
        mostReadCategory: topCategory.charAt(0).toUpperCase() + topCategory.slice(1),
        memberSince: new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      },
      user: {
        name,
        email,
        favoriteCategories,
        bookmarks
      },
      readingHistory: readingHistory.slice(0, 50) // Limit history items
    });
  } catch (error) {
    console.error('Failed to load user dashboard data:', error);
    res.status(500).json({ success: false, message: 'Server error loading dashboard' });
  }
};

// @desc    Clear user reading history
// @route   DELETE /api/user/history
// @access  Private
export const clearReadingHistory = async (req, res) => {
  try {
    if (global.isMockDB) {
      const db = readMockDB();
      db.readingHistory = db.readingHistory.filter(h => h.user !== req.user._id);
      writeMockDB(db);
    } else {
      await ReadingHistory.deleteMany({ user: req.user._id });
    }

    return res.json({ success: true, message: 'Reading history cleared successfully' });
  } catch (error) {
    console.error('Failed to clear history:', error);
    res.status(500).json({ success: false, message: 'Server error clearing history' });
  }
};
