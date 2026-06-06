import React, { useEffect, useState } from 'react';
import { api } from '../../context/AuthContext';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LiveNewsTicker() {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const fetchTickerHeadlines = async () => {
      try {
        const res = await api.get('/api/news/headlines?pageSize=6');
        if (res.data.success && res.data.articles) {
          setHeadlines(res.data.articles.slice(0, 6));
        }
      } catch (error) {
        console.warn('Ticker headline fetch failed, using default messages:', error.message);
        // Default bulletins
        setHeadlines([
          { title: 'Apna News launches new MERN-stack aggregation platform.' },
          { title: 'Global climate pact targets carbon reductions across major hubs by 2030.' },
          { title: 'Bipartisan transit bill passes senate, funds high-speed bullet trains.' },
          { title: 'Biotech breakthroughs open new clinical trials for gene therapy cures.' }
        ]);
      }
    };

    fetchTickerHeadlines();
  }, []);

  if (headlines.length === 0) return null;

  return (
    <div className="bg-red-600 text-white text-xs font-semibold py-1.5 flex items-center shadow-md select-none border-b border-red-700">
      {/* Ticker Title Badge */}
      <div className="flex items-center space-x-1 px-4 bg-red-700 z-10 font-bold border-r border-red-500 uppercase h-full whitespace-nowrap">
        <Flame className="h-3.5 w-3.5 fill-white animate-pulse" />
        <span>Breaking</span>
      </div>

      {/* Marquee Wrapper */}
      <div className="ticker-wrap flex-1 relative flex items-center">
        <div className="ticker-content">
          {headlines.map((h, index) => (
            <span key={index} className="inline-flex items-center mx-10 text-white hover:text-red-100 transition">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-2.5 inline-block"></span>
              {h.url ? (
                <Link to={`/article?url=${encodeURIComponent(h.url)}&title=${encodeURIComponent(h.title)}&category=${encodeURIComponent(h.category || 'general')}`}>
                  {h.title}
                </Link>
              ) : (
                <span>{h.title}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
