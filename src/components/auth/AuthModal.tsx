'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, Mail, Lock, User, ArrowRight, ShieldCheck, Film, Cloud, Play } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth-client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'social' | 'email_signin' | 'email_signup'>('social');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: typeof window !== 'undefined' ? window.location.href : '/',
      });
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setErrorMessage(
        err?.message ||
          'Could not initiate Google sign-in. Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured in .env.local'
      );
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'email_signup') {
        const res = await signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split('@')[0],
        });
        if (res?.error) {
          setErrorMessage(res.error.message || 'Failed to create account.');
          setIsLoading(false);
          return;
        }
      } else {
        const res = await signIn.email({
          email: email.trim(),
          password,
        });
        if (res?.error) {
          setErrorMessage(res.error.message || 'Invalid email or password.');
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMessage(err?.message || 'Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex min-h-full items-center justify-center p-4 sm:p-6">
        {/* Clickable Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Card Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-md my-auto overflow-hidden rounded-3xl border border-white/15 bg-[#0e1017] p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] z-10"
        >
          {/* Ambient Lighting Gradients */}
          <div className="pointer-events-none absolute -top-24 -left-20 h-52 w-52 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-52 w-52 rounded-full bg-amber-600/15 blur-3xl" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/15 hover:text-white transition-all cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header Brand & Title */}
          <div className="text-center pt-1 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 mb-3 shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>CinemaHD Cloud Sync</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Sign In to Cinema<span className="italic text-amber-400">HD</span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-white/65 max-w-sm mx-auto leading-relaxed">
              Sync your watchlist, save watched history, and resume playback across any phone, tablet, or TV.
            </p>

            {/* Feature Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/70">
              <span className="flex items-center gap-1 rounded-md border border-white/8 bg-white/5 px-2 py-0.5">
                <Cloud className="h-3 w-3 text-emerald-400" />
                Cross-Device Sync
              </span>
              <span className="flex items-center gap-1 rounded-md border border-white/8 bg-white/5 px-2 py-0.5">
                <Play className="h-3 w-3 text-amber-400 fill-amber-400" />
                Resume Playback
              </span>
              <span className="flex items-center gap-1 rounded-md border border-white/8 bg-white/5 px-2 py-0.5">
                <ShieldCheck className="h-3 w-3 text-sky-400" />
                100% Free
              </span>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="space-y-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {/* Official Google 4-Color 'G' Logo */}
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
            </button>

            {/* Styled Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#0e1017] px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Or With Email
              </span>
            </div>

            {/* Email Form Toggle / Fields */}
            {mode === 'social' ? (
              <button
                type="button"
                onClick={() => setMode('email_signin')}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all cursor-pointer"
              >
                <Mail className="h-4 w-4 text-amber-400" />
                <span>Sign in with Email & Password</span>
              </button>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {mode === 'email_signup' && (
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full rounded-xl border border-white/12 bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full rounded-xl border border-white/12 bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min. 8 characters)"
                    minLength={8}
                    className="w-full rounded-xl border border-white/12 bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 font-semibold text-xs text-black hover:bg-amber-300 transition-colors shadow-md cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? 'Processing...' : mode === 'email_signup' ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-between pt-1 text-[11px] text-white/50">
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'email_signin' ? 'email_signup' : 'email_signin')}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {mode === 'email_signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('social')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Back to Google
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Security Notice */}
          <div className="mt-6 border-t border-white/8 pt-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/45">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400/80 shrink-0" />
              <span>Your personal library and playback sync safely across all your devices.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
