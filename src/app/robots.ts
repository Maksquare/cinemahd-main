import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/*?*season=*',
          '/*?*episode=*',
          '/*?*sort=*',
          '/*?*ref=*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://cinemahd.pro.et/sitemap.xml',
    host: 'https://cinemahd.pro.et',
  };
}
