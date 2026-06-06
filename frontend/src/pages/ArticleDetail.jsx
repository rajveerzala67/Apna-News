import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import { Bookmark, Share2, Calendar, User, ArrowLeft, Bot, Sparkles, ExternalLink, MessageSquareText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArticleDetail() {
  const { toggleBookmark, isBookmarked, user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Extract parameters passed in URL
  const url = searchParams.get('url');
  const title = searchParams.get('title');
  const category = searchParams.get('category') || 'general';

  const [articleDetails, setArticleDetails] = useState({
    title,
    url,
    category,
    source: { name: 'Editorial Desk' },
    author: 'Staff Correspondent',
    publishedAt: new Date().toISOString(),
    description: '',
    content: ''
  });

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const bookmarked = isBookmarked(url);

  // 1. Fetch related articles & log reading history on mount
  useEffect(() => {
    if (!url) return;
    
    const initializeReadingRoom = async () => {
      try {
        setLoading(true);
        // Log reading activity to backend
        await api.post('/api/news/read', {
          title,
          url,
          category
        });

        // Search in live headlines/search to find complete article details if possible
        const searchRes = await api.get(`/api/news/search?q=${encodeURIComponent(title.split(' ').slice(0, 3).join(' '))}`);
        if (searchRes.data.success && searchRes.data.articles) {
          const exactMatch = searchRes.data.articles.find(a => a.url === url);
          if (exactMatch) {
            setArticleDetails(exactMatch);
          } else if (searchRes.data.articles[0]) {
            // Fallback: merge first match details
            setArticleDetails(prev => ({
              ...prev,
              ...searchRes.data.articles[0],
              title,
              url,
              category
            }));
          }
        }
      } catch (err) {
        console.warn('Could not retrieve detailed article info:', err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        setLoadingRelated(true);
        const res = await api.get(`/api/news/related?category=${category}&title=${encodeURIComponent(title)}`);
        if (res.data.success && res.data.articles) {
          setRelated(res.data.articles.slice(0, 4));
        }
      } catch (err) {
        console.warn('Failed to load related articles:', err.message);
      } finally {
        setLoadingRelated(false);
      }
    };

    initializeReadingRoom();
    fetchRelated();
    
    // Reset summary when article URL changes
    setSummary('');
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [url, title, category]);

  // 2. Trigger AI Summarization
  const handleGenerateSummary = async () => {
    if (summary) return; // Already loaded

    try {
      setLoadingSummary(true);
      const res = await api.post('/api/news/summarize', {
        title: articleDetails.title,
        content: articleDetails.content || articleDetails.description,
        url: articleDetails.url
      });
      if (res.data.success) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Summary generation failed:', err);
      setSummary('Failed to generate summary. The service may be temporarily offline.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = async () => {
    await toggleBookmark(articleDetails);
  };

  const { description, content, urlToImage, source, author, publishedAt } = articleDetails;
  
  const imageSrc = urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back navigation */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-blue-400 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Front Page</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Article Content */}
        <article className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-brand/10 text-brand dark:bg-blue-950/40 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase rounded-full">
              {category}
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black leading-tight text-gray-900 dark:text-white">
              {title}
            </h1>

            {/* Author, Publisher details */}
            <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 py-3 border-y border-gray-100 dark:border-zinc-800 gap-4 sm:gap-6">
              <div className="flex items-center space-x-1.5">
                <User className="h-4 w-4 text-brand dark:text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-zinc-300">{author || 'Correspondent'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4" />
                <span>{new Date(publishedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-zinc-500 uppercase">
                Source: {source?.name || 'Reuters'}
              </div>
            </div>
          </div>

          {/* Large cover image */}
          <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100 dark:bg-zinc-800 shadow-sm border dark:border-zinc-800">
            <img
              src={imageSrc}
              alt={title}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop';
              }}
            />
          </div>

          {/* AI Executive Summary Panel */}
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/20 dark:from-zinc-900/60 dark:to-zinc-900/20 border border-blue-100/60 dark:border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-brand dark:text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200 font-sans flex items-center">
                  <span>AI Executive Summary</span>
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500 ml-1 fill-yellow-500 animate-pulse" />
                </h3>
              </div>
              {!summary && !loadingSummary && (
                <button
                  onClick={handleGenerateSummary}
                  className="px-4 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-full text-xs font-semibold shadow transition-all duration-200"
                >
                  Generate Summary
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {loadingSummary && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2.5 py-4 animate-pulse"
                >
                  <div className="w-full h-4 bg-blue-100/50 dark:bg-zinc-800 rounded-md"></div>
                  <div className="w-5/6 h-4 bg-blue-100/50 dark:bg-zinc-800 rounded-md"></div>
                  <div className="w-4/5 h-4 bg-blue-100/50 dark:bg-zinc-800 rounded-md"></div>
                </motion.div>
              )}

              {summary && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed font-light whitespace-pre-line border-l-2 border-brand/40 pl-4 py-1"
                >
                  {summary}
                </motion.div>
              )}

              {!summary && !loadingSummary && (
                <motion.p className="text-xs text-gray-500 dark:text-gray-400 font-light italic">
                  Apna News uses advanced natural language engines to parse context. Click generate above to extract bullet points summarizing this coverage.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Article Text Content */}
          <div className="text-gray-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed space-y-6 font-light">
            <p className="font-medium text-gray-900 dark:text-white first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-brand first-letter:mr-3 first-letter:float-left">
              {description || 'No summary excerpt is logged for this dispatch. Please use the original publishing link at the bottom of the section to access full coverage records.'}
            </p>
            {content ? (
              <p>{content.replace(/\[\+\d+ chars\]/, 'Continuing analysis captures complex local and international responses, with full administrative briefs scheduled for next week.')}</p>
            ) : (
              <p>Detailed reports trace local structural dynamics, political developments, and societal impacts. Investigative reviews emphasize that initial estimations are receiving updates as central ministries compile seasonal indices. Analysts continue to cross-reference multiple agency statements to verify structural timelines.</p>
            )}
            <p>Our global correspondence team maintains active files. For historical data, comparative analysis tables, and source credentials, please consult the original agency link below.</p>
          </div>

          {/* Editorial CTA */}
          <div className="pt-8 border-t border-gray-100 dark:border-zinc-800">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold shadow-md transition text-center"
            >
              <span>Read Original Story on {source?.name || 'Publisher'}</span>
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
            </a>
          </div>
        </article>

        {/* Sidebar Actions & Related Coverage */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200 border-b border-gray-100 dark:border-zinc-800 pb-3 font-sans">
              Story Actions
            </h3>
            
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleBookmark}
                className={`flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl border text-xs font-semibold transition ${
                  bookmarked
                    ? 'bg-blue-50 border-blue-200 text-brand dark:bg-zinc-800 dark:border-zinc-700 dark:text-blue-400'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-800'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                <span>{bookmarked ? 'Remove Bookmark' : 'Bookmark Story'}</span>
              </button>

              <button
                onClick={handleShare}
                className={`flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl border text-xs font-semibold transition ${
                  copied
                    ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-400'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-800'
                }`}
              >
                {copied ? (
                  <>
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span>Copy Article Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Related Articles Widget */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-200 border-b border-gray-100 dark:border-zinc-800 pb-3 mb-4 flex items-center">
              <MessageSquareText className="h-4 w-4 mr-2 text-brand dark:text-blue-400" />
              <span>Related Coverage</span>
            </h3>

            {loadingRelated ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-14 h-14 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
                    <div className="flex-1 space-y-1.5 py-1">
                      <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                      <div className="w-2/3 h-3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : related.length === 0 ? (
              <p className="text-xs text-gray-400 font-light italic">No matching related coverage files found.</p>
            ) : (
              <div className="space-y-4">
                {related.map((a, idx) => {
                  const itemPath = `/article?url=${encodeURIComponent(a.url)}&title=${encodeURIComponent(a.title)}&category=${encodeURIComponent(a.category || 'general')}`;
                  return (
                    <div key={idx} className="flex space-x-3.5 pb-4 border-b border-gray-100 dark:border-zinc-800 last:border-0 last:pb-0 last:mb-0">
                      {a.urlToImage && (
                        <Link to={itemPath} className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border">
                          <img
                            src={a.urlToImage}
                            alt={a.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&auto=format&fit=crop';
                            }}
                          />
                        </Link>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={itemPath}
                          className="text-xs font-serif font-bold text-gray-900 dark:text-white hover:text-brand line-clamp-2 leading-snug"
                        >
                          {a.title}
                        </Link>
                        <span className="text-[9px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mt-1">
                          {a.source?.name || 'News Wire'}
                        </span>
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
  );
}
