import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '../../../..'),
    resolveAlias: {
      '@atpdev/database': './packages/database/src/index.ts',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'yeeupdgjfrkkaurytyrs.supabase.co' }
    ],
  },
  transpilePackages: ['@atpdev/database'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/calculadora-sueldo-cas', destination: '/calculadora-sueldo', permanent: true },
      { source: '/comparador-cas', destination: '/comparador-regimenes', permanent: true },
      { source: '/entrevista-ia', destination: '/simulador-entrevista-ia', permanent: true },
      { source: '/generar-cv', destination: '/crear-cv-cas', permanent: true },
      { source: '/cv', destination: '/crear-cv-cas', permanent: true },
      { source: '/convocatorias', destination: '/empleos', permanent: true },
      { source: '/instituciones', destination: '/organizaciones', permanent: true },
      { source: '/entidades', destination: '/organizaciones', permanent: true },
      { source: '/publicar-oferta', destination: '/publicar-empleo', permanent: true },
      { source: '/publicar', destination: '/publicar-empleo', permanent: true }
    ];
  }
};

export default nextConfig;
