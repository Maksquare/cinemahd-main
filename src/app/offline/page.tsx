'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WifiOff, RefreshCw, Bookmark, Sparkles, Home } from 'lucide-react';

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(false);

  useEffect(() => {
    setOnlineStatus(typeof navigator !== 'undefined' ? navigator.onLine : false);

    const handleOnline = () => {
      setOnlineStatus(true);
      window.location.reload();
    };
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        window.location.reload();
      } else {
        setIsRetrying(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="relative max-w-md w-full rounded-3xl border border-white/12 bg-[#0e0f14]/90 p-8 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        {/* Top Glow Bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-t-3xl" />

        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="relative h-7 w-28">
            <Image
              src="/new/white.png"
              alt="CinemaHD Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
            <Sparkles className="h-2.5 w-2.5" />
            PRO
          </span>
        </div>

        {/* Pulsing Offline Radar Icon */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-400/15 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/10 border-2 border-amber-400/40 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            <WifiOff className="h-9 w-9" />
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          You Are Offline
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          No internet connection detected. Don&apos;t worry — your watchlist and watch progress are
          safely preserved locally. Reconnect to resume 4K streaming.
        </p>

        {/* Action Controls */}
        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 py-3.5 text-xs sm:text-sm font-bold text-black shadow-lg shadow-amber-500/25 hover:scale-[1.02] hover:shadow-amber-500/40 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Checking Network...' : 'Retry Connection'}</span>
          </button>

          <Link
            href="/watchlist"
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 py-3 text-xs font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-all"
          >
            <Bookmark className="h-4 w-4 text-amber-400" />
            <span>View Offline Watchlist</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors pt-2"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
