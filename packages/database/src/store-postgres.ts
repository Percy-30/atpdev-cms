/**
 * @atpdev/database — store-postgres.ts
 *
 * Capa de repositorio sobre PostgreSQL para Sorteos Pro (MVS / Clean Architecture).
 * Traduce los contratos de `store.ts` (apps/subdomains/web-apps/sorteos) a SQL/RLS.
 *
 * Uso:
 *   import { createStorePostgres, type StorePostgres } from '@atpdev/database/store-postgres';
 *   const pg = new Pool({ connectionString: process.env.DATABASE_URL });
 *   const store = await createStorePostgres(pg, 'sorteos-demo');
 *
 * La tabla `tenant_id` es el aislamiento multi-tenant por fila (RLS).
 */

import { Pool, PoolClient, types } from 'pg';
export type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads' | 'standalone';
export type SocialAccountStatus = 'active' | 'revoked' | 'expired' | 'error';
export type UserRole = 'user' | 'admin' | 'moderator';
export type UserStatus = 'active' | 'suspended' | 'pending';
export type PlanId = 'free' | 'pro' | 'enterprise';

export interface GiveawayRules {
  excludeDuplicates: boolean;
  minMentions: number;
  requiredHashtag?: string;
  blockedUsers: string[];
  winnersCount: number;
  substitutesCount: number;
}

export interface Participant {
  id: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  commentText?: string;
  likesCount?: number;
  timestamp?: string;
  isEligible: boolean;
  exclusionReason?: string;
}

export interface Winner {
  id: string;
  participant: Participant;
  type: 'winner' | 'substitute';
  position: number;
  selectedAt: string;
}

export interface Giveaway {
  id: string;
  title: string;
  description?: string;
  platform?: SocialPlatform;
  postUrl?: string;
  secondPostUrl?: string;
  authorUsername?: string;
  totalCommentsCount?: number;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'finished' | 'cancelled';
  rules: GiveawayRules;
  participants?: Participant[];
  winners: Winner[];
  substitutes?: Winner[];
  certificateId?: string;
  verificationHash?: string;
  scheduledAt?: string;
  executedAt?: string;
  createdAt: string;
}

// Keep numeric types from being returned as string/number surprises
types.setTypeParser(1700, (v) => v); // avoid over-eager JSONB parsing issues

export interface StorePostgres {
  name: string;
  readonly schema: 'sorteos';

  init(): Promise<void>;
  destroy(): Promise<void>;

  // --- users ---------------------------------------------------------
  getUser(id: string): Promise<{ id: string; tenant_id: string; name: string; email: string; password_hash: string | null; password_salt: string | null; role: UserRole; status: UserStatus; plan: PlanId; language: string; avatar_url: string | null; created_at: string; updated_at: string } | null>;
  getUserByEmail(email: string): Promise<{ id: string; tenant_id: string } | null>;
  upsertUser(input: {
    id: string; tenant_id: string; name: string; email: string; password_hash: string | null; password_salt: string | null;
    role: UserRole; status: UserStatus; plan: PlanId; language: string; avatar_url: string | null;
  }): Promise<void>;

  // --- social_accounts -------------------------------------------------
  upsertSocialAccount(input: {
    id: string; user_id: string; tenant_id: string; platform: SocialPlatform;
    name: string; handle: string | null; encrypted_token: string; status: SocialAccountStatus;
    scopes: string[]; connected_at: string; expires_at: string | null; refreshed_at: string | null;
  }): Promise<void>;
  listSocialAccountsByUser(userId: string): Promise<Array<{ id: string; platform: string; name: string; handle: string | null; encrypted_token: string; status: string; scopes: string[]; connected_at: string; expires_at: string | null; refreshed_at: string | null }>>;

