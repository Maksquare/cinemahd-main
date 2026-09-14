/**
 * Video Streaming CDN Helper — Implementation Spec (Mux, Cloudflare Stream, Bunny.net)
 */

export interface StreamingCdnConfig {
  type: 'mux' | 'cloudflare' | 'bunny' | 'custom';
  playbackId?: string;
  customStreamUrl?: string;
}

export function getMuxStreamUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export function getMuxThumbnailUrl(playbackId: string): string {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1280`;
}

export function getCloudflareStreamUrl(videoId: string, customerCode?: string): string {
  if (customerCode) {
    return `https://customer-${customerCode}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
  }
  return `https://iframe.videodelivery.net/${videoId}`;
}

export function getBunnyStreamUrl(libraryId: string, videoId: string): string {
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
}

export function resolveCdnPlayback(config: StreamingCdnConfig): {
  type: 'hls' | 'iframe' | 'mp4';
  url: string;
} {
  switch (config.type) {
    case 'mux':
      return {
        type: 'hls',
        url: getMuxStreamUrl(config.playbackId || ''),
      };
    case 'cloudflare':
      return {
        type: 'iframe',
        url: getCloudflareStreamUrl(config.playbackId || ''),
      };
    case 'bunny':
      return {
        type: 'iframe',
        url: config.customStreamUrl || '',
      };
    case 'custom':
    default:
      return {
        type: config.customStreamUrl?.endsWith('.mp4') ? 'mp4' : 'hls',
        url: config.customStreamUrl || '',
      };
  }
}
