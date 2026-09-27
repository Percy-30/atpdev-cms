/**
 * Configuración central de dominio y URLs para Chamba Pro
 * Apunta por defecto a https://atpdev.dev para verificación y compatibilidad con Google AdSense.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://atpdev.dev')
).replace(/\/$/, '');

export const SITE_NAME = 'chamba pro';
export const SITE_TAGLINE = 'Buscador de Convocatorias, Empleos y Chamba en Perú 2026';
export const CONTACT_EMAIL = 'contacto@atpdev.dev';
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5414009811868137';
export const ADSENSE_PUB_ID = process.env.ADSENSE_PUB_ID || 'pub-5414009811868137';
