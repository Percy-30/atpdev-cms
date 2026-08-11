-- =====================================================
-- MIGRACIÓN 005: Páginas de detalle /app/[slug] + integración GitHub
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Slug único para la URL pública (atpdev.dev/app/[slug])
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Repo de GitHub asociado, formato "usuario/repo" (ej. "Percy-30/lector-qr-pro")
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_repo TEXT;

-- 3. Contenido extendido para la página de detalle (la card usa `description`, corta)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS screenshots TEXT[] DEFAULT '{}';

-- 4. Caché de datos de GitHub (se llenan vía API, no se consultan en cada visita)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_stars INTEGER;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_language TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_synced_at TIMESTAMP WITH TIME ZONE;

-- 5. Backfill de slugs para los proyectos que ya existen, a partir del título
--    (minúsculas, espacios -> guiones, sin caracteres especiales)
UPDATE public.projects
SET slug = lower(
  regexp_replace(
    regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
)
WHERE slug IS NULL;

-- 6. Ya con datos, forzamos slug obligatorio y único
ALTER TABLE public.projects ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique_idx ON public.projects (slug);

-- Nota: la lectura pública de `projects` ya está cubierta por la policy
-- "Lectura publica de proyectos" creada en schema.sql (FOR SELECT USING (true)),
-- así que estas columnas nuevas quedan visibles automáticamente sin policies extra.