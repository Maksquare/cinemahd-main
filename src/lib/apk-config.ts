/**
 * CinemaHD Android APK Configuration
 * 
 * Update these details when releasing new APK versions.
 */

export interface ApkRelease {
  version: string;
  releaseDate: string;
  fileSize: string;
  minAndroid: string;
  architecture: string;
  packageId: string;
  downloadUrl: string;
  mirrorDownloadUrl: string;
  changelog: string[];
}

export const APK_RELEASE: ApkRelease = {
  version: '2.6.0',
  releaseDate: 'September 2026',
  fileSize: '24.8 MB',
  minAndroid: 'Android 5.0 (Lollipop) or higher',
  architecture: 'Universal (armeabi-v7a, arm64-v8a, x86, x86_64)',
  packageId: 'com.cinemahd.stream',
  // Local download link from public/downloads
  downloadUrl: '/downloads/cinemahd-v2.6.0.apk',
  // Configurable external CDN / mirror URL
  mirrorDownloadUrl: 'https://github.com/CinemaHD/releases/download/v2.6.0/cinemahd-v2.6.0.apk',
  changelog: [
    'Ultra-fast multi-server resolver with auto-fallback',
    'Full 4K HDR & 1080p stream caching for low-bandwidth mobile',
    'Amharic subtitle support & automatic OpenSubtitles integration',
    'Android TV & Amazon Fire TV remote controller navigation',
    'Real-Debrid & Trakt.tv account synchronization',
    'Fixed buffering on 3G and 4G mobile data connections',
  ],
};
