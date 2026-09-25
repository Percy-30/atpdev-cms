/**
 * Sorteos Pro — Capa de persistencia V1 (Monolito Modular / Clean Architecture).
 *
 * Implementación actual: repositorio en memoria con semilla demo.
 * Contrato listo para migrar a PostgreSQL (multi-tenant por fila, RLS por user_id)
 * sin tocar casos de uso: basta con implementar la interfaz `Repository<T>`.
 *
 * Tablas objetivo (ver SAD §7):
 *  users, social_accounts, giveaways, participants, winners,
 *  subscriptions, usage_events, certificates, cms_posts, audit_logs
 */
import type {
  Giveaway,
  GiveawayRules,
  Participant,
  Winner,
} from '@/lib/types';

export type UserStatus = 'active' | 'suspended' | 'deleted';
export type UserRole = 'user' | 'admin' | 'super-admin';
export type PlanId = 'free' | 'pro' | 'business' | 'enterprise';
export type SocialPlatform = 'instagram' | 'facebook' | 'youtube';
export type SocialAccountStatus = 'connected' | 'expired' | 'revoked';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  status: UserStatus;
  plan: PlanId;
  language: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccountRecord {
  id: string;
  userId: string;
  platform: SocialPlatform;
  name: string;
  handle: string;
  /** Token cifrado AES-256-GCM (base64). Nunca se expone al cliente. */
  encryptedToken: string;
  status: SocialAccountStatus;
  scopes: string[];
  connectedAt: string;
  expiresAt: string;
  refreshedAt?: string;
}

export interface GiveawayRecord extends Giveaway {
  userId: string;
  updatedAt: string;
  auditLog: string[];
}

export interface UsageEventRecord {
  id: string;
  userId: string;
  giveawayId: string;
  commentsProcessed: number;
  provider: string;
  latencyMs: number;
  createdAt: string; // ISO
  monthKey: string; // YYYY-MM
}

export interface CertificateRecord {
  id: string;
  giveawayId: string;
  userId: string;
  title: string;
  winnerUsername: string;
  verificationHash: string;
  logoUrl?: string;
  brandColor?: string;
  customText?: string;
  issuedAt: string;
}

export interface CmsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  status: 'draft' | 'published';
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorUserId: string;
  action: string;
  entity: string;
  entityId: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface FeatureFlags {
  [flagId: string]: { free: boolean; pro: boolean; business: boolean; enterprise: boolean };
}

interface DbShape {
  users: Map<string, UserRecord>;
  usersByEmail: Map<string, string>;
  socialAccounts: Map<string, SocialAccountRecord>;
  giveaways: Map<string, GiveawayRecord>;
  usage: UsageEventRecord[];
  certificates: Map<string, CertificateRecord>;
  cms: Map<string, CmsPost>;
  audit: AuditLogEntry[];
  passwordResets: Map<string, { userId: string; expiresAt: number }>;
  flags: FeatureFlags;
  seeded: boolean;
}

function newDb(): DbShape {
  return {
    users: new Map(),
    usersByEmail: new Map(),
    socialAccounts: new Map(),
    giveaways: new Map(),
    usage: [],
    certificates: new Map(),
    cms: new Map(),
    audit: [],
    passwordResets: new Map(),
    flags: {
      'ff-multi-post': { free: false, pro: false, business: true, enterprise: true },
      'ff-custom-branding': { free: false, pro: true, business: true, enterprise: true },
      'ff-scheduled-draws': { free: false, pro: false, business: true, enterprise: true },
      'ff-advanced-filters': { free: false, pro: true, business: true, enterprise: true },
    },
    seeded: false,
  };
}

const g = globalThis as unknown as { __sorteosDb?: DbShape };
if (!g.__sorteosDb) g.__sorteosDb = newDb();
export const db: DbShape = g.__sorteosDb;

export function monthKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Seed mínimo para demos y tests. Idempotente. */
export function seedIfEmpty() {
  if (db.seeded) return;
  db.seeded = true;
  const now = new Date().toISOString();
  db.cms.set('guia-sorteo-instagram-2026', {
    id: 'cms-1',
    slug: 'guia-sorteo-instagram-2026',
    title: 'Cómo hacer un sorteo en Instagram legal y transparente',
    excerpt: 'Normas de promoción de Meta y certificación de ganadores.',
    body: '# Guía Instagram\n\nContenido editorial gestionado sin desplegar código (RF-035).',
    category: 'Instagram & Meta',
    status: 'published',
    updatedAt: now,
  });
  // Super-admin operativo (RF-031..034). Cambiar credenciales en producción.
  // Email: admin@sorteos.pro / Password: Admin1234!
  // Hash scrypt de 'Admin1234!' con salt fijo de seed (solo demo).
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { scryptSync } = require('node:crypto') as typeof import('node:crypto');
    const salt = 'seed-admin-salt-01';
    const passwordHash = scryptSync('Admin1234!', salt, 64).toString('hex');
    const adminId = 'usr_superadmin_seed';
    if (!db.users.has(adminId)) {
      db.users.set(adminId, {
        id: adminId,
        name: 'Super Admin',
        email: 'admin@sorteos.pro',
        passwordHash,
        salt,
        role: 'super-admin',
        status: 'active',
        plan: 'enterprise',
        language: 'es',
        createdAt: now,
        updatedAt: now,
      });
      db.usersByEmail.set('admin@sorteos.pro', adminId);
      if (process.env.NODE_ENV === 'production') {
        console.warn('[sorteos] Seed super-admin activo en producción: cambia admin@sorteos.pro de inmediato.');
      }
    }
  } catch {
    // Sin crypto disponible: se creará al primer login demo
  }
}

seedIfEmpty();

// Re-export types used by routes
export type { GiveawayRules, Participant, Winner };
