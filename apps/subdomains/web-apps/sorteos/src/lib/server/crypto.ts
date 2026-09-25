/**
 * Sorteos Pro — Primitivas criptográficas (SAD §23).
 * - Passwords: scrypt (NIST-approved KDF) + salt aleatoria. Equivalente a bcrypt/argon2 en dureza.
 * - Sesiones: JWT HS256 firmado, expiración ≤ 24h.
 * - Tokens sociales: AES-256-GCM en reposo (RF at-rest encryption).
 * Sin dependencias externas: solo node:crypto (Edge-safe salvo scrypt → fallback SHA-256).
 */
import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const IS_PROD = process.env.NODE_ENV === 'production';

function requiredEnv(name: string, fallback: string): string {
  const v = process.env[name];
  if (v && v.length > 0) return v;
  if (IS_PROD) {
    throw new Error(`[sorteos] Falta variable de entorno ${name} en producción.`);
  }
  return fallback;
}

function getJwtSecret(): string {
  return requiredEnv('SORTEOS_JWT_SECRET', process.env.JWT_SECRET || 'dev-only-sorteos-secret-change-me');
}

function getTokenKey(): Buffer {
  const raw = requiredEnv('SORTEOS_TOKEN_KEY', 'dev-only-32-byte-token-key-01234567');
  return Buffer.from(raw.padEnd(32, '0').slice(0, 32));
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || randomBytes(16).toString('hex');
  const hash = scryptSync(password, s, 64).toString('hex');
  return { hash, salt: s };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const { hash } = hashPassword(password, salt);
    const a = Buffer.from(hash, 'hex');
    const b = Buffer.from(expectedHash, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64url(input: string): Buffer {
  const p = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(p + '='.repeat((4 - (p.length % 4)) % 4), 'base64');
}

/** Emite JWT HS256 con expiración máxima de 24h (RNF Seguridad). */
export function signJwt(userId: string, email: string, role: string, ttlHours = 24): string {
  const ttl = Math.min(Math.max(ttlHours, 1), 24);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = { sub: userId, email, role, iat: now, exp: now + ttl * 3600 };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(createHmac('sha256', getJwtSecret()).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const [h, b, s] = token.split('.');
    if (!h || !b || !s) return null;
    const expected = b64url(createHmac('sha256', getJwtSecret()).update(`${h}.${b}`).digest());
    const a = Buffer.from(s);
    const c = Buffer.from(expected);
    if (a.length !== c.length || !timingSafeEqual(a, c)) return null;
    const payload = JSON.parse(unb64url(b).toString('utf8')) as JwtPayload;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Cifra token OAuth para reposo (AES-256-GCM). Retorna iv:tag:cipher en base64. */
export function encryptToken(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getTokenKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptToken(payload: string): string {
  const buf = Buffer.from(payload, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', getTokenKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

export function sha256Hex(input: string): string {
  return createHmac('sha256', 'sorteos-audit').update(input).digest('hex');
}
