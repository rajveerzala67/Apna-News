import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 py-12 transition-colors duration-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Description */}
        <div className="space-y-4 col-span-1 md:col-span-2">
          <Link to="/" className="flex flex-col select-none max-w-max">
            <span className="text-xl font-serif font-black tracking-tight uppercase dark:text-white">
              Apna News
            </span>
            <span className="text-[9px] tracking-[0.25em] font-sans font-bold text-brand uppercase mt-0.5">
              The Daily Journal
            </span>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm font-light leading-relaxed">
            Apna News aggregates real-time journalism from trusted global agencies to deliver politics, technology, business, entertainment, and science updates. Supported by custom AI-powered executive article summaries.
          </p>
        </div>

        {/* Categories Directory */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-4 font-sans">
            Categories
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/?category=technology" className="text-gray-500 dark:text-gray-400 hover:text-brand transition">
                Technology
              </Link>
            </li>
            <li>
              <Link to="/?category=business" className="text-gray-500 dark:text-gray-400 hover:text-brand transition">
                Business & Economy
              </Link>
            </li>
            <li>
              <Link to="/?category=sports" className="text-gray-500 dark:text-gray-400 hover:text-brand transition">
                Sports
              </Link>
            </li>
            <li>
              <Link to="/?category=science" className="text-gray-500 dark:text-gray-400 hover:text-brand transition">
                Science & Research
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-4 font-sans">
            Personalization
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-brand transition">
                User Dashboard
              </Link>
            </li>
            <li>
              <Link to="/trending" className="text-gray-500 dark:text-gray-400 hover:text-brand transition">
                Trending Stories
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-gray-500 dark:text-gray-400 hover:text-brand transition">
                Advanced News Search
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-zinc-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 font-light space-y-3 sm:space-y-0">
        <div>
          &copy; {new Date().getFullYear()} Apna News. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <span className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Terms of Service</span>
          <span className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Contact Desk</span>
        </div>
      </div>
    </footer>
  );
}
