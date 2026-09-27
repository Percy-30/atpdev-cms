-- Sorteos Pro — Core (RFC-000..RFC-040)
-- Multi-tenant: filas por user_id. Persistencia en Postgres.
-- No es un "create extension"; se aplica sobre un DB de Postgres 12+.

CREATE TABLE IF NOT EXISTS sorteos_users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  TEXT NOT NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  password_hash TEXT,
  password_salt TEXT,
  role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super-admin')),
  status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  plan       TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
  language   TEXT NOT NULL DEFAULT 'es',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sorteos_users_tenant ON sorteos_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sorteos_users_email ON sorteos_users(email);

CREATE TABLE IF NOT EXISTS sorteos_social_accounts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
  tenant_id    TEXT NOT NULL,
  platform     TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'youtube')),
  name         TEXT NOT NULL,
  handle       TEXT,
  encrypted_token TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'expired', 'revoked')),
  scopes       TEXT[] NOT NULL DEFAULT '{}',
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,
  refreshed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorteos_social_user ON sorteos_social_accounts(user_id);

CREATE TABLE IF NOT EXISTS sorteos_giveaways (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
  tenant_id    TEXT NOT NULL,
  network      TEXT NOT NULL CHECK (network IN ('instagram', 'facebook', 'youtube', 'twitter', 'tiktok')),
  platform     TEXT NOT NULL,
  social_type  TEXT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  post_url     TEXT NOT NULL,
  rules_json   JSONB NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'executed', 'expired')),
  visibility   TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'team', 'public')),
  eligibility  JSONB NOT NULL DEFAULT '[]',
  drawn_at     TIMESTAMPTZ,
  closed_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorteos_giveaways_user ON sorteos_giveaways(user_id);
CREATE INDEX IF NOT EXISTS idx_sorteos_giveaways_status ON sorteos_giveaways(status);

CREATE TABLE IF NOT EXISTS sorteos_participants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id  UUID NOT NULL REFERENCES sorteos_giveaways(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES sorteos_users(id) ON DELETE SET NULL,
  tenant_id    TEXT NOT NULL,
  platform     TEXT NOT NULL,
  actor_id     TEXT NOT NULL,
  username     TEXT NOT NULL DEFAULT '',
  invite_code  TEXT NOT NULL DEFAULT '',
  comment_url  TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'excluded', 'winner', 'suppliment')),
  source       TEXT NOT NULL DEFAULT 'manual',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorteos_participants_giveaway ON sorteos_participants(giveaway_id);

CREATE TABLE IF NOT EXISTS sorteos_winners (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id  UUID NOT NULL REFERENCES sorteos_giveaways(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES sorteos_users(id) ON DELETE SET NULL,
  participant_id UUID REFERENCES sorteos_participants(id) ON DELETE SET NULL,
  tenant_id    TEXT NOT NULL,
  rank         INTEGER NOT NULL,
  is_suppliment BOOLEAN NOT NULL DEFAULT false,
  draw_hash    TEXT NOT NULL,
  seed         TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorteos_winners_giveaway ON sorteos_winners(giveaway_id);

CREATE TABLE IF NOT EXISTS sorteos_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
  tenant_id    TEXT NOT NULL,
  plan         TEXT NOT NULL CHECK (plan IN ('pro', 'business', 'enterprise')),
  stripe_id    TEXT,
  stripe_price TEXT,
  stripe_status TEXT NOT NULL DEFAULT 'free' CHECK (stripe_status IN ('free', 'active', 'past_due', 'canceled', 'incomplete')),
  cadence      TEXT NOT NULL DEFAULT 'monthly' CHECK (cadence IN ('monthly', 'annual')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trial_ends_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorteos_sub_user ON sorteos_subscriptions(user_id);

CREATE TABLE IF NOT EXISTS sorteos_usage_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
  tenant_id    TEXT NOT NULL,
  giveaway_id  UUID REFERENCES sorteos_giveaways(id) ON DELETE SET NULL,
  comments_processed INTEGER NOT NULL DEFAULT 0,
  provider     TEXT NOT NULL DEFAULT 'mock',
  latency_ms   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorteos_usage_user ON sorteos_usage_events(user_id);

CREATE TABLE IF NOT EXISTS sorteos_certificates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id  UUID NOT NULL REFERENCES sorteos_giveaways(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES sorteos_users(id) ON DELETE CASCADE,
  tenant_id    TEXT NOT NULL,
  title        TEXT NOT NULL,
  winner_username TEXT NOT NULL,
  verification_hash TEXT NOT NULL,
  logo_url     TEXT,
  brand_color  TEXT,
  custom_text  TEXT,
  issued_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorteos_certificates_user ON sorteos_certificates(user_id);

CREATE TABLE IF NOT EXISTS sorteos_audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES sorteos_users(id) ON DELETE SET NULL,
  tenant_id    TEXT NOT NULL,
  action       TEXT NOT NULL,
  entity       TEXT NOT NULL,
  entity_id    TEXT NOT NULL,
  meta         JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorteos_audit_actor ON sorteos_audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_sorteos_audit_actor_tenant ON sorteos_audit_logs(tenant_id, actor_user_id);
CREATE INDEX IF NOT EXISTS idx_sorteos_audit_created ON sorteos_audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS sorteos_feature_flags (
  id           TEXT PRIMARY KEY,
  tenant_id    TEXT,
  name         TEXT NOT NULL,
  description  TEXT,
  free         BOOLEAN NOT NULL DEFAULT false,
  pro          BOOLEAN NOT NULL DEFAULT false,
  business     BOOLEAN NOT NULL DEFAULT false,
  enterprise   BOOLEAN NOT NULL DEFAULT false,
  enabled      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorteos_flags_tenant ON sorteos_feature_flags(tenant_id);

CREATE TABLE IF NOT EXISTS sorteos_cms_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    TEXT NOT NULL,
  slug         TEXT NOT NULL,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  body         TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sorteos_cms_tenant_status ON sorteos_cms_posts(tenant_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sorteos_cms_slug ON sorteos_cms_posts(slug) WHERE status = 'published';
