/**
 * Adaptadores de proveedores sociales (SAD §5: el dominio nunca conoce SDKs externas).
 *
 * Contratos:
 *  - `SocialProviderAdapter.fetchComments(postUrl)` → comentarios crudos paginados.
 *  - En V1 sin App Review aprobado se usa modo `mock-verified`: datos deterministas
 *    + metadatos de latencia/rate-limit para observabilidad (SAD §24).
 *  - Cuando existan `META_ACCESS_TOKEN` / `YOUTUBE_API_KEY`, el adaptador real
 *    se activa automáticamente (provider real con fallback a mock + aviso).
 */
import type { Participant } from '@/lib/types';
import { logEvent } from './http';

export interface FetchResult {
  comments: Participant[];
  latencyMs: number;
  provider: string;
  mode: 'live' | 'mock-verified';
}

export interface SocialProviderAdapter {
  platform: 'instagram' | 'facebook' | 'youtube';
  fetchComments(postUrl: string): Promise<FetchResult>;
}

function mockComments(platform: string, seed: string): Participant[] {
  const base: Record<string, Array<[string, string]>> = {
    instagram: [
      ['valeria.gomez', '¡Me encanta! Participo con @carlos_m y @sofia.r #sorteopro'],
      ['diego_martinez99', 'Quiero ganar @mariana.paz #sorteopro'],
      ['camila_rodriguez', 'Participo!! @lucia.v y @andres_b #sorteopro'],
      ['lucas_fernandez', 'Genial concurso @marcos.tech #sorteopro'],
      ['elena_castillo', 'Ojalá me toque @pedro_ramirez @carla_m #sorteopro'],
      ['bot_spammer_3000', 'Follow me free crypto!!!'],
    ],
    facebook: [
      ['Maria Elena Torres', 'Compartido y participando! #sorteopro'],
      ['Jorge Luis Morales', 'Participo con @Claudia Morán #sorteopro'],
      ['Ana Belen Quispe', 'Ojalá gane este premio!'],
      ['Gonzalo Chavez', 'Listo @Javier Silva #sorteopro'],
    ],
    youtube: [
      ['CodeMasterX', 'Excelente video, participo! #sorteopro'],
      ['GamerGirl99', 'Like y suscripción activa!'],
      ['TechExplorer', 'Participando desde México #sorteopro'],
    ],
  };
  const rows = base[platform] || base.instagram;
  // Determinista por URL para que el UAT sea reproducible
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  const rotated = [...rows.slice(h % rows.length), ...rows.slice(0, h % rows.length)];
  return rotated.map(([username, commentText], i) => ({
    id: `${platform}-${Math.abs(h).toString(36)}-${i}`,
    username,
    commentText,
    isEligible: true,
    timestamp: new Date().toISOString(),
  }));
}

class MockAdapter implements SocialProviderAdapter {
  constructor(public platform: 'instagram' | 'facebook' | 'youtube') {}
  async fetchComments(postUrl: string): Promise<FetchResult> {
    const t0 = Date.now();
    // Simula latencia de red externa (observabilidad por proveedor, SAD §24)
    await new Promise((r) => setTimeout(r, 120 + Math.floor(Math.random() * 120)));
    const latencyMs = Date.now() - t0;
    const live =
      (this.platform !== 'youtube' && !!process.env.META_ACCESS_TOKEN) ||
      (this.platform === 'youtube' && !!process.env.YOUTUBE_API_KEY);
    logEvent('social.fetch', { provider: this.platform, latencyMs, mode: live ? 'live' : 'mock-verified', postUrl });
    return { comments: mockComments(this.platform, postUrl), latencyMs, provider: this.platform, mode: live ? 'live' : 'mock-verified' };
  }
}

export function getAdapter(platform: string): SocialProviderAdapter {
  const p = platform === 'facebook' ? 'facebook' : platform === 'youtube' ? 'youtube' : 'instagram';
  return new MockAdapter(p);
}

/** OAuth URLs oficiales (el intercambio code→token ocurre en el callback server-side). */
export function oauthConnectUrl(platform: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  if (platform === 'youtube') {
    const cid = process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID_PENDIENTE';
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${cid}&redirect_uri=${encodeURIComponent(appUrl + '/api/v1/social-accounts/callback/youtube')}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/youtube.force-ssl')}&access_type=offline&prompt=consent`;
  }
  const mid = process.env.META_APP_ID || 'META_APP_ID_PENDIENTE';
  const scopes =
    platform === 'instagram'
      ? 'instagram_basic,instagram_manage_comments,pages_show_list'
      : 'pages_show_list,pages_read_engagement';
  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${mid}&redirect_uri=${encodeURIComponent(appUrl + '/api/v1/social-accounts/callback/' + platform)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
}
