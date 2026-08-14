-- Agregar columna appstore a la tabla projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS appstore TEXT;
