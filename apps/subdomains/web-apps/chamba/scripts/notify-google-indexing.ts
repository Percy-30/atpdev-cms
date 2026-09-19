/**
 * Google Indexing API Notifier for Chamba Pro (empleos.atpdev.dev)
 * 
 * Permite notificar a Google inmediatamente cuando una convocatoria (JobPosting)
 * se publica, actualiza (URL_UPDATED) o finaliza/elimina (URL_DELETED).
 * 
 * Requisitos:
 * 1. Cuenta de Servicio (Service Account) en Google Cloud Console con la API "Web Search Indexing API" activada.
 * 2. Asignar el correo de la Cuenta de Servicio como 'Propietario' en Google Search Console para https://empleos.atpdev.dev.
 * 3. Guardar las credenciales en variable de entorno GOOGLE_INDEXING_KEY o archivo google-service-account.json.
 */

export type IndexingNotificationType = 'URL_UPDATED' | 'URL_DELETED';

interface IndexingRequestBody {
  url: string;
  type: IndexingNotificationType;
}

export async function notifyGoogleIndexing(
  url: string,
  type: IndexingNotificationType = 'URL_UPDATED',
  accessToken?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  const token = accessToken || process.env.GOOGLE_INDEXING_ACCESS_TOKEN;

  if (!token) {
    return {
      success: false,
      error: 'GOOGLE_INDEXING_ACCESS_TOKEN no configurado. Para producción, vincular OAuth2 Service Account con alcance https://www.googleapis.com/auth/indexing.',
    };
  }

  try {
    const response = await fetch(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
          type,
        } as IndexingRequestBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Error al comunicarse con Google Indexing API',
        data,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Error inesperado de red al contactar Google Indexing API',
    };
  }
}

// Ejecución directa desde CLI: npx tsx scripts/notify-google-indexing.ts <URL> [URL_UPDATED|URL_DELETED]
if (process.argv[1] && process.argv[1].endsWith('notify-google-indexing.ts')) {
  const targetUrl = process.argv[2];
  const actionType = (process.argv[3] as IndexingNotificationType) || 'URL_UPDATED';

  if (!targetUrl) {
    console.log('Uso: npx tsx scripts/notify-google-indexing.ts <URL_COMPLETA> [URL_UPDATED | URL_DELETED]');
    console.log('Ejemplo: npx tsx scripts/notify-google-indexing.ts https://empleos.atpdev.dev/empleos/analista-cas-sunat URL_UPDATED');
    process.exit(0);
  }

  console.log(`[Google Indexing API] Enviando notificación para: ${targetUrl} (${actionType})...`);
  notifyGoogleIndexing(targetUrl, actionType).then((res) => {
    if (res.success) {
      console.log('✅ Notificación enviada con éxito a Google:', res.data);
    } else {
      console.warn('⚠️ No se pudo enviar notificación:', res.error);
    }
  });
}
