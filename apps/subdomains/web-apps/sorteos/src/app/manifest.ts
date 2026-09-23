import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sorteos Pro — Plataforma de Sorteos Verificables',
    short_name: 'Sorteos Pro',
    description: 'Plataforma SaaS de sorteos en Instagram, Facebook, YouTube y herramientas interactivas con certificación SHA-256.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070a12',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
