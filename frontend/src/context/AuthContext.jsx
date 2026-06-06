import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create a custom axios instance with base URL configuration
export const api = axios.create({
  baseURL: '', // Proxied automatically in dev by Vite config
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup request interceptor to attach JWT token
  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('apna_news_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, []);

  // Fetch current user details if token exists
  const loadUser = async () => {
    const token = localStorage.getItem('apna_news_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/api/auth/profile');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to load user profile:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Register User
  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        localStorage.setItem('apna_news_token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Login User
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('apna_news_token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid credentials';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('apna_news_token');
    setUser(null);
    setError(null);
  };

  // Update Profile Settings
  const updateProfile = async (name, favoriteCategories) => {
    setError(null);
    try {
      const res = await api.put('/api/auth/profile', { name, favoriteCategories });
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Profile update failed';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    setError(null);
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Forgot password failed';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Reset Password
  const resetPassword = async (token, newPassword) => {
    setError(null);
    try {
      const res = await api.post('/api/auth/reset-password', { token, newPassword });
      return { success: true, message: res.data.message };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Reset password failed';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Toggle Bookmark
  const toggleBookmark = async (article) => {
    if (!user) {
      return { success: false, message: 'Please sign in to bookmark articles' };
    }

    try {
      const res = await api.post('/api/news/bookmark', { article });
      if (res.data.success) {
        // Update local user state bookmarks list
        setUser(prev => ({
          ...prev,
          bookmarks: res.data.bookmarks
        }));
        return { success: true, bookmarked: res.data.bookmarked };
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      return { success: false, message: 'Failed to bookmark article' };
    }
  };

  const isBookmarked = (url) => {
    if (!user || !user.bookmarks) return false;
    return user.bookmarks.some(b => b.url === url);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        toggleBookmark,
        isBookmarked,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
