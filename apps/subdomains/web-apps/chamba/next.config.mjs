/** @type {import('next').NextConfig} */
const nextConfig = {
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