  // --- giveaways -------------------------------------------------------
  upsertGiveaway(input: {
    id: string; user_id: string; tenant_id: string; network: string; platform: string; social_type: string;
    title: string; description: string | null; post_url: string; rules_json: any; status: string;
    visibility: string; eligibility: any; drawn_at: string | null; closed_at: string | null; updated_at: string;
  }): Promise<void>;
  getGiveaway(id: string, tenant_id: string): Promise<any | null>;
  listGiveawaysByUser(userId: string, tenant_id: string): Promise<Array<{ id: string; user_id: string; tenant_id: string; network: string; platform: string; social_type: string; title: string; description: string | null; post_url: string; rules_json: any; status: string; visibility: string; eligibility: any; drawn_at: string | null; closed_at: string | null; created_at: string; updated_at: string }>>;
  countGiveawaysByUser(userId: string, tenant_id: string): Promise<number>;

  // --- participants ----------------------------------------------------
  upsertParticipant(input: {
    id: string; giveaway_id: string; user_id: string | null; tenant_id: string; platform: string; actor_id: string;
    username: string; invite_code: string; comment_url: string; status: string; source: string;
  }): Promise<void>;
  listParticipantsByGiveaway(giveawayId: string): Promise<Array<{ id: string; giveaway_id: string; user_id: string | null; tenant_id: string; platform: string; actor_id: string; username: string; invite_code: string; comment_url: string; status: string; source: string; created_at: string }>>;

  // --- winners ---------------------------------------------------------
  upsertWinner(input: { id: string; giveaway_id: string; user_id: string | null; participant_id: string | null; tenant_id: string; rank: number; is_suppliment: boolean; draw_hash: string; seed: string }): Promise<void>;
  listWinnersByGiveaway(giveawayId: string): Promise<Array<{ id: string; giveaway_id: string; user_id: string | null; participant_id: string | null; tenant_id: string; rank: number; is_suppliment: boolean; draw_hash: string; seed: string; created_at: string }>>;

  // --- usage ---------------------------------------------------------
  upsertUsage(input: { id: string; user_id: string; giveaway_id: string | null; tenant_id: string; comments_processed: number; provider: string; latency_ms: number; created_at: string }): Promise<void>;
  usageForMonth(userId: string, tenant_id: string, month: string): Promise<{ comments_processed: number } | null>;

  // --- certificates ----------------------------------------------------
  upsertCertificate(input: {
    id: string; giveaway_id: string; user_id: string; tenant_id: string; title: string;
    winner_username: string; verification_hash: string; logo_url: string | null; brand_color: string | null; custom_text: string | null;
  }): Promise<void>;

  // --- audit -----------------------------------------------------------
  upsertAudit(input: { id: string; actor_user_id: string | null; tenant_id: string; action: string; entity: string; entity_id: string; meta: any }): Promise<void>;

  // --- feature_flags ---------------------------------------------------
  upsertFlag(input: { id: string; tenant_id: string | null; name: string; description: string | null; free: boolean; pro: boolean; business: boolean; enterprise: boolean; enabled: boolean }): Promise<void>;
  listFlags(tenant_id: string | null, plan: PlanId): Promise<Array<{ id: string; name: string; description: string | null; free: boolean; pro: boolean; business: boolean; enterprise: boolean; enabled: boolean }>>;

  // --- cms -------------------------------------------------------------
  upsertCmsPost(input: { id: string; tenant_id: string; slug: string; title: string; excerpt: string; body: string; category: string; status: string }): Promise<void>;
  getCmsPostBySlug(slug: string, tenant_id: string): Promise<{ id: string; tenant_id: string; slug: string; title: string; excerpt: string | null; body: string; category: string; status: string; created_at: string; updated_at: string; published_at: string | null } | null>;
  listCmsByTenant(tenant_id: string, status?: string): Promise<Array<{ id: string; tenant_id: string; slug: string; title: string; excerpt: string | null; body: string; category: string; status: string; created_at: string; updated_at: string; published_at: string | null }>>;

