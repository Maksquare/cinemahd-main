'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart } from 'lucide-react';
import { openCryptoSupportModal, openDownloadApkModal } from '@/components/layout/AppModals';
import { AndroidLogo } from '@/components/icons/AndroidLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-white/8 bg-[#08080a]/90 py-12 px-4 sm:px-6 lg:px-8 text-white/50 text-xs">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-7 w-28 sm:w-32">
                <Image
                  src="/new/white.png"
                  alt="CinemaHD Logo"
                  fill
                  sizes="130px"
                  className="object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </Link>
            <p className="max-w-md text-white/40 leading-relaxed">
              The premier high-definition streaming destination. Delivering multi-server resilience, 4K HDR playback, and lightweight mobile streaming for viewers in Ethiopia and worldwide.
            </p>
          </div>

          {/* Navigation Category Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <Link href="/explore?type=movie" className="hover:text-amber-400 transition-colors">Movies</Link>
            <Link href="/explore?type=tv" className="hover:text-amber-400 transition-colors">TV Series</Link>
            <Link href="/explore?type=anime" className="hover:text-amber-400 transition-colors">Anime</Link>
            <Link href="/explore?type=asian" className="hover:text-amber-400 transition-colors">Asian Dramas</Link>
            <Link href="/watchlist" className="hover:text-amber-400 transition-colors">Watchlist</Link>
            <button
              type="button"
              onClick={openDownloadApkModal}
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
            >
              <AndroidLogo className="h-4 w-4" />
              <span>Android App</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Coming Soon
              </span>
            </button>
            <button
              type="button"
              onClick={openCryptoSupportModal}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
            >
              <Heart className="h-3.5 w-3.5 fill-amber-400/40" />
              Support Us
            </button>
          </div>
        </div>

        {/* Legal & Trust Links */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-white/50">
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/dmca" className="hover:text-white transition-colors">DMCA Policy</Link>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-white/30 text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Multi-Server Stream Engine (VidLink, VidSrc, 2Embed, EmbedSu, AutoEmbed)</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} CinemaHD. All media metadata provided by TMDB.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

