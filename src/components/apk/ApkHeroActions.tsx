'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Play, Clock } from 'lucide-react';
import { openDownloadApkModal } from '@/components/layout/AppModals';

export const ApkHeroActions: React.FC = () => {
  return (
    <div className="space-y-4 pt-3">
      {/* Development Status Bar */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 max-w-lg space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-white/70 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>App Engineering Status</span>
          </span>
          <span className="text-emerald-400 font-mono font-bold">85% Complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: '85%' }}
          />
        </div>
        <p className="text-[11px] text-white/50">
          ExoPlayer 4K engine and Firestick remote support are currently in testing.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
        <button
          type="button"
          onClick={openDownloadApkModal}
          className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 px-7 py-3.5 text-sm font-bold text-black shadow-lg shadow-emerald-500/25 hover:scale-105 hover:shadow-emerald-500/40 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Check Progress & Get Notified</span>
        </button>

        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
        >
          <Play className="h-4 w-4 text-amber-400 fill-amber-400/40" />
          <span>Stream Online in Browser</span>
        </Link>
      </div>
    </div>
  );
};