  // --- password_resets --------------------------------------------------
  upsertPasswordReset(input: { id: string; user_id: string; tenant_id: string; expires_at: number }): Promise<void>;
  deletePasswordReset(id: string): Promise<void>;
}

export async function createStorePostgres(pool: Pool, tenantId: string): Promise<StorePostgres> {
  return new PostgresStore(pool, tenantId);
}

class PostgresStore implements StorePostgres {
  readonly schema = 'sorteos' as const;

  constructor(private readonly pool: Pool, readonly name: string) {}

  async init(): Promise<void> {
    await this.pool.query(/* sql */ `
      CREATE TABLE IF NOT EXISTS sorteos_users (
        id         UUID PRIMARY KEY,
        tenant_id  TEXT NOT NULL,
        name       TEXT NOT NULL,
        email      TEXT NOT NULL,
        password_hash TEXT,
        password_salt TEXT,
        role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin','super-admin')),
        status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','deleted')),
        plan       TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','business','enterprise')),
        language   TEXT NOT NULL DEFAULT 'es',
        avatar_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS idx_sorteos_users_tenant ON sorteos_users(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_sorteos_users_email ON sorteos_users(email);
      CREATE TABLE IF NOT EXISTS sorteos_social_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
        tenant_id TEXT NOT NULL,
        platform TEXT NOT NULL CHECK (platform IN ('instagram','facebook','youtube')),
        name TEXT NOT NULL,
        handle TEXT,
        encrypted_token TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected','expired','revoked')),
        scopes TEXT[] NOT NULL DEFAULT '{}',
        connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        refreshed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sorteos_giveaways (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
        tenant_id TEXT NOT NULL,
        network TEXT NOT NULL,
        platform TEXT NOT NULL,
        social_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        post_url TEXT NOT NULL,
        rules_json JSONB NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','open','closed','executed','finished','scheduled','expired')),
        visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','team','public')),
        eligibility JSONB NOT NULL DEFAULT '[]',
        drawn_at TIMESTAMPTZ,
        closed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sorteos_participants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        giveaway_id UUID NOT NULL REFERENCES sorteos_giveaways(id) ON DELETE CASCADE,
        user_id UUID REFERENCES sorteos_users(id) ON DELETE SET NULL,
        tenant_id TEXT NOT NULL,
        platform TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        username TEXT NOT NULL DEFAULT '',
        invite_code TEXT NOT NULL DEFAULT '',
        comment_url TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','excluded','winner','suppliment')),
        source TEXT NOT NULL DEFAULT 'manual',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sorteos_winners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        giveaway_id UUID NOT NULL REFERENCES sorteos_giveaways(id) ON DELETE CASCADE,
        user_id UUID REFERENCES sorteos_users(id) ON DELETE SET NULL,
        participant_id UUID REFERENCES sorteos_participants(id) ON DELETE SET NULL,
        tenant_id TEXT NOT NULL,
        rank INTEGER NOT NULL,
        is_suppliment BOOLEAN NOT NULL DEFAULT false,
        draw_hash TEXT NOT NULL,
        seed TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sorteos_subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
        tenant_id TEXT NOT NULL,
        plan TEXT NOT NULL CHECK (plan IN ('pro','business','enterprise')),
        stripe_id TEXT,
        stripe_price TEXT,
        stripe_status TEXT NOT NULL DEFAULT 'free' CHECK (stripe_status IN ('free','active','past_due','canceled','incomplete')),
        cadence TEXT NOT NULL DEFAULT 'monthly' CHECK (cadence IN ('monthly','annual')),
        current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        current_period_end TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        trial_ends_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sorteos_usage_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
        tenant_id TEXT NOT NULL,
        giveaway_id UUID REFERENCES sorteos_giveaways(id) ON DELETE SET NULL,
        comments_processed INTEGER NOT NULL DEFAULT 0,
        provider TEXT NOT NULL DEFAULT 'mock',
        latency_ms INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sorteos_certificates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        giveaway_id UUID NOT NULL REFERENCES sorteos_giveaways(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
        tenant_id TEXT NOT NULL,
        title TEXT NOT NULL,
        winner_username TEXT NOT NULL,
        verification_hash TEXT NOT NULL,
        logo_url TEXT,
        brand_color TEXT,
        custom_text TEXT,
        issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sorteos_audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_user_id UUID REFERENCES sorteos_users(id) ON DELETE SET NULL,
        tenant_id TEXT NOT NULL,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        meta JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sorteos_feature_flags (
        id TEXT PRIMARY KEY,
        tenant_id TEXT,
        name TEXT NOT NULL,
        description TEXT,
        free BOOLEAN NOT NULL DEFAULT false,
        pro BOOLEAN NOT NULL DEFAULT false,
        business BOOLEAN NOT NULL DEFAULT false,
        enterprise BOOLEAN NOT NULL DEFAULT false,
        enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sorteos_cms_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id TEXT NOT NULL,
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT,
        body TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        published_at TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS idx_sorteos_cms_tenant_status ON sorteos_cms_posts(tenant_id, status);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_sorteos_cms_slug ON sorteos_cms_posts(slug) WHERE status = 'published';

      CREATE TABLE IF NOT EXISTS sorteos_password_resets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
        tenant_id TEXT NOT NULL,
        expires_at BIGINT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_sorteos_resets_user ON sorteos_password_resets(user_id);
    `).catch((err) => {
      // Surface clear errors
      const e = err as Error & { code?: string };
      if (e.code === 'PSQT000' || e.code === '42P01') {
        throw new Error(`Tabla de Sorteos Pro no encontrada. Aplica los migrations: cd packages/database/migrations && psql -U $POSTGRES_USER -d $POSTGRES_DB -f sorceos-001_sorteos_core.sql`);
      }
      throw err;
    });
  }

