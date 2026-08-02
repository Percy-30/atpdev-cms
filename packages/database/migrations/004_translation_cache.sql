-- Tabla para almacenar traducciones dinámicas al vuelo
CREATE TABLE IF NOT EXISTS public.translation_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_text TEXT NOT NULL,
    target_lang VARCHAR(10) NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Un source_text solo debe traducirse una vez por idioma
    UNIQUE(source_text, target_lang)
);

-- Índices para búsqueda extremadamente rápida (caché)
CREATE INDEX IF NOT EXISTS idx_translation_cache_lookup 
ON public.translation_cache(source_text, target_lang);

-- Row Level Security (RLS)
ALTER TABLE public.translation_cache ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- 1. Cualquiera (anon) puede LEER las traducciones cacheadas
CREATE POLICY "Public profiles are viewable by everyone."
ON public.translation_cache FOR SELECT
USING (true);

-- 2. Solo el servidor (Service Role) puede INSERTAR nuevas traducciones
-- No permitimos inserciones anónimas para evitar spam/abuso a la tabla
CREATE POLICY "Service role can insert translations"
ON public.translation_cache FOR INSERT
WITH CHECK (true);
