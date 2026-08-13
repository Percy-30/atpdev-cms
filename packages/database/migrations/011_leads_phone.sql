-- Agregar columna opcional 'phone' a la tabla 'leads'
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS phone TEXT;
