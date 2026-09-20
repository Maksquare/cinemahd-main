import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for CinemaHD. Learn how we handle cookies, local storage, analytics, and user privacy.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white/80 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Legal & Compliance
        </span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Last updated: September 20, 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Overview</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          At CinemaHD (accessible at https://cinemahd.pro.et), protecting the privacy of our visitors is
          one of our primary priorities. This Privacy Policy document outlines the types of information
          that is collected and recorded by CinemaHD and how we use it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Local Storage & Cookies</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          CinemaHD uses local browser storage (LocalStorage) exclusively to improve user experience, such as:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base text-white/70">
          <li>Maintaining your personalized movie and TV show &ldquo;Watchlist&rdquo;.</li>
          <li>Tracking playback progress for the &ldquo;Continue Watching&rdquo; rail so you can resume where you left off.</li>
          <li>Storing user interface preferences (such as lights-out theater mode).</li>
        </ul>
        <p className="text-sm sm:text-base leading-relaxed mt-2">
          This data remains on your local device and is not sold or shared with any data brokers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. Third-Party Advertisers & Embed Providers</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          CinemaHD displays third-party advertisements and provides links/embeds to external video streaming
          servers. These third-party ad networks and servers may use cookies, JavaScript, or Web Beacons in
          their respective advertisements and links.
        </p>
        <p className="text-sm sm:text-base leading-relaxed">
          CinemaHD has no access to or control over these cookies that are used by third-party advertisers.
          We recommend reviewing the respective Privacy Policies of these third-party servers for more detailed
          information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">4. Log Files</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          Like most standard web servers, CinemaHD follows a standard procedure of utilizing log files.
          The information collected by log files includes internet protocol (IP) addresses, browser type,
          Internet Service Provider (ISP), date/time stamps, referring/exit pages, and number of clicks.
          These are not linked to any personally identifiable information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">5. Contact Us</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          If you have additional questions or require more information about our Privacy Policy, do not
          hesitate to contact us via our contact page.
        </p>
      </section>
    </div>
  );
}
