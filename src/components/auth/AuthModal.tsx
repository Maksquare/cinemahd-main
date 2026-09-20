'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  LogIn,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Edit3,
  Bookmark,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signIn,
    signUp,
    verifyEmailOtp,
    resendEmailOtp,
    guestLogin,
    isCloudConnected,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'otp' | 'success'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  // Brand-colored celebration confetti
  const triggerCelebration = () => {
    try {
      const brandColors = ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#d97706', '#fcd34d'];

      // Left blast
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 60,
        origin: { x: 0.15, y: 0.65 },
        colors: brandColors,
        zIndex: 99999,
      });

      // Right blast
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 60,
        origin: { x: 0.85, y: 0.65 },
        colors: brandColors,
        zIndex: 99999,
      });

      // Center explosion with stars
      setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 85,
          origin: { y: 0.55 },
          colors: brandColors,
          shapes: ['star', 'circle'],
          scalar: 1.15,
          zIndex: 99999,
        });
      }, 200);

      // Trailing shimmer
      setTimeout(() => {
        confetti({
          particleCount: 45,
          spread: 100,
          origin: { y: 0.45 },
          colors: brandColors,
          zIndex: 99999,
        });
      }, 450);
    } catch (e) {
      console.error('Confetti animation error:', e);
    }
  };

  // 6-digit OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first OTP input when transitioning to OTP mode
  useEffect(() => {
    if (mode === 'otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [mode]);

  if (!isAuthModalOpen) return null;

  const handleOtpChange = (index: number, value: string) => {
    // Handle typing single digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const digit = cleaned.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);

    const focusIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid email or password.');
        } else {
          closeAuthModal();
        }
      } else if (mode === 'signup') {
        const res = await signUp(name, email, password);
        if (!res.success) {
          setError(res.error || 'Failed to create account.');
        } else if (res.requiresConfirmation) {
          // Switch to 6-digit confirmation screen
          setMode('otp');
          setOtpDigits(['', '', '', '', '', '']);
          setResendCooldown(60);
          setSuccessMsg('Confirmation code sent! Check your inbox.');
        } else {
          // Instant registration success!
          const displayName = name.trim() || email.split('@')[0];
          setRegisteredName(displayName.charAt(0).toUpperCase() + displayName.slice(1));
          setMode('success');
          triggerCelebration();
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const code = otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of your confirmation code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmailOtp(email, code);
      if (!res.success) {
        setError(res.error || 'Invalid or expired confirmation code.');
      } else {
        const pending = typeof window !== 'undefined' ? localStorage.getItem('cinemahd_pending_signup_name') : null;
        const displayName = pending || name.trim() || email.split('@')[0];
        setRegisteredName(displayName.charAt(0).toUpperCase() + displayName.slice(1));
        setMode('success');
        triggerCelebration();
      }
    } catch {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setLoading(true);

    try {
      const res = await resendEmailOtp(email);
      if (!res.success) {
        setError(res.error || 'Failed to resend code.');
      } else {
        setResendCooldown(60);
        setSuccessMsg('A fresh 6-digit confirmation code has been dispatched.');
      }
    } catch {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#0f1015]/95 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="relative h-7 w-28 sm:w-32">
                  <Image
                    src="/new/white.png"
                    alt="CinemaHD Logo"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                  <Sparkles className="h-2.5 w-2.5" />
                  PRO
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {mode === 'success'
                  ? 'Account Activated'
                  : mode === 'otp'
                  ? 'Verify Your Email'
                  : mode === 'signin'
                  ? 'Sign In to Your Account'
                  : 'Create Your Free Account'}
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                {mode === 'success'
                  ? 'Your personal CinemaHD library is ready'
                  : mode === 'otp'
                  ? 'Enter the 6-digit confirmation code sent to your inbox'
                  : 'Your personal library, watchlists & continuous playback.'}
              </p>
            </div>

            <button
              type="button"
              onClick={closeAuthModal}
              className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs (Only in Sign In / Register modes) */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="mt-5 flex rounded-full border border-white/10 bg-white/5 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 rounded-full py-2 transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-amber-400 text-black shadow-md font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 rounded-full py-2 transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-amber-400 text-black shadow-md font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Feedback Banners */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW: Celebration / Thank You for Registering */}
          {mode === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="py-5 text-center"
            >
              {/* Animated Glowing Ring & Checkmark */}
              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.7, 0.35] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-amber-400/25 blur-xl"
                />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400/25 via-amber-500/15 to-transparent border-2 border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                  <CheckCircle2 className="h-10 w-10 text-amber-400" />
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300 mb-3 tracking-wide">
                <Sparkles className="h-3.5 w-3.5" />
                OFFICIALLY ACTIVATED
              </span>

              <h3 className="font-serif text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                Thank You for Registering!
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-slate-300 leading-relaxed">
                Welcome, <strong className="text-amber-400 font-semibold">{registeredName || 'Member'}</strong>! Your CinemaHD PRO account is ready. Your personal watchlists and streaming progress will now sync automatically.
              </p>

              {/* Unlocked Benefits Grid */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <div className="flex flex-col items-center p-1.5">
                  <Sparkles className="h-4 w-4 text-amber-400 mb-1" />
                  <span className="text-[11px] font-bold text-white">4K VIP Mirrors</span>
                  <span className="text-[9px] text-white/50">VidSrc VIP #1</span>
                </div>
                <div className="flex flex-col items-center p-1.5 border-x border-white/10">
                  <Bookmark className="h-4 w-4 text-amber-400 mb-1" />
                  <span className="text-[11px] font-bold text-white">Private Library</span>
                  <span className="text-[9px] text-white/50">Encrypted Sync</span>
                </div>
                <div className="flex flex-col items-center p-1.5">
                  <Zap className="h-4 w-4 text-amber-400 mb-1" />
                  <span className="text-[11px] font-bold text-white">Ad-Optimized</span>
                  <span className="text-[9px] text-white/50">Instant Stream</span>
                </div>
              </div>

              {/* Start Streaming CTA Button */}
              <button
                type="button"
                onClick={closeAuthModal}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 py-3.5 text-xs sm:text-sm font-bold text-black shadow-[0_10px_30px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(245,158,11,0.45)] cursor-pointer"
              >
                <span>Start Streaming Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : mode === 'otp' ? (
            <div className="mt-5 space-y-5">
              {/* Mail Callout Banner */}
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-center space-y-1.5 shadow-inner">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/15 text-amber-400 mb-1 border border-amber-400/30 animate-bounce">
                  <Mail className="h-5 w-5" />
                </div>
                <p className="text-xs text-white/70">
                  Please wait for confirmation from your email. We sent a 6-digit code to:
                </p>
                <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-amber-300">
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                    className="text-white/40 hover:text-white transition-colors ml-1 p-1"
                    title="Change email"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* 6-Digit Input Grid */}
              <div className="space-y-2">
                <label className="block text-center text-xs font-semibold text-white/60">
                  Enter 6-Digit Code:
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-white/15 bg-black/60 text-center font-mono text-xl sm:text-2xl font-bold text-amber-400 shadow-inner focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={loading || otpDigits.join('').length !== 6}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 py-3 text-xs font-bold text-black shadow-lg shadow-amber-500/25 hover:scale-[1.02] hover:shadow-amber-500/40 transition-all cursor-pointer disabled:opacity-40 disabled:hover:scale-100"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{loading ? 'Verifying Code...' : 'Confirm & Start Streaming'}</span>
              </button>

              {/* Resend & Back options */}
              <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="hover:text-white transition-colors"
                >
                  &larr; Back to Sign In
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className={`flex items-center gap-1.5 transition-colors ${
                    resendCooldown > 0
                      ? 'text-white/30 cursor-not-allowed'
                      : 'text-amber-400 hover:text-amber-300 font-semibold cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend 6-Digit Code'}
                  </span>
                </button>
              </div>

              {!isCloudConnected && (
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-2.5 text-[11px] text-indigo-300 text-center">
                  💡 <strong>Demo Preview:</strong> Enter any 6-digit code (e.g. <code>123456</code>) to confirm and enter.
                </div>
              )}
            </div>
          ) : (
            /* VIEW: Sign In or Register Form */
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Your Name</label>
                  <div className="relative flex items-center">
                    <UserIcon className="absolute left-3.5 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-white/12 bg-black/50 py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-white/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-white/12 bg-black/50 py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/12 bg-black/50 py-2.5 pl-10 pr-10 text-xs font-medium text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 py-3 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:scale-[1.02] hover:shadow-amber-500/35 transition-all cursor-pointer disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" />
                <span>
                  {loading
                    ? 'Processing...'
                    : mode === 'signin'
                    ? 'Sign In'
                    : 'Create Free Account'}
                </span>
              </button>

              {/* Quick 1-Click Guest Login */}
              <div className="mt-5 border-t border-white/8 pt-4">
                <button
                  type="button"
                  onClick={guestLogin}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Quick 1-Click Guest Access</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
