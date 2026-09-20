'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Heart,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  QrCode,
} from 'lucide-react';
import { CRYPTO_WALLETS, getWalletQrCodeUrl, CryptoWallet } from '@/lib/crypto-wallets';

interface CryptoSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CryptoSupportModal: React.FC<CryptoSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string>(CRYPTO_WALLETS[0].id);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentWallet =
    CRYPTO_WALLETS.find((w) => w.id === selectedWalletId) || CRYPTO_WALLETS[0];

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(currentWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-[#0e0f14]/95 p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.9)] z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 shadow-md shadow-amber-500/10">
                <Heart className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  Support CinemaHD
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Crypto
                  </span>
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  100% of community contributions fund fast stream servers & bandwidth.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Smart Responsive 4-Column Wallet Selector (No Cutoff) */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CRYPTO_WALLETS.map((w) => {
              const isSelected = w.id === currentWallet.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setSelectedWalletId(w.id);
                    setCopied(false);
                  }}
                  className={`group relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400/80 bg-amber-400/15 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/50 scale-[1.02]'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full shadow-sm"
                      style={{ backgroundColor: w.iconColor }}
                    />
                    <span className="font-bold text-xs sm:text-sm text-white">{w.symbol}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold tracking-tight mt-0.5 ${
                      isSelected ? 'text-amber-300' : 'text-white/45 group-hover:text-white/70'
                    }`}
                  >
                    {w.networkBadge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Wallet Details & QR Card */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#13141b] p-4 sm:p-5 space-y-4">
            {/* Header with Name & Explorer Link */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">
                  {currentWallet.name} ({currentWallet.symbol})
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  {currentWallet.network}
                </span>
              </div>

              <a
                href={currentWallet.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400/80 hover:text-amber-300 transition-colors"
                title="Verify on Blockchain Explorer"
              >
                <span>Explorer</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* QR Code and Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* QR Code Container with Scan Badge */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="relative h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-2xl border border-white/20 bg-white p-2.5 shadow-lg shadow-black/60">
                  <img
                    src={getWalletQrCodeUrl(currentWallet.address)}
                    alt={`${currentWallet.name} QR Code`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-medium text-white/40 flex items-center gap-1">
                  <QrCode className="h-3 w-3 text-amber-400/70" />
                  Scan with Mobile Wallet
                </span>
              </div>

              {/* Description & Network Advice */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-xs text-white/70 leading-relaxed">
                  {currentWallet.description}
                </p>
                <div className="text-[11px] text-white/40 space-y-1">
                  <div>
                    <span className="text-white/60 font-semibold">Accepted Asset: </span>
                    <span className="text-amber-300">{currentWallet.symbol}</span>
                  </div>
                  <div>
                    <span className="text-white/60 font-semibold">Network: </span>
                    <span className="text-white/80">{currentWallet.network}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Contract Check Notice (for BTC BEP20) */}
            {currentWallet.notice && (
              <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent p-3 text-xs text-amber-200 flex items-start gap-2.5 shadow-inner">
                <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-300 block">Critical Token Verification Notice:</span>
                  <span className="leading-relaxed text-amber-200/90">{currentWallet.notice}</span>
                </div>
              </div>
            )}

            {/* Address Box & One-Click Copy */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-white/50 font-medium">
                <span>Wallet Deposit Address:</span>
                <span className="text-amber-400/80">Only deposit via {currentWallet.network}</span>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-black/70 p-2 sm:px-3 sm:py-2.5 shadow-inner">
                <span className="font-mono text-xs text-white/90 truncate max-w-[260px] sm:max-w-[360px] select-all tracking-tight pl-1">
                  {currentWallet.address}
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    copied
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                      : 'bg-amber-400 text-black hover:bg-amber-300 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Secure peer-to-peer cryptocurrency transactions directly support CinemaHD operations.
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
