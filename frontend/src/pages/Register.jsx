import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Key, User, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setLocalError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 shadow-md space-y-6"
      >
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-block p-3 bg-blue-50 dark:bg-zinc-800 text-brand rounded-2xl">
            <UserPlus className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-serif font-black dark:text-white">Create Account</h2>
          <p className="text-xs text-gray-400 font-light">
            Sign up to unlock reading metrics and custom news feeds.
          </p>
        </div>

        {/* Error Alert */}
        {(localError || error) && (
          <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:bg-white focus:border-brand text-sm transition"
                placeholder="Rajveersinh zala"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:bg-white focus:border-brand text-sm transition"
                placeholder="reader@apnanews.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:bg-white focus:border-brand text-sm transition"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl shadow transition disabled:opacity-60 flex items-center justify-center space-x-2 mt-6 text-sm"
          >
            {loading ? (
              <span>Registering account...</span>
            ) : (
              <>
                <span>Sign Up</span>
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation pointer */}
        <div className="text-center text-xs text-gray-500 font-light border-t border-gray-100 dark:border-zinc-800/60 pt-5">
          <span>Already have an account? </span>
          <Link to="/login" className="text-brand font-semibold hover:underline">
            Login Instead
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
