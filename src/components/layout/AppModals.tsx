'use client';

import React, { useState, useEffect } from 'react';
import { CryptoSupportModal } from '@/components/support/CryptoSupportModal';
import { DownloadApkModal } from '@/components/apk/DownloadApkModal';

export const OPEN_CRYPTO_EVENT = 'cinemahd_open_crypto_modal';
export const OPEN_APK_EVENT = 'cinemahd_open_apk_modal';

export function openCryptoSupportModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_CRYPTO_EVENT));
  }
}

export function openDownloadApkModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_APK_EVENT));
  }
}

export const AppModals: React.FC = () => {
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);
  const [isApkOpen, setIsApkOpen] = useState(false);

  useEffect(() => {
    const handleCrypto = () => setIsCryptoOpen(true);
    const handleApk = () => setIsApkOpen(true);

    window.addEventListener(OPEN_CRYPTO_EVENT, handleCrypto);
    window.addEventListener(OPEN_APK_EVENT, handleApk);

    return () => {
      window.removeEventListener(OPEN_CRYPTO_EVENT, handleCrypto);
      window.removeEventListener(OPEN_APK_EVENT, handleApk);
    };
  }, []);

  return (
    <>
      <CryptoSupportModal
        isOpen={isCryptoOpen}
        onClose={() => setIsCryptoOpen(false)}
      />
      <DownloadApkModal
        isOpen={isApkOpen}
        onClose={() => setIsApkOpen(false)}
      />
    </>
  );
};
