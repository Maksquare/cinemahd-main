'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, PlusSquare, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running as standalone PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
      return isStandaloneMode;
    };

    if (checkStandalone()) return;

    // Check dismissal cooldown (don't show for 5 days after dismissal)
    const dismissedAt = localStorage.getItem('cinemahd_pwa_dismissed');
    if (dismissedAt) {
      const daysSinceDismissal = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissal < 5) return;
    }

    // Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
    if (isIosDevice && isSafari) {
      setIsIos(true);
      // Delay prompt on iOS for smooth initial impression
      const timer = setTimeout(() => setShowPrompt(true), 3500);
      return () => clearTimeout(timer);
    }

    // Capture standard Chromium beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 2500);
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('cinemahd_pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('cinemahd_pwa_dismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 25, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 pointer-events-auto"
      >
        <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-[#0d0e14]/95 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
          {/* Subtle Accent Glow Bar */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-2.5 right-2.5 p-1 rounded-full text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss install banner"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3.5 pr-6">
            {/* App Icon */}
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/60 shadow-md">
              <Image
                src="/icons/icon-192x192.png"
                alt="CinemaHD App Icon"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white truncate">Install CinemaHD</h4>
                <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-400/30 bg-amber-400/15 px-1.5 py-0.2 text-[9px] font-bold text-amber-300">
                  <Sparkles className="h-2 w-2" />
                  APP
                </span>
              </div>

              {isIos ? (
                <div className="mt-1 text-xs text-white/70 space-y-1">
                  <p>Add to your iPhone / iPad Home Screen:</p>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                    <span>1. Tap Share</span>
                    <Share className="h-3 w-3 inline text-amber-400" />
                    <span>&rarr; 2. &ldquo;Add to Home Screen&rdquo;</span>
                    <PlusSquare className="h-3 w-3 inline text-amber-400" />
                  </p>
                </div>
              ) : (
                <p className="mt-0.5 text-xs text-white/60 line-clamp-2">
                  Fast native launch, full-screen playback & zero browser address bars.
                </p>
              )}
            </div>
          </div>

          {!isIos && deferredPrompt && (
            <div className="mt-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 py-2.5 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-[1.02] hover:shadow-amber-500/35 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install Native App</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Later
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
