/**
 * Google Ads & Google Analytics 4 (GA4) Conversion & Event Tracking Helper
 * Calibrado para máxima precisión de puntuación de calidad (Quality Score) y seguimiento de conversiones.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function trackEvent(action: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', action, params);
    } catch (err) {
      // Ignorar bloqueadores o errores de telemetría
    }
  }
}

/**
 * Evento de Conversión Principal: Clic en Postulación Oficial / Descarga de Bases
 */
export function trackApplyClick(jobTitle: string, entityName: string, destinationUrl: string) {
  trackEvent('apply_official_click', {
    event_category: 'engagement',
    event_label: `${entityName} - ${jobTitle}`,
    destination_url: destinationUrl,
    value: 1,
  });

  // Si existe un tag de conversión específico de Google Ads
  if (process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_APPLY) {
    trackEvent('conversion', {
      send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_APPLY,
    });
  }
}

/**
 * Evento de Conversión: Creación / Descarga de CV CAS SERVIR
 */
export function trackCvGeneration(templateId: string) {
  trackEvent('generate_cv_cas', {
    event_category: 'tools',
    event_label: templateId,
    value: 1,
  });

  if (process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_CV) {
    trackEvent('conversion', {
      send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_CV,
    });
  }
}

/**
 * Evento de Búsqueda de Empleo
 */
export function trackJobSearch(query: string, region?: string, category?: string) {
  trackEvent('search', {
    search_term: query,
    job_region: region || 'all',
    job_category: category || 'all',
  });
}
