/**
 * Cliente API Sorteos Pro — JWT en localStorage, tenant por x-demo-user.
 * Uso: api<T>(path, { method, body, auth })
 */
'use client';

const TOKEN_KEY = 'sorteos_jwt';
const DEMO_KEY = 'sorteos_demo_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, t);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { token: t } }));
  }
}
export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { token: null } }));
  }
}
export function getDemoId(): string {
  if (typeof window === 'undefined') return 'default';
  let d = localStorage.getItem(DEMO_KEY);
  if (!d) {
    d = `demo-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(DEMO_KEY, d);
  }
  return d;
}

export async function api<T>(path: string, opts: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token && opts.auth !== false) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['x-demo-user'] = getDemoId();
  }
  const res = await fetch(path, {
    method: opts.method || 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Error ${res.status}`);
  return data as T;
}
