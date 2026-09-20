'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  Tv,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Bell,
  Sparkles,
  Zap,
  Flame,
  Clock,
  Radio,
  Play,
} from 'lucide-react';
import { APK_RELEASE } from '@/lib/apk-config';
import { AndroidLogo } from '@/components/icons/AndroidLogo';
import { useAuth } from '@/context/AuthContext';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [notifyEmail, setNotifyEmail] = useState(user?.email || '');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) return;

    setIsSubmitting(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          const list = JSON.parse(localStorage.getItem('cinemahd_apk_waitlist') || '[]');
          if (!list.includes(notifyEmail)) {
            list.push(notifyEmail);
            localStorage.setItem('cinemahd_apk_waitlist', JSON.stringify(list));
          }
        } catch {}
      }
      setIsSubscribed(true);
      setIsSubmitting(false);

      // Trigger celebratory emerald and gold confetti burst
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ffffff'],
          zIndex: 99999,
        });
      } catch {}
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#0f1016]/95 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative h-6 sm:h-7 w-24 sm:w-28">
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

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Animated Hero Banner */}
          <div className="mt-5 text-center">
            {/* Pulsing Android Hologram Badge */}
            <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.6, 0.25] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-emerald-500/25 blur-xl"
              />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 via-[#10b981]/15 to-transparent border-2 border-emerald-500/40 text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.3)]">
                <AndroidLogo className="h-10 w-10" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 mb-2.5 shadow-sm">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>OFFICIAL APP • COMING SOON</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CinemaHD for Android & TV
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-white/70 leading-relaxed">
              We are currently engineering the native APK for Android smartphones, tablets, TV boxes, and Amazon Firestick with 4K hardware acceleration.
            </p>
          </div>

          {/* Engineering Progress Bar */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-white/60 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Development Progress</span>
              </span>
              <span className="text-emerald-400 font-mono font-bold">85% Engineered</span>
            </div>

            {/* Glowing progress bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
              />
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-white/75">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>ExoPlayer 4K Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Firestick D-Pad Remote</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Private Cloud Watchlist</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping mr-1" />
                <span className="text-amber-300 font-medium">Final Security Audit</span>
              </div>
            </div>
          </div>

          {/* VIP Pre-Registration / Notify Form */}
          <div className="mt-5">
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center space-y-1 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-1">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">You&apos;re on the VIP Release List!</h4>
                <p className="text-xs text-white/70">
                  We will send the direct APK download link to <strong className="text-emerald-300 font-semibold">{notifyEmail}</strong> the moment the release is published.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-2">
                <label className="block text-xs font-semibold text-white/70">
                  Get notified the instant the APK drops:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full rounded-xl border border-white/15 bg-black/60 py-2.5 pl-3.5 pr-3 text-xs font-medium text-white placeholder:text-white/35 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2.5 text-xs font-bold text-black shadow-md shadow-emerald-500/25 hover:scale-105 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? 'Joining...' : 'Notify Me'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Web Streaming Bridge CTA */}
          <div className="mt-5 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left text-xs text-white/50">
              <span>Can&apos;t wait?</span>
              <p className="font-semibold text-white/80">Stream 4K movies directly in browser now</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 px-4 py-2.5 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer shrink-0"
            >
              <Play className="h-3.5 w-3.5 fill-black" />
              <span>Watch Online Now</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
