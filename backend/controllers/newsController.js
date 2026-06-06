import axios from 'axios';
import { getMockNews } from '../utils/mockNews.js';
import { generateSummary } from '../utils/summarizer.js';
import User from '../models/User.js';
import ReadingHistory from '../models/ReadingHistory.js';
import Analytics from '../models/Analytics.js';
import { readMockDB, writeMockDB } from '../config/db.js';

// Helper to log search terms into Analytics
const logSearchTerm = async (term) => {
  if (!term || term.trim().length < 2) return;
  const cleanTerm = term.trim().toLowerCase();

  try {
    if (global.isMockDB) {
      const db = readMockDB();
      db.analytics.searches[cleanTerm] = (db.analytics.searches[cleanTerm] || 0) + 1;
      writeMockDB(db);
    } else {
      await Analytics.findOneAndUpdate(
        { metricType: 'search', key: cleanTerm },
        { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Failed to log search term:', error.message);
  }
};

// Helper to log category views
const logCategoryClick = async (category) => {
  if (!category || category === 'general') return;
  const cleanCat = category.toLowerCase();

  try {
    if (global.isMockDB) {
      const db = readMockDB();
      db.analytics.categories[cleanCat] = (db.analytics.categories[cleanCat] || 0) + 1;
      writeMockDB(db);
    } else {
      await Analytics.findOneAndUpdate(
        { metricType: 'category', key: cleanCat },
        { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Failed to log category click:', error.message);
  }
};

// Helper to log article views
const logArticleView = async (url, title, category) => {
  if (!url) return;
  try {
    if (global.isMockDB) {
      const db = readMockDB();
      db.analytics.views[url] = {
        count: (db.analytics.views[url]?.count || 0) + 1,
        title: title || 'News Article',
        category: category || 'general',
        updatedAt: new Date().toISOString()
      };
      writeMockDB(db);
    } else {
      await Analytics.findOneAndUpdate(
        { metricType: 'view', key: url },
        { 
          $inc: { count: 1 }, 
          $set: { title, category, updatedAt: new Date() } 
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Failed to log article view:', error.message);
  }
};

// @desc    Get top breaking news headlines
// @route   GET /api/news/headlines
// @access  Public
export const getHeadlines = async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;
  const { category = 'general', country = 'in', search = '', sortBy = 'publishedAt' } = req.query;

  // Track category clicks
  if (category) {
    logCategoryClick(category);
  }

  // If apiKey is absent, use mock news fallback
  if (!apiKey) {
    const articles = getMockNews(category, country, search, sortBy);
    return res.json({ success: true, articles });
  }

  try {
    // Call external NewsAPI
    // Map categories if needed. NewsAPI supports general, technology, business, sports, entertainment, health, science.
    // Maps world or politics to general in NewsAPI query
    let apiCat = category;
    let queryPlus = '';

    if (category === 'world') {
      apiCat = 'general';
      queryPlus = 'world';
    } else if (category === 'politics') {
      apiCat = 'general';
      queryPlus = 'politics';
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey,
        category: apiCat,
        country: country || 'in',
        q: search || queryPlus || undefined,
        pageSize: 30
      },
      timeout: 2500
    });

    return res.json({ success: true, articles: response.data.articles });
  } catch (error) {
    console.warn('NewsAPI Headlines Fetch failed. Falling back to mock articles:', error.message);
    const articles = getMockNews(category, country, search, sortBy);
    return res.json({ success: true, articles, note: 'Fetched from fallback database' });
  }
};

// @desc    Advanced search for articles
// @route   GET /api/news/search
// @access  Public
export const searchNews = async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;
  const { q, category, country, author, from, to, sortBy = 'publishedAt' } = req.query;

  if (q) {
    logSearchTerm(q);
  }

  if (category) {
    logCategoryClick(category);
  }

  // Fallback if no NewsAPI key
  if (!apiKey) {
    const articles = getMockNews(category, country, q, sortBy);
    return res.json({ success: true, articles });
  }

  try {
    // Construct query parameters
    let qString = q || '';
    if (category && category !== 'general') qString += ` AND ${category}`;
    if (author) qString += ` AND author:${author}`;

    // If qString is completely empty, search for 'news'
    if (!qString.trim()) {
      qString = 'news';
    }

    const params = {
      apiKey,
      q: qString,
      sortBy: sortBy === 'latest' ? 'publishedAt' : (sortBy === 'relevancy' ? 'relevancy' : 'popularity'),
      pageSize: 40
    };

    if (from) params.from = from;
    if (to) params.to = to;

    const response = await axios.get('https://newsapi.org/v2/everything', { params, timeout: 2500 });
    let articles = response.data.articles || [];

    // Filter by country if country matches (NewsAPI /everything doesn't support country param directly, must filter in code or query)
    if (country) {
      // NewsAPI doesn't have a direct country tag in /everything, we can do keyword search or return as-is
    }

    return res.json({ success: true, articles });
  } catch (error) {
    console.warn('NewsAPI Search failed. Falling back to mock search:', error.message);
    const articles = getMockNews(category, country, q, sortBy);
    return res.json({ success: true, articles, note: 'Fetched from fallback database' });
  }
};

// @desc    Log Reading History & Track Views
// @route   POST /api/news/read
// @access  Private/Public (Optionally authenticated)
export const logReadArticle = async (req, res) => {
  const { title, url, category = 'general' } = req.body;

  if (!url || !title) {
    return res.status(400).json({ success: false, message: 'Please provide article url and title' });
  }

  // Log to general view analytics
  await logArticleView(url, title, category);

  // If user is logged in, log to their personalized history
  if (req.user) {
    try {
      if (global.isMockDB) {
        const db = readMockDB();
        const historyItem = {
          _id: 'mock_hist_' + Date.now(),
          user: req.user._id,
          title,
          url,
          category,
          readAt: new Date().toISOString()
        };
        db.readingHistory.push(historyItem);
        writeMockDB(db);
      } else {
        await ReadingHistory.create({
          user: req.user._id,
          title,
          url,
          category
        });
      }
    } catch (err) {
      console.error('Failed to save reading history:', err.message);
    }
  }

  return res.json({ success: true });
};

// @desc    Get Personalized Feed
// @route   GET /api/news/personalized
// @access  Private
export const getPersonalizedFeed = async (req, res) => {
  try {
    let favoriteCategories = [...(req.user.favoriteCategories || [])];
    let recentReadCategories = [];

    // 1. Gather recent reading categories
    if (global.isMockDB) {
      const db = readMockDB();
      const userHistory = db.readingHistory
        .filter(h => h.user === req.user._id)
        .sort((a, b) => new Date(b.readAt) - new Date(a.readAt))
        .slice(0, 15);
      
      recentReadCategories = userHistory.map(h => h.category);
    } else {
      const userHistory = await ReadingHistory.find({ user: req.user._id })
        .sort({ readAt: -1 })
        .limit(15);
      
      recentReadCategories = userHistory.map(h => h.category);
    }

    // 2. Count frequency of reading categories
    const frequency = {};
    recentReadCategories.forEach(cat => {
      frequency[cat] = (frequency[cat] || 0) + 1;
    });

    // Sort categories by reading frequency
    const sortedReadCats = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);

    // Merge explicitly selected categories and highly read categories
    const combinedCategories = Array.from(new Set([...sortedReadCats, ...favoriteCategories]));

    // If no preferences logged, choose standard default categories
    if (combinedCategories.length === 0) {
      combinedCategories.push('technology', 'business', 'world');
    }

    // 3. Fetch articles for these categories
    // We will query our mock news helper or NewsAPI
    const apiKey = process.env.NEWS_API_KEY;
    let recommendedArticles = [];

    if (!apiKey) {
      // Offline fallback: gather mock articles across preferred categories
      combinedCategories.forEach(cat => {
        const catArticles = getMockNews(cat, 'in', '', 'publishedAt').slice(0, 4);
        recommendedArticles.push(...catArticles);
      });
    } else {
      // Live feed: fetch articles from the top category or search with multiple categories
      try {
        // Query headlines for the most favorite category
        const topCat = combinedCategories[0];
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            apiKey,
            category: topCat,
            country: 'in',
            pageSize: 15
          },
          timeout: 2500
        });
        recommendedArticles = response.data.articles || [];

        // If results are small, fetch for the second category and merge
        if (recommendedArticles.length < 8 && combinedCategories[1]) {
          const secondResponse = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
              apiKey,
              category: combinedCategories[1],
              country: 'in',
              pageSize: 10
            },
            timeout: 2500
          });
          recommendedArticles.push(...(secondResponse.data.articles || []));
        }
      } catch (err) {
        console.warn('Personalized Live Fetch failed, using mock recommendation:', err.message);
        combinedCategories.forEach(cat => {
          const catArticles = getMockNews(cat, 'in', '', 'publishedAt').slice(0, 4);
          recommendedArticles.push(...catArticles);
        });
      }
    }

    // Shuffle slightly to mix categories
    recommendedArticles = recommendedArticles.sort(() => 0.5 - Math.random());

    return res.json({ success: true, categories: combinedCategories, articles: recommendedArticles });
  } catch (error) {
    console.error('Personalized feed generation failed:', error);
    res.status(500).json({ success: false, message: 'Failed to load personalized recommendations' });
  }
};

