import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Key, Mail, AlertCircle, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter Token & New Password
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Stage 1: Request Reset
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await forgotPassword(email);
    if (res.success) {
      setSuccessMsg(res.message);
      setStep(2);
    } else {
      setErrorMsg(res.message);
    }
    setLoading(false);
  };

  // Stage 2: Verify Token & Reset Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const res = await resetPassword(token, newPassword);
    if (res.success) {
      setSuccessMsg('Password changed successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setErrorMsg(res.message);
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
            <Key className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-serif font-black dark:text-white">Recover Password</h2>
          <p className="text-xs text-gray-400 font-light">
            {step === 1
              ? 'Enter email to receive a recovery token.'
              : 'Enter the console token and your new password.'}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="flex items-start space-x-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 text-green-600 dark:text-green-400 p-3.5 rounded-xl text-xs font-semibold">
            <CheckCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Email form */}
        {step === 1 ? (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl shadow transition disabled:opacity-60 flex items-center justify-center space-x-2 mt-6 text-sm"
            >
              {loading ? <span>Generating...</span> : <span>Send Reset Instructions</span>}
            </button>
          </form>
        ) : (
          /* STEP 2: Enter Token and reset password form */
          <form onSubmit={handleResetSubmit} className="space-y-4">
            
            {/* Token entry */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Reset Token
              </label>
              <p className="text-[9px] text-gray-400 italic">
                (Extract the token parameter from the link printed in your server's backend console logs)
              </p>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:bg-white focus:border-brand text-xs font-mono transition"
                  placeholder="Paste token or token query value..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* New Password entry */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white rounded-xl focus:outline-none focus:bg-white focus:border-brand text-sm transition"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Submit Reset */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl shadow transition disabled:opacity-60 flex items-center justify-center space-x-2 mt-6 text-sm"
            >
              {loading ? (
                <span>Resetting...</span>
              ) : (
                <>
                  <span>Change Password</span>
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Back to Step 1 */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-gray-400 font-semibold hover:underline mt-2.5"
            >
              Request Another Code
            </button>
          </form>
        )}

        {/* Back to login */}
        <div className="text-center text-xs text-gray-500 font-light border-t border-gray-100 dark:border-zinc-800/60 pt-5">
          <span>Remembered credentials? </span>
          <Link to="/login" className="text-brand font-semibold hover:underline">
            Login
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
