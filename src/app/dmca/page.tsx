import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck, Mail, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DMCA & Copyright Policy',
  description:
    'Digital Millennium Copyright Act (DMCA) policy and takedown notification procedure for CinemaHD.',
  alternates: {
    canonical: '/dmca',
  },
};

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white/80 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Intellectual Property
        </span>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          DMCA Copyright Policy
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Compliance with the Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;)
        </p>
      </div>

      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6 flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed text-amber-200/90">
          <strong className="text-white font-semibold">Important Non-Hosting Notice:</strong> CinemaHD
          does not host, store, archive, or upload any video, media, or copyrighted files onto its own servers.
          All content displayed is provided by non-affiliated third-party streaming providers across the web.
          CinemaHD acts strictly as an automated media index and search interface.
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Copyright Infringement Notification</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          CinemaHD respects the intellectual property rights of others and expects its users to do the same.
          In accordance with Title 17, United States Code, Section 512(c)(2), if you believe that your copyrighted
          work is accessible on or via CinemaHD in a way that constitutes copyright infringement, please provide
          our Designated Copyright Agent with a written notice containing the following details:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-white/70">
          <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access disabled, including the exact URL(s).</li>
          <li>Information reasonably sufficient to permit CinemaHD to contact the complaining party, such as an address, telephone number, and email address.</li>
          <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Designated Copyright Agent</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          All formal DMCA notifications should be sent to our designated email address:
        </p>
        <div className="rounded-xl border border-white/10 bg-[#121216] p-4 inline-flex items-center gap-3">
          <Mail className="h-5 w-5 text-amber-400" />
          <span className="font-semibold text-white">
            {/* [PLACEHOLDER - Replace with your verified DMCA agent email] */}
            dmca@cinemahd.pro.et
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. Takedown Actions</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          Upon receipt of a valid and complete notification under the DMCA, CinemaHD will expeditiously take
          appropriate action, which includes removing or disabling links and references to the allegedly infringing
          material from the site index.
        </p>
      </section>
    </div>
  );
}
