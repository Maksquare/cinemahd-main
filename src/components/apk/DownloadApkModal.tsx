'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Tv, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { APK_RELEASE } from '@/lib/apk-config';
import { AndroidLogo } from '@/components/icons/AndroidLogo';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    // Trigger download
    const link = document.createElement('a');
    link.href = APK_RELEASE.downloadUrl;
    link.download = `cinemahd-v${APK_RELEASE.version}.apk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 2000);
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
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#0f1015]/95 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/10">
                <AndroidLogo className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  CinemaHD for Android
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    v{APK_RELEASE.version}
                  </span>
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Universal APK for Android Phones, Tablets, Firestick & Android TV.
                </p>
              </div>
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

          {/* Quick Specs */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center">
              <span className="text-white/40 block text-[10px] uppercase font-semibold">File Size</span>
              <span className="font-bold text-white mt-0.5 block">{APK_RELEASE.fileSize}</span>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center">
              <span className="text-white/40 block text-[10px] uppercase font-semibold">Android OS</span>
              <span className="font-bold text-white mt-0.5 block">5.0 or higher</span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center">
              <span className="text-white/40 block text-[10px] uppercase font-semibold">Status</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">100% Virus Free</span>
            </div>
          </div>

          {/* Download Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/25 hover:scale-[1.02] hover:shadow-amber-500/40 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>
                {downloading ? 'Starting Download...' : `Download APK (v${APK_RELEASE.version})`}
              </span>
            </button>

            <div className="flex items-center justify-between text-xs text-white/50 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                No root required
              </span>
              <a
                href={APK_RELEASE.mirrorDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 flex items-center gap-1 transition-colors"
              >
                <span>Mirror link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Quick Install Steps */}
          <div className="mt-6 rounded-2xl border border-white/8 bg-[#14151b] p-4 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
              Quick Installation Steps:
            </span>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>1. Tap &ldquo;Download APK&rdquo; and wait for the download to finish.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>2. If prompted, toggle &ldquo;Allow from this source&rdquo; in Android Settings.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>3. Open the downloaded APK and tap &ldquo;Install&rdquo;.</span>
              </div>
            </div>
          </div>

          {/* Link to Full Page */}
          <div className="mt-5 text-center">
            <Link
              href="/download-apk"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>View full Firestick & TV installation guide</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
