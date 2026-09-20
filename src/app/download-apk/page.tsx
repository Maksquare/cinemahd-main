import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Download,
  Smartphone,
  Tv,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { APK_RELEASE } from '@/lib/apk-config';
import { AndroidLogo } from '@/components/icons/AndroidLogo';
import { ApkHeroActions } from '@/components/apk/ApkHeroActions';

export const metadata: Metadata = {
  title: 'Download CinemaHD APK v2.6.0 for Android & Firestick',
  description:
    'Download the official CinemaHD APK v2.6.0 for Android smartphones, tablets, Fire TV Stick, and Android TV. Safe, ad-optimized 4K streaming with multi-server playback.',
  alternates: {
    canonical: '/download-apk',
  },
  openGraph: {
    title: 'Download CinemaHD APK v2.6.0 for Android & Firestick | CinemaHD',
    description:
      'Official CinemaHD APK v2.6.0 for Android, Fire TV Stick, and Android TV with multi-server 4K playback.',
    url: 'https://cinemahd.pro.et/download-apk',
    siteName: 'CinemaHD',
  },
};

export default function DownloadApkPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is CinemaHD APK safe to install?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, CinemaHD APK is completely safe and free from viruses or malware. It does not require root permissions and only requests standard storage access for caching streams and subtitles.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I install CinemaHD on Amazon Fire TV Stick?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can easily install CinemaHD on any Amazon Fire TV Stick or Fire TV Cube using the free Downloader application from the Amazon Appstore.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does CinemaHD support Amharic subtitles?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, CinemaHD features automated multi-language subtitle integrations including English and Amharic with customizable fonts and timing synchronization.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white/90">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-[#161720] to-[#0c0d12] p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <AndroidLogo className="h-4 w-4" />
              <span>Official Android App • Coming Soon (In Active Development)</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              CinemaHD for Android & TV{' '}
              <span className="text-amber-400">Coming Soon</span>
            </h1>

            <p className="text-base text-white/70 leading-relaxed">
              We are currently engineering the native CinemaHD application for Android smartphones, tablets, Amazon Fire TV
              Stick, and Android TV boxes. Featuring native 4K HDR playback, multi-server auto-failover, and
              optimized stream compression for mobile connections across Ethiopia.
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                <span className="text-[11px] font-semibold text-white/40 block">Target Size</span>
                <span className="text-sm font-bold text-white mt-0.5 block">~25 MB</span>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                <span className="text-[11px] font-semibold text-white/40 block">Requirements</span>
                <span className="text-sm font-bold text-white mt-0.5 block">Android 5.0+</span>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                <span className="text-[11px] font-semibold text-white/40 block">Target Version</span>
                <span className="text-sm font-bold text-white mt-0.5 block">v{APK_RELEASE.version}</span>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                <span className="text-[11px] font-semibold text-white/40 block">Architecture</span>
                <span className="text-sm font-bold text-white mt-0.5 block">Universal</span>
              </div>
            </div>

            {/* Interactive Progress & VIP Notification Actions */}
            <ApkHeroActions />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Why CinemaHD for Android?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#12131a] p-6 space-y-3">
              <div className="inline-flex p-3 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Server Streaming</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Connects to over 12 verified streaming mirrors. If one server lags or goes down, CinemaHD
                seamlessly switches you to the fastest available source.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#12131a] p-6 space-y-3">
              <div className="inline-flex p-3 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                <Tv className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Full TV & Remote Support</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Tailored leanback user interface designed specifically for D-pad navigation on Amazon Firestick,
                Nvidia Shield, and Android Smart TVs.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#12131a] p-6 space-y-3">
              <div className="inline-flex p-3 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Trakt & Debrid Sync</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Integrate your Real-Debrid or Premiumize accounts for high-speed torrent caching, and keep
                your watched history synced via Trakt.tv.
              </p>
            </div>
          </div>
        </div>

        {/* Installation Guides */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold text-white">
            Installation Guides
          </h2>

          {/* Guide 1: Android Phone & Tablet */}
          <div className="rounded-2xl border border-white/10 bg-[#12131a] p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <AndroidLogo className="h-5 w-5 text-emerald-400" />
              How to Install on Android Phones & Tablets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-sm text-white/75">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <span className="text-amber-400 font-bold block mb-1">Step 1: Download</span>
                Tap the Download button above to save the `cinemahd-v2.6.0.apk` file to your device.
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <span className="text-amber-400 font-bold block mb-1">Step 2: Enable Unknown Sources</span>
                Open Android Settings &gt; Security (or Apps) &gt; Toggle on &ldquo;Install Unknown Apps&rdquo; for your browser.
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <span className="text-amber-400 font-bold block mb-1">Step 3: Install & Stream</span>
                Open your Downloads folder, tap the APK, and select &ldquo;Install&rdquo;. Launch and enjoy!
              </div>
            </div>
          </div>

          {/* Guide 2: Amazon Firestick */}
          <div className="rounded-2xl border border-white/10 bg-[#12131a] p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Tv className="h-5 w-5 text-emerald-400" />
              How to Install on Amazon Fire TV Stick & Cube
            </h3>
            <ol className="list-decimal pl-6 space-y-2 text-sm sm:text-base text-white/75">
              <li>On your Firestick, open the Amazon Appstore and install the free **Downloader** app.</li>
              <li>Go to Firestick **Settings &gt; My Fire TV &gt; Developer Options** and enable **Install Unknown Apps** for Downloader.</li>
              <li>Open Downloader, enter the browser URL: `https://cinemahd.pro.et/download-apk` (or direct APK path).</li>
              <li>Click Download, then click **Install** when prompted.</li>
            </ol>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-amber-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-sm sm:text-base">
            <div className="rounded-2xl border border-white/8 bg-[#12131a] p-6">
              <h3 className="font-bold text-white text-base">Is CinemaHD APK free to use?</h3>
              <p className="mt-1 text-white/60">
                Yes, CinemaHD is 100% free with no subscription requirements. You can stream unlimited movies and TV series immediately.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#12131a] p-6">
              <h3 className="font-bold text-white text-base">Does CinemaHD require root access?</h3>
              <p className="mt-1 text-white/60">
                No. CinemaHD works on any standard unrooted Android device, phone, tablet, or smart TV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
