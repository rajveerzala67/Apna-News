import express from 'express';
import {
  getHeadlines,
  searchNews,
  logReadArticle,
  getPersonalizedFeed,
  getArticleSummary,
  getRelatedArticles,
  toggleBookmark
} from '../controllers/newsController.js';
import { protect, permissiveAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/headlines', getHeadlines);
router.get('/search', searchNews);
router.post('/read', permissiveAuth, logReadArticle);
router.get('/personalized', protect, getPersonalizedFeed);
router.post('/summarize', getArticleSummary);
router.get('/related', getRelatedArticles);
router.post('/bookmark', protect, toggleBookmark);

export default router;