// @desc    Get AI Article Summary
// @route   POST /api/news/summarize
// @access  Public
export const getArticleSummary = async (req, res) => {
  const { title, content, url } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Please provide at least the article title' });
  }

  try {
    const summary = await generateSummary(title, content, url);
    return res.json({ success: true, summary });
  } catch (error) {
    console.error('Summary controller error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate summary' });
  }
};

// @desc    Get Related Articles
// @route   GET /api/news/related
// @access  Public
export const getRelatedArticles = async (req, res) => {
  const { category = 'general', title = '' } = req.query;

  try {
    let related = [];
    
    // Retrieve articles from mock news mapping the same category
    const articles = getMockNews(category, '', '', 'publishedAt');
    
    // Filter out the current article by comparing title keywords
    const currentKeywords = title.toLowerCase().split(/\s+/).slice(0, 3);
    
    related = articles.filter(a => {
      if (a.title === title) return false;
      
      // Match category or simple overlap
      return a.category.toLowerCase() === category.toLowerCase();
    }).slice(0, 4);

    return res.json({ success: true, articles: related });
  } catch (error) {
    console.error('Related articles search error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load related articles' });
  }
};

// @desc    Bookmark/Save Article
// @route   POST /api/news/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
  const { article } = req.body;

  if (!article || !article.title || !article.url) {
    return res.status(400).json({ success: false, message: 'Invalid article content provided' });
  }

  try {
    if (global.isMockDB) {
      const db = readMockDB();
      const userIdx = db.users.findIndex(u => u._id === req.user._id);

      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const user = db.users[userIdx];
      const bookmarkIdx = user.bookmarks.findIndex(b => b.url === article.url);

      let bookmarked = false;

      if (bookmarkIdx > -1) {
        // Remove bookmark
        user.bookmarks.splice(bookmarkIdx, 1);
      } else {
        // Add bookmark
        user.bookmarks.push({
          ...article,
          bookmarkedAt: new Date().toISOString()
        });
        bookmarked = true;
      }

      db.users[userIdx] = user;
      writeMockDB(db);

      // Increment total bookmarks analytic if bookmarked
      if (bookmarked) {
        db.analytics.views[article.url] = {
          ...(db.analytics.views[article.url] || { count: 0, title: article.title, category: article.category || 'general' }),
          bookmarked: (db.analytics.views[article.url]?.bookmarked || 0) + 1
        };
        writeMockDB(db);
      }

      return res.json({
        success: true,
        bookmarked,
        bookmarks: user.bookmarks
      });
    } else {
      // Mongoose Flow
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const bookmarkIdx = user.bookmarks.findIndex(b => b.url === article.url);
      let bookmarked = false;

      if (bookmarkIdx > -1) {
        user.bookmarks.splice(bookmarkIdx, 1);
      } else {
        user.bookmarks.push(article);
        bookmarked = true;
      }

      await user.save();

      // Update analytics
      if (bookmarked) {
        await Analytics.findOneAndUpdate(
          { metricType: 'view', key: article.url },
          { 
            $inc: { count: 1 }, 
            $set: { title: article.title, category: article.category || 'general' } 
          },
          { upsert: true }
        );
      }

      return res.json({
        success: true,
        bookmarked,
        bookmarks: user.bookmarks
      });
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle bookmark' });
  }
};
