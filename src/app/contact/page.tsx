import React from 'react';
import type { Metadata } from 'next';
import { Mail, MessageSquare, ShieldAlert, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the CinemaHD team for support inquiries, streaming feedback, or copyright notices.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white/80">
      <div className="border-b border-white/10 pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Support & Inquiries
        </span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Contact CinemaHD
        </h1>
        <p className="mt-3 text-base text-white/60">
          Have feedback, report an issue with a stream server, or need assistance? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
          <div className="inline-flex p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white">General Support</h2>
          <p className="text-sm text-white/60 leading-relaxed">
            For technical assistance, streaming server issues, or account feedback, please email our support inbox:
          </p>
          <p className="text-sm font-semibold text-amber-300">
            {/* [PLACEHOLDER - Replace with your verified domain support email] */}
            support@cinemahd.pro.et
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
          <div className="inline-flex p-2.5 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white">DMCA & Legal Notices</h2>
          <p className="text-sm text-white/60 leading-relaxed">
            For intellectual property matters, please review our DMCA policy page or email our copyright agent:
          </p>
          <p className="text-sm font-semibold text-amber-300">
            {/* [PLACEHOLDER - Replace with your verified DMCA agent email] */}
            dmca@cinemahd.pro.et
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-[#121216] p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-400" />
          Frequently Addressed Topics
        </h2>
        <div className="space-y-4 text-sm mt-4 text-white/70">
          <div>
            <h3 className="font-semibold text-white">Stream Buffering on Mobile:</h3>
            <p className="mt-1">
              If a server is loading slowly, use the &ldquo;Server Switcher&rdquo; directly below the video player
              to switch to alternate mirrors (e.g. VidSrc, MultiEmbed, or Videasy).
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Missing Subtitles:</h3>
            <p className="mt-1">
              Click the gear or &ldquo;CC&rdquo; icon inside the player embed once the stream begins to toggle
              English or multi-language subtitle tracks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
