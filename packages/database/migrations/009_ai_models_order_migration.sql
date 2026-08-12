-- 009_ai_models_order_migration.sql
-- Este script agrega la columna order_index a la tabla ai_models
-- y establece un valor secuencial por defecto basado en la creación.

ALTER TABLE public.ai_models 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Actualizar el índice de orden actual para que coincida con su orden de creación
WITH numbered_models AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
    FROM public.ai_models
)
UPDATE public.ai_models
SET order_index = numbered_models.row_num
FROM numbered_models
WHERE public.ai_models.id = numbered_models.id;
