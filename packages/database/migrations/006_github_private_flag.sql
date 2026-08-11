-- =====================================================
-- MIGRACIÓN 006: Guardar visibilidad del repo de GitHub
-- Ejecutar en Supabase SQL Editor (después de la 005)
-- =====================================================

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_is_private BOOLEAN DEFAULT false;