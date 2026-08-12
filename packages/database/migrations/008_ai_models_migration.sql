-- Crear la tabla ai_models
CREATE TABLE IF NOT EXISTS public.ai_models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    description TEXT NOT NULL,
    docs TEXT NOT NULL,
    color TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    capabilities TEXT[] NOT NULL,
    tags TEXT[] NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar permisos de seguridad (RLS)
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "Permitir lectura pública de ai_models" ON public.ai_models
    FOR SELECT USING (true);

-- Permitir todo a usuarios autenticados (Admin)
CREATE POLICY "Permitir todo a usuarios autenticados en ai_models" ON public.ai_models
    FOR ALL USING (auth.role() = 'authenticated');

-- Insertar los datos iniciales
INSERT INTO public.ai_models (id, name, provider, description, docs, color, icon_name, capabilities, tags, is_visible)
VALUES 
('tflite', 'TensorFlow Lite', 'Google', 'Motor principal de inferencia on-device. Corre 100% en el dispositivo móvil sin necesidad de conexión a internet.', 'https://www.tensorflow.org/lite', 'amber', 'Cpu', ARRAY['Clasificación de imágenes', 'On-device inference', 'Modelo .tflite', 'Sin latencia de red'], ARRAY['tensorflow', 'tflite', 'tensorflow lite', 'machine learning'], true),
('mediapipe', 'MediaPipe', 'Google', 'Framework de ML para procesamiento en tiempo real de visión computacional directamente en el dispositivo móvil.', 'https://mediapipe.dev', 'blue', 'FlaskConical', ARRAY['Detección de objetos', 'Landmarks', 'Tiempo real', 'Android/iOS'], ARRAY['mediapipe', 'vision', 'computer vision'], true),
('llama', 'Meta AI (Llama)', 'Meta', 'Motor de generación de textos y guiones. Genera contenido estructurado y optimizado desde tendencias curadas.', 'https://ai.meta.com', 'purple', 'Bot', ARRAY['Generación de texto', 'Razonamiento estructurado', 'Multiplataforma', 'Automatización'], ARRAY['llama', 'meta ai', 'llm', 'ai', 'generative ai'], true),
('gemini', 'Google Gemini API', 'Google DeepMind', 'Utilizado para análisis avanzado de código, generación de documentación y automatización de asistentes de desarrollo.', 'https://ai.google.dev', 'emerald', 'BrainCircuit', ARRAY['Chat contextual', 'Análisis de código', 'Razonamiento profundo', 'Multimodal'], ARRAY['gemini', 'gemini api', 'google ai', 'deepmind'], true),
('pgvector', 'Supabase pgvector', 'Supabase / PostgreSQL', 'Extensión de búsqueda vectorial para casos de uso RAG (Retrieval-Augmented Generation) sobre la base de datos de proyectos.', 'https://supabase.com/docs/guides/ai', 'cyan', 'Database', ARRAY['Búsqueda semántica', 'Embeddings', 'RAG', 'SQL + Vector'], ARRAY['pgvector', 'supabase', 'embeddings', 'rag'], true),
('whisper', 'OpenAI Whisper', 'OpenAI', 'Motor de transcripción automática de audio. Extrae textos precisos para integrarlos en subtítulos y pipelines de contenido.', 'https://openai.com/research/whisper', 'rose', 'Zap', ARRAY['Speech-to-text', 'Múltiples idiomas', 'Subtítulos automáticos', 'Alta precisión'], ARRAY['whisper', 'openai', 'speech to text', 'stt'], true)
ON CONFLICT (id) DO NOTHING;