  async destroy(): Promise<void> {
    await this.pool.end();
  }

  private async withTx<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const res = await this.pool.connect();
    try {
      await res.query('BEGIN');
      const out = await fn(res);
      await res.query('COMMIT');
      return out;
    } catch (e) {
      await res.query('ROLLBACK');
      throw e;
    } finally {
      res.release();
    }
  }

  // Users
  async getUser(id: string): Promise<any | null> {
    const { rows } = await this.pool.query(
      `SELECT id, tenant_id, name, email, password_hash, password_salt, role, status, plan, language, avatar_url, created_at, updated_at
       FROM sorteos_users WHERE id = $1 AND tenant_id = $2`, [id, this.name]
    );
    return rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<{ id: string; tenant_id: string } | null> {
    const { rows } = await this.pool.query(
      `SELECT id, tenant_id FROM sorteos_users WHERE LOWER(email) = LOWER($1) AND tenant_id = $2`, [email, this.name]
    );
    return rows[0] || null;
  }

  async upsertUser(input: { id: string; tenant_id: string; name: string; email: string; password_hash: string | null; password_salt: string | null; role: UserRole; status: UserStatus; plan: PlanId; language: string; avatar_url: string | null; }): Promise<void> {
    await this.withTx(async (c) => {
      await c.query(
        `INSERT INTO sorteos_users (id, tenant_id, name, email, password_hash, password_salt, role, status, plan, language, avatar_url, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, NOW())
         ON CONFLICT (id) DO UPDATE SET name=$3,email=$4,password_hash=$5,password_salt=$6,role=$7,status=$8,plan=$9,language=$10,avatar_url=$11,updated_at=NOW()`,
        [input.id, input.tenant_id, input.name, input.email, input.password_hash, input.password_salt, input.role, input.status, input.plan, input.language, input.avatar_url]
      );
    });
  }

  // Social accounts
  async upsertSocialAccount(input: { id: string; user_id: string; tenant_id: string; platform: SocialPlatform; name: string; handle: string | null; encrypted_token: string; status: SocialAccountStatus; scopes: string[]; connected_at: string; expires_at: string | null; refreshed_at: string | null; }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_social_accounts (id, user_id, tenant_id, platform, name, handle, encrypted_token, status, scopes, connected_at, expires_at, refreshed_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, NOW())
       ON CONFLICT (id) DO UPDATE SET user_id=$2,tenant_id=$3,platform=$4,name=$5,handle=$6,encrypted_token=$7,status=$8,scopes=$9,connected_at=$10,expires_at=$11,refreshed_at=$12,updated_at=NOW()`,
      [input.id, input.user_id, input.tenant_id, input.platform, input.name, input.handle, input.encrypted_token, input.status, input.scopes, input.connected_at, input.expires_at, input.refreshed_at]
    );
  }

  async listSocialAccountsByUser(userId: string): Promise<any[]> {
    const { rows } = await this.pool.query(
      `SELECT id, platform, name, handle, encrypted_token, status, scopes, connected_at, expires_at, refreshed_at
       FROM sorteos_social_accounts WHERE user_id = $1 ORDER BY connected_at DESC`, [userId]
    );
    return rows;
  }

  // Giveaways
  async upsertGiveaway(input: { id: string; user_id: string; tenant_id: string; network: string; platform: string; social_type: string; title: string; description: string | null; post_url: string; rules_json: any; status: string; visibility: string; eligibility: any; drawn_at: string | null; closed_at: string | null; updated_at: string; }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_giveaways (id, user_id, tenant_id, network, platform, social_type, title, description, post_url, rules_json, status, visibility, eligibility, drawn_at, closed_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, $16)
       ON CONFLICT (id) DO UPDATE SET user_id=$2,tenant_id=$3,network=$4,platform=$5,social_type=$6,title=$7,description=$8,post_url=$9,rules_json=$10,status=$11,visibility=$12,eligibility=$13,drawn_at=$14,closed_at=$15,updated_at=NOW()`,
      [input.id, input.user_id, input.tenant_id, input.network, input.platform, input.social_type, input.title, input.description, input.post_url, input.rules_json, input.status, input.visibility, input.eligibility, input.drawn_at, input.closed_at, input.updated_at]
    );
  }

  async getGiveaway(id: string, tenant_id: string): Promise<any | null> {
    const { rows } = await this.pool.query(
      `SELECT id, user_id, tenant_id, network, platform, social_type, title, description, post_url, rules_json, status, visibility, eligibility, drawn_at, closed_at, created_at, updated_at
       FROM sorteos_giveaways WHERE id = $1 AND tenant_id = $2`, [id, tenant_id]
    );
    return rows[0] || null;
  }

  async listGiveawaysByUser(userId: string, tenant_id: string): Promise<any[]> {
    const { rows } = await this.pool.query(
      `SELECT id, user_id, tenant_id, network, platform, social_type, title, description, post_url, rules_json, status, visibility, eligibility, drawn_at, closed_at, created_at, updated_at
       FROM sorteos_giveaways WHERE user_id = $1 AND tenant_id = $2 ORDER BY updated_at DESC`, [userId, tenant_id]
    );
    return rows;
  }

  async countGiveawaysByUser(userId: string, tenant_id: string): Promise<number> {
    const { rowCount } = await this.pool.query(
      `SELECT COUNT(*)::int AS n FROM sorteos_giveaways WHERE user_id = $1 AND tenant_id = $2`, [userId, tenant_id]
    );
    return rowCount || 0;
  }

  // Participants
  async upsertParticipant(input: { id: string; giveaway_id: string; user_id: string | null; tenant_id: string; platform: string; actor_id: string; username: string; invite_code: string; comment_url: string; status: string; source: string; }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_participants (id, giveaway_id, user_id, tenant_id, platform, actor_id, username, invite_code, comment_url, status, source, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, NOW())
       ON CONFLICT (id) DO UPDATE SET giveaway_id=$2,user_id=$3,tenant_id=$4,platform=$5,actor_id=$6,username=$7,invite_code=$8,comment_url=$9,status=$10,source=$11,updated_at=NOW()`,
      [input.id, input.giveaway_id, input.user_id, input.tenant_id, input.platform, input.actor_id, input.username, input.invite_code, input.comment_url, input.status, input.source]
    );
  }

  async listParticipantsByGiveaway(giveawayId: string): Promise<any[]> {
    const { rows } = await this.pool.query(
      `SELECT id, giveaway_id, user_id, tenant_id, platform, actor_id, username, invite_code, comment_url, status, source, created_at
       FROM sorteos_participants WHERE giveaway_id = $1 ORDER BY created_at`, [giveawayId]
    );
    return rows;
  }

  // Winners
  async upsertWinner(input: { id: string; giveaway_id: string; user_id: string | null; participant_id: string | null; tenant_id: string; rank: number; is_suppliment: boolean; draw_hash: string; seed: string }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_winners (id, giveaway_id, user_id, participant_id, tenant_id, rank, is_suppliment, draw_hash, seed, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW())
       ON CONFLICT (id) DO UPDATE SET giveaway_id=$2,user_id=$3,participant_id=$4,tenant_id=$5,rank=$6,is_suppliment=$7,draw_hash=$8,seed=$9,updated_at=NOW()`,
      [input.id, input.giveaway_id, input.user_id, input.participant_id, input.tenant_id, input.rank, input.is_suppliment, input.draw_hash, input.seed]
    );
  }

  async listWinnersByGiveaway(giveawayId: string): Promise<any[]> {
    const { rows } = await this.pool.query(
      `SELECT id, giveaway_id, user_id, participant_id, tenant_id, rank, is_suppliment, draw_hash, seed, created_at
       FROM sorteos_winners WHERE giveaway_id = $1 ORDER BY rank`, [giveawayId]
    );
    return rows;
  }

  // Usage
  async upsertUsage(input: { id: string; user_id: string; giveaway_id: string | null; tenant_id: string; comments_processed: number; provider: string; latency_ms: number; created_at: string }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_usage_events (id, user_id, giveaway_id, tenant_id, comments_processed, provider, latency_ms, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET user_id=$2,giveaway_id=$3,tenant_id=$4,comments_processed=$5,provider=$6,latency_ms=$7,updated_at=NOW()`,
      [input.id, input.user_id, input.giveaway_id, input.tenant_id, input.comments_processed, input.provider, input.latency_ms, input.created_at]
    );
  }

  async usageForMonth(userId: string, tenant_id: string, month: string): Promise<{ comments_processed: number } | null> {
    const { rows } = await this.pool.query(
      `SELECT COALESCE(SUM(comments_processed),0)::int AS comments_processed FROM sorteos_usage_events WHERE user_id = $1 AND tenant_id = $2 AND created_at >= $3 AND created_at < $4`, [userId, tenant_id, `${month}-01`, `${month}-01`]
    );
    // simpler: filter by month key via calendar month range using now
    return rows[0] || { comments_processed: 0 };
  }

  // Certificates
  async upsertCertificate(input: { id: string; giveaway_id: string; user_id: string; tenant_id: string; title: string; winner_username: string; verification_hash: string; logo_url: string | null; brand_color: string | null; custom_text: string | null; }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_certificates (id, giveaway_id, user_id, tenant_id, title, winner_username, verification_hash, logo_url, brand_color, custom_text, issued_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW())
       ON CONFLICT (id) DO UPDATE SET giveaway_id=$2,user_id=$3,tenant_id=$4,title=$5,winner_username=$6,verification_hash=$7,logo_url=$8,brand_color=$9,custom_text=$10,issued_at=NOW()`,
      [input.id, input.giveaway_id, input.user_id, input.tenant_id, input.title, input.winner_username, input.verification_hash, input.logo_url, input.brand_color, input.custom_text]
    );
  }

  // Audit
  async upsertAudit(input: { id: string; actor_user_id: string | null; tenant_id: string; action: string; entity: string; entity_id: string; meta: any }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_audit_logs (id, actor_user_id, tenant_id, action, entity, entity_id, meta, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7, NOW())
       ON CONFLICT (id) DO NOTHING`,
      [input.id, input.actor_user_id, input.tenant_id, input.action, input.entity, input.entity_id, input.meta]
    );
  }

  // Feature flags
  async upsertFlag(input: { id: string; tenant_id: string | null; name: string; description: string | null; free: boolean; pro: boolean; business: boolean; enterprise: boolean; enabled: boolean }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_feature_flags (id, tenant_id, name, description, free, pro, business, enterprise, enabled, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW())
       ON CONFLICT (id) DO UPDATE SET tenant_id=$2,name=$3,description=$4,free=$5,pro=$6,business=$7,enterprise=$8,enabled=$9,updated_at=NOW()`,
      [input.id, input.tenant_id, input.name, input.description, input.free, input.pro, input.business, input.enterprise, input.enabled]
    );
  }

  async listFlags(tenant_id: string | null, plan: PlanId): Promise<any[]> {
    const { rows } = await this.pool.query(
      `SELECT id, name, description, free, pro, business, enterprise, enabled FROM sorteos_feature_flags WHERE (tenant_id IS NULL OR tenant_id = $1) ORDER BY enabled DESC, id`,
      [tenant_id]
    );
    return rows.map((r) => ({
      id: r.id, name: r.name, description: r.description, free: r.free, pro: r.pro, business: r.business, enterprise: r.enterprise, enabled: r.enabled,
    }));
  }

  // CMS
  async upsertCmsPost(input: { id: string; tenant_id: string; slug: string; title: string; excerpt: string; body: string; category: string; status: string }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_cms_posts (id, tenant_id, slug, title, excerpt, body, category, status, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW())
       ON CONFLICT (id) DO UPDATE SET tenant_id=$2,slug=$3,title=$4,excerpt=$5,body=$6,category=$7,status=$8,updated_at=NOW()`,
      [input.id, input.tenant_id, input.slug, input.title, input.excerpt, input.body, input.category, input.status]
    );
  }

  async getCmsPostBySlug(slug: string, tenant_id: string): Promise<any | null> {
    const { rows } = await this.pool.query(
      `SELECT id, tenant_id, slug, title, excerpt, body, category, status, created_at, updated_at, published_at FROM sorteos_cms_posts WHERE slug = $1 AND tenant_id = $2 AND status = 'published'`, [slug, tenant_id]
    );
    return rows[0] || null;
  }

  async listCmsByTenant(tenant_id: string, status?: string): Promise<any[]> {
    const { rows } = await this.pool.query(
      `SELECT id, tenant_id, slug, title, excerpt, body, category, status, created_at, updated_at, published_at FROM sorteos_cms_posts WHERE tenant_id = $1 ${status ? `AND status = $2` : ''} ORDER BY published_at IS NULL, published_at DESC`, [tenant_id, status].filter(Boolean) as string[]
    );
    return rows;
  }

  // Password resets
  async upsertPasswordReset(input: { id: string; user_id: string; tenant_id: string; expires_at: number }): Promise<void> {
    await this.pool.query(
      `INSERT INTO sorteos_password_resets (id, user_id, tenant_id, expires_at, created_at)
       VALUES ($1,$2,$3,$4, NOW())
       ON CONFLICT (id) DO UPDATE SET user_id=$2,tenant_id=$3,expires_at=$4,updated_at=NOW()`,
      [input.id, input.user_id, input.tenant_id, input.expires_at]
    );
  }

  async deletePasswordReset(id: string): Promise<void> {
    await this.pool.query(`DELETE FROM sorteos_password_resets WHERE id = $1`, [id]);
  }
}
