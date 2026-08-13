import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],  // quitamos '/_next/' de aquí
      },
    ],
    sitemap: 'https://www.atpdev.dev/sitemap.xml',
    host: 'https://www.atpdev.dev',
  };
}
