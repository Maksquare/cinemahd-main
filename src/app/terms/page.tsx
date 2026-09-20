import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service and user agreement governing the use of the CinemaHD streaming platform.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white/80 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Legal Agreement
        </span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Last updated: September 20, 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          By accessing or using CinemaHD (https://cinemahd.pro.et), you agree to be bound by these Terms
          of Service and all applicable laws and regulations. If you do not agree with any of these terms,
          you are prohibited from using or accessing this site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Platform Operation & Third-Party Content</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          CinemaHD operates solely as an information indexing directory and user interface for publicly available
          streaming mirrors on the internet. CinemaHD does not host, upload, or manage any media files, video
          streams, or copyrighted content on its own web servers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. User Conduct</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          You agree to use CinemaHD only for personal, non-commercial viewing. You may not attempt to reverse
          engineer, decompile, or disrupt any network connected to the service or engage in any scraping, automated
          querying, or denial-of-service activities.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">4. Disclaimer of Warranties</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          The materials on CinemaHD are provided on an &apos;as is&apos; basis. CinemaHD makes no warranties,
          expressed or implied, and hereby disclaims all other warranties including without limitation,
          implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
        </p>
      </section>
    </div>
  );
}
