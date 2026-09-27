# Sorteos Pro — Preparación para Producción

Este documento resume los pasos para llevar `sorteos` de "código lista" a "servidor listo".

## 1. Variables de entorno obligatorias

Copia `.env.example` a `.env.local` (o equivalente en tu deploy) y rellena:

```env
# Auth y cifrado (obligatorios)
SORTEOS_JWT_SECRET=<minimo-32-caracteres>
SORTEOS_TOKEN_KEY=<32-bytes-base64>

# Cron protegido
CRON_SECRET=<secreto-aleatorio>

# Email transaccional
RESEND_API_KEY=
RESEND_FROM=Sorteos Pro <noreply@sorteos.pro>

# Stripe (cuando quieras billing real)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_ANNUAL=
STRIPE_PRICE_BUSINESS_MONTHLY=
STRIPE_PRICE_BUSINESS_ANNUAL=
STRIPE_PRICE_ENTERPRISE_MONTHLY=
STRIPE_PRICE_ENTERPRISE_ANNUAL=

# Redis para queues (BullMQ)
REDIS_URL=redis://localhost:6379
# o
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# PostgreSQL (requerido para persistencia real)
DATABASE_URL=postgres://user:password@host:5432/sorteos_pro

# Redes sociales (opcional, modo mock si quedan en blanco)
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
YOUTUBE_API_KEY=
```

> En producción, **cambia inmediatamente** `admin@sorteos.pro / Admin1234!` tras el primer seed.

## 2. Base de datos

### 2.1 Levantar PostgreSQL local

```bash
# Ejemplo con Docker
docker run --name sorteos-postgres -e POSTGRES_PASSWORD=change-me -p 5432:5432 -d postgres:16
```

### 2.2 Aplicar migraciones

```bash
cd apps/subdomains/web-apps/sorteos
export DATABASE_URL=postgres://user:password@localhost:5432/sorteos_pro
npm run db:migrate
```

Esto ejecuta, en orden alfabético, todos los `packages/database/migrations/*.sql`, incluidas las de Sorteos Pro (`sorceos-001_sorteos_core.sql`, `sorceos-002_seed_and_cron.sql`).

### 2.3 Sembrar datos de demostración

```bash
npm run db:seed
```

Esto crea:
- Superadmin `admin@sorteos.pro` / `Admin1234!`.
- CMS `guia-sorteo-instagram-2026`.
- Feature flags (`ff-multi-post`, `ff-custom-branding`, `ff-scheduled-draws`, `ff-advanced-filters`, `ff-email-notifications`).

## 3. Queues (BullMQ + Redis)

Para ejecutar el worker de colas:

```bash
export DATABASE_URL=postgres://user:password@localhost:5432/sorteos_pro
export REDIS_URL=redis://localhost:6379
npm run worker
```

Esto procesará jobs `giveaway:execute` asincrónicamente. Si no estás usando BullMQ en el deploy, puedes seguir manteniendo el flujo sincrónico que ya existe en `/api/v1/giveaways/[id]/execute`.

## 4. Stripe (facturación)

Para activar Stripe:
- Pon `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET`.
- Define `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_ANNUAL`, etc.
- Configura el endpoint `/api/v1/billing/webhook` para recibir eventos `checkout.session.completed`, `customer.subscription.updated`, `invoice.paid`, `invoice.payment_failed`.

Si no defines las variables, el checkout se comporta en modo **mock-verified** y no cobra.

## 5. Redes sociales y OAuth

Sin `META_APP_ID`, `META_APP_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` o `YOUTUBE_API_KEY`, las cuentas conectar y los fetch de comentarios operan en modo **mock-verified**. Para producción, añade las credenciales apropiadas y verifica los URLs `redirect_uri` en cada developer console.

## 6. Limpieza y buenas prácticas

- Siempre cambia `admin@sorteos.pro / Admin1234!` en producción.
- Usa un `DATABASE_URL` con usuario/`password` de solo aplicación y sin acceso a otras bases de datos.
- No exponas `SSO_TOKEN_KEY` en el `next.config` ni en el `CLIENT`.
- Incluye `Cache-Control` en endpoints públicos (ya implementado).
- Considera añadir un `health` exterior que valide `health/ping`, Redis y Postgres.

## 7. Comandos resumidos

```bash
# Levantar entorno
npm run dev:sorteos          # en apps/subdomains/web-apps/sorteos

# Compilación, tests y lint
npm run build:sorteos
npm test --prefix apps/subdomains/web-apps/sorteos
npm run lint --prefix apps/subdomains/web-apps/sorteos

# Producción
export DATABASE_URL=postgres://...
export REDIS_URL=redis://localhost:6379
npm run db:migrate
npm run db:seed
npm run worker
```

## 8. Métricas y observabilidad

- Logs estructurados JSON: `service: sorteos-pro`.
- Endpoints de métricas Prometheus: `/api/v1/metrics`.
- Auditoría: `/api/v1/audit` (consulta manual) y `audit_logs` en Postgres.
- Usa `GET /api/v1/health` para liveness/readiness en el deploy.
