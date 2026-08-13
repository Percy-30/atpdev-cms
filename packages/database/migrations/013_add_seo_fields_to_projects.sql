-- Migración para escalar los proyectos a nivel SEO y SSG

-- 1. Añadir columnas a la tabla projects si no existen
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS descripcion_larga TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS destacado BOOLEAN DEFAULT false;

-- 2. Asegurar que el slug sea único (ignorando nulls por ahora para no romper datos existentes)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_slug_key') THEN
        ALTER TABLE projects ADD CONSTRAINT projects_slug_key UNIQUE (slug);
    END IF;
END $$;

-- 3. Crear función de seguridad (RLS) para permitir lectura pública de estas columnas (ya existe para la tabla, pero se aplica a las nuevas columnas automáticamente)

-- NOTA PARA EL USUARIO:
-- Ejecuta este script en el SQL Editor de tu Dashboard de Supabase.
-- Luego, actualiza manualmente la columna "slug" de los proyectos que ya tienes creados 
-- (por ejemplo: 'lector-qr-pro', 'almaniq-web') para que no queden en blanco.
