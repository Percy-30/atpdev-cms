import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sorteos.atpdev.pe';

  const routes = [
    { path: '', priority: 1.0, freq: 'daily' as const },
    { path: '/sorteos/nuevo', priority: 0.95, freq: 'daily' as const },
    { path: '/herramientas/lista', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/ruleta', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/dados', priority: 0.85, freq: 'weekly' as const },
    { path: '/herramientas/moneda', priority: 0.85, freq: 'weekly' as const },
    { path: '/herramientas/numeros', priority: 0.9, freq: 'weekly' as const },
    { path: '/herramientas/equipos', priority: 0.85, freq: 'weekly' as const },
    { path: '/planes', priority: 0.8, freq: 'weekly' as const },
    { path: '/blog', priority: 0.8, freq: 'daily' as const },
    { path: '/terminos-y-condiciones', priority: 0.5, freq: 'monthly' as const },
    { path: '/politica-de-privacidad', priority: 0.5, freq: 'monthly' as const },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
