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
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, t);
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
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'x-demo-user': getDemoId() };
  const token = getToken();
  if (opts.auth !== false && token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(path, {
    method: opts.method || 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Error ${res.status}`);
  return data as T;
}
