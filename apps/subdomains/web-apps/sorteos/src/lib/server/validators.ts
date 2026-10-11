/**
 * Validadores de entrada (OWASP: validación estricta en borde).
 */
export function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export function isStrongPassword(v: unknown): boolean {
  return typeof v === 'string' && v.length >= 8 && v.length <= 128;
}

export function cleanStr(v: unknown, max = 500): string {
  return String(v ?? '').trim().slice(0, max);
}

export function toInt(v: unknown, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(String(v ?? fallback), 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function isValidPostUrl(platform: string, url: string): boolean {
  const u = url.toLowerCase();
  if (platform === 'instagram') return u.includes('instagram.com/');
  if (platform === 'facebook') return u.includes('facebook.com/') || u.includes('fb.watch');
  if (platform === 'youtube') return u.includes('youtube.com/') || u.includes('youtu.be/');
  if (platform === 'tiktok') return u.includes('tiktok.com/');
  if (platform === 'x' || platform === 'twitter') return u.includes('twitter.com/') || u.includes('x.com/');
  if (platform === 'threads') return u.includes('threads.net/');
  return u.startsWith('http');
}

