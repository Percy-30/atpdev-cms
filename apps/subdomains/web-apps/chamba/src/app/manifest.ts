import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'chamba pro — Agregador de Empleos y Convocatorias Perú',
    short_name: 'chamba pro',
    description: 'Buscador profesional de convocatorias laborales CAS 1057, 728, 276 y Sector Privado en Perú.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0f19',
    theme_color: '#10b981',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
