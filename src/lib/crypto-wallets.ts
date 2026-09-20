/**
 * CinemaHD Cryptocurrency Donation & Support Wallets
 * 
 * Official wallets configured for CinemaHD contributions.
 */

export interface CryptoWallet {
  id: string;
  name: string;
  symbol: string;
  network: string;
  networkBadge: string;
  address: string;
  explorerUrl: string;
  memo?: string;
  notice?: string;
  iconColor: string;
  description: string;
}

export const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    id: 'btc-bep20',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'BNB Smart Chain (BEP20)',
    networkBadge: 'BEP20 (BSC)',
    address: '0x76e4021bc78e42c2aecaee70a21faf64c9cfaf44',
    explorerUrl: 'https://bscscan.com/address/0x76e4021bc78e42c2aecaee70a21faf64c9cfaf44',
    notice: 'Please make sure the BTC token you are depositing via BSC network ends with the contract address ead9c.',
    iconColor: '#f7931a',
    description: 'Deposit Bitcoin via BNB Smart Chain. Ultra-low gas fees and fast confirmations.',
  },
  {
    id: 'usdt-bep20',
    name: 'Tether USD',
    symbol: 'USDT',
    network: 'BNB Smart Chain (BEP20)',
    networkBadge: 'BEP20 (BSC)',
    address: '0x76e4021bc78e42c2aecaee70a21faf64c9cfaf44',
    explorerUrl: 'https://bscscan.com/address/0x76e4021bc78e42c2aecaee70a21faf64c9cfaf44',
    iconColor: '#26a17b',
    description: 'Send USDT on BNB Smart Chain. Gas fee is typically under $0.05 per transaction.',
  },
  {
    id: 'eth-bep20',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'BNB Smart Chain (BEP20)',
    networkBadge: 'BEP20 (BSC)',
    address: '0x76e4021bc78e42c2aecaee70a21faf64c9cfaf44',
    explorerUrl: 'https://bscscan.com/address/0x76e4021bc78e42c2aecaee70a21faf64c9cfaf44',
    iconColor: '#627eea',
    description: 'Send Ethereum (ETH) via BNB Smart Chain for instant, low-cost transfer.',
  },
  {
    id: 'usdt-trc20',
    name: 'Tether USD',
    symbol: 'USDT',
    network: 'Tron Network (TRC-20)',
    networkBadge: 'TRC-20 (Tron)',
    address: 'TP6MZMGTQzyMPJLHNnnKnhbi4Heyc3quFK',
    explorerUrl: 'https://tronscan.org/#/address/TP6MZMGTQzyMPJLHNnnKnhbi4Heyc3quFK',
    iconColor: '#26a17b',
    description: 'Send USDT via Tron (TRC-20) network with lightning-fast confirmations.',
  },
];

export function getWalletQrCodeUrl(address: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(
    address
  )}`;
}
