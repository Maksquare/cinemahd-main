'use client';

import { useEffect } from 'react';

const POPUNDER_URL =
  'https://www.profitableratecpmnetwork.com/a9faw3gk?key=ba6d68848b83f592ec839d56aa311b99';
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes frequency cap for peak CPM and non-spammy experience

export const AdsterraPopunder = () => {
  useEffect(() => {
    const handleFirstClick = () => {
      try {
        const lastTrigger = localStorage.getItem('cinemahd_popunder_last');
        const now = Date.now();

        if (!lastTrigger || now - parseInt(lastTrigger, 10) > COOLDOWN_MS) {
          localStorage.setItem('cinemahd_popunder_last', now.toString());
          window.open(POPUNDER_URL, '_blank', 'noopener,noreferrer');
        }
      } catch (err) {
        console.error('Popunder trigger error:', err);
      }
    };

    window.addEventListener('click', handleFirstClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener('click', handleFirstClick, { capture: true });
    };
  }, []);

  return null;
};
