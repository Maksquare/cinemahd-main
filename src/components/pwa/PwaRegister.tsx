'use client';

import { useEffect } from 'react';

export const PwaRegister: React.FC = () => {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.protocol.startsWith('http')
    ) {
      const registerSW = async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
          
          // Check for background updates
          reg.addEventListener('updatefound', () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (
                  installingWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New content available, dispatch update event if needed
                  window.dispatchEvent(new Event('cinemahd_pwa_update_available'));
                }
              });
            }
          });
        } catch (err) {
          console.warn('[PWA] Service worker registration bypassed:', err);
        }
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
        return () => window.removeEventListener('load', registerSW);
      }
    }
  }, []);

  return null;
};
