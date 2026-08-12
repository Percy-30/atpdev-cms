-- 010_page_views.sql
-- Tabla para registrar el tráfico web del ecosistema ATP Dev (Analíticas Propias)

CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain TEXT NOT NULL,
    path TEXT NOT NULL,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar (ya que los visitantes son anónimos)
CREATE POLICY "Permitir inserción pública de page_views" 
ON public.page_views 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Solo usuarios autenticados (el Admin) puede ver las analíticas
CREATE POLICY "Permitir lectura de page_views a autenticados" 
ON public.page_views 
FOR SELECT 
TO authenticated 
USING (true);

-- Índices para optimizar consultas del Dashboard
CREATE INDEX IF NOT EXISTS idx_page_views_domain ON public.page_views(domain);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);
