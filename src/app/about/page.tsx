import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Film, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about CinemaHD, the ultimate high-definition movie and TV series streaming platform designed for viewers in Ethiopia and the worldwide diaspora.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white/80">
      <div className="border-b border-white/10 pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          About The Platform
        </span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          About CinemaHD
        </h1>
        <p className="mt-3 text-base text-white/60">
          Next-generation high-definition streaming engineered for fast, resilient playback anywhere.
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Our Mission
          </h2>
          <p>
            CinemaHD was built to provide movie enthusiasts, television series buffs, and anime fans
            with an unparalleled entertainment experience. Specially optimized for viewers in Ethiopia
            and the Ethiopian diaspora across North America, Europe, and the Middle East, CinemaHD
            delivers seamless video playback even on constrained mobile networks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Optimized for Mobile & Low-Bandwidth Networks
          </h2>
          <p>
            We recognize that high-speed fiber isn&apos;t accessible everywhere. CinemaHD uses an intelligent
            multi-server architecture with click-to-load video facades and lightweight asset delivery,
            dramatically saving mobile data while maintaining pristine 1080p and 4K HDR playback quality.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Resilient Multi-Server Engine
          </h2>
          <p>
            Never suffer from dead links or buffering delays. CinemaHD integrates multiple top-tier
            independent streaming mirrors. If one server experiences congestion, you can switch
            to alternate verified mirrors with a single tap.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-400" />
            Ethiopic & Global Content Diversity
          </h2>
          <p>
            From Hollywood blockbusters and critically acclaimed TV series to Japanese anime and
            Korean dramas, CinemaHD continuously organizes titles with accurate subtitles, episode
            trackers, and personalized watchlists.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4">
        <Link
          href="/explore"
          className="rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition-colors"
        >
          Explore Full Catalog
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
