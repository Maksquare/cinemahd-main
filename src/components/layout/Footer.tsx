import React from 'react';
import Link from 'next/link';
import { Film, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-white/8 bg-[#08080a]/90 py-12 px-4 sm:px-6 lg:px-8 text-white/50 text-xs">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/new/white.png"
                alt="CinemaHD"
                className="h-6 sm:h-7 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="max-w-md text-white/40">
              The ultimate high-definition streaming destination. Fusing Phonofilm&apos;s celestial aesthetic with Cinebloom&apos;s multi-server resilience.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <Link href="/explore?type=movie" className="hover:text-amber-400 transition-colors">Movies</Link>
            <Link href="/explore?type=tv" className="hover:text-amber-400 transition-colors">TV Series</Link>
            <Link href="/explore?type=anime" className="hover:text-amber-400 transition-colors">Anime</Link>
            <Link href="/explore?type=asian" className="hover:text-amber-400 transition-colors">Asian Dramas</Link>
            <Link href="/watchlist" className="hover:text-amber-400 transition-colors">Watchlist</Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-white/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
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
