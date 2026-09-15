'use client';

import React, { useEffect, useRef } from 'react';

interface AdNativeBannerProps {
  className?: string;
  label?: string;
}

export const AdNativeBanner: React.FC<AdNativeBannerProps> = ({
  className = '',
  label = 'Sponsored Recommendations',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    // Reset container contents
    host.innerHTML = '';

    // Create the container element expected by Adsterra
    const targetDiv = document.createElement('div');
    targetDiv.id = 'container-de13eae9c7a5a18b241c1da5cd9a3919';
    targetDiv.className = 'w-full flex justify-center';
    host.appendChild(targetDiv);

    // Create and attach the Adsterra invoke script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src =
      'https://pl31351452.profitableratecpmnetwork.com/de13eae9c7a5a18b241c1da5cd9a3919/invoke.js';
    host.appendChild(script);

    return () => {
      if (host) {
        host.innerHTML = '';
      }
    };
  }, []);

  return (
    <aside className={`w-full my-8 ${className}`} aria-label={label}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
          {label}
        </span>
        <div className="h-[1px] flex-1 bg-white/5" />
      </div>
      <div
        ref={containerRef}
        className="w-full min-h-[140px] rounded-2xl border border-white/8 bg-[#0d0f15]/80 p-4 shadow-xl backdrop-blur-md overflow-hidden flex justify-center items-center"
      />
    </aside>
  );
};
