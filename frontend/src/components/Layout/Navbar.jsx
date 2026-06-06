import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Sun, Moon, LogOut, User, ShieldAlert, Menu, X } from 'lucide-react';

const categories = [
  { name: 'All', path: '/' },
  { name: 'Technology', path: '/?category=technology' },
  { name: 'Business', path: '/?category=business' },
  { name: 'Sports', path: '/?category=sports' },
  { name: 'Entertainment', path: '/?category=entertainment' },
  { name: 'Health', path: '/?category=health' },
  { name: 'Science', path: '/?category=science' },
  { name: 'Politics', path: '/?category=politics' },
  { name: 'World News', path: '/?category=world' }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActiveCategory = (catPath) => {
    // Exact home matching
    if (catPath === '/' && location.pathname === '/' && !location.search) return true;
    
    // Category query parameters matching
    if (catPath !== '/') {
      const catQuery = catPath.split('=')[1];
      const params = new URLSearchParams(location.search);
      return location.pathname === '/' && params.get('category') === catQuery;
    }
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 glassmorphism shadow-sm border-b transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-col select-none">
              <span className="text-2xl sm:text-3xl font-serif font-black tracking-tight uppercase leading-none dark:text-white">
                Apna News
              </span>
              <span className="text-[10px] tracking-[0.25em] font-sans font-bold text-brand uppercase text-right leading-none mt-1 sm:mt-1.5">
                The Daily Journal
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search headlines, topics, or sources..."
                className="w-full pl-10 pr-4 py-1.5 bg-gray-100 dark:bg-zinc-800 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-gray-300 dark:focus:bg-zinc-900 dark:focus:border-zinc-700 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* Right-side Utilities */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-yellow-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold rounded-lg text-xs transition border border-red-200/50 dark:border-red-900/50"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-brand-dark dark:text-gray-200 font-medium rounded-lg text-xs transition border border-blue-200/50 dark:border-zinc-700"
                >
                  <User className="h-4 w-4 text-brand dark:text-gray-400" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-brand font-medium text-sm transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-brand text-white hover:bg-brand-dark rounded-full text-sm font-medium transition shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Scrollbar (Secondary Navbar layer) */}
      <div className="border-t border-gray-200/60 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 overflow-x-auto whitespace-nowrap scrollbar-hide py-2 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 text-xs sm:text-sm font-medium">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className={`pb-1 border-b-2 transition-all duration-150 ${
                isActiveCategory(cat.path)
                  ? 'border-brand text-brand font-bold dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden glassmorphism border-b px-4 pt-2 pb-6 space-y-4 transition-all duration-200">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-transparent rounded-full focus:outline-none focus:bg-white text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          </form>

          {user ? (
            <div className="space-y-3 pt-2">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold"
                >
                  <ShieldAlert className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 bg-blue-50 dark:bg-zinc-800 text-brand-dark dark:text-white rounded-xl text-sm font-medium"
              >
                <User className="h-5 w-5 text-brand" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 p-2.5 text-gray-600 dark:text-gray-300 w-full hover:text-red-500 text-sm font-medium rounded-xl"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2.5 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center p-2.5 text-center text-gray-700 dark:text-gray-300 hover:text-brand font-semibold border rounded-full text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center p-2.5 text-center bg-brand text-white hover:bg-brand-dark rounded-full text-sm font-semibold shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
