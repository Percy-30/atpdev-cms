import { MetadataRoute } from 'next';
import { getJobPostings } from '@atpdev/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobPostings();
  const baseUrl = 'https://empleos.atpdev.dev';

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/empleos/${job.slug}`,
    lastModified: new Date(job.created_at || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const toolUrls = [
    '/empleos',
    '/calculadora-sueldo',
    '/comparador-regimenes',
    '/crear-cv-cas',
    '/plantillas-anexos',
    '/preguntas-entrevista-cas',
    '/simulador-entrevista-ia',
    '/quienes-somos',
    '/politica-de-privacidad',
    '/terminos-y-condiciones',
    '/contacto',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route.includes('politica') || route.includes('terminos') ? 0.6 : 0.95,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    ...toolUrls,
    ...jobUrls,
  ];
}
