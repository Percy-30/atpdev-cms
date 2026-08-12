-- Si no ejecutaste el anterior, corre estos 3 primeros:
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS theme_mode TEXT DEFAULT 'dark';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS seed_color TEXT DEFAULT '#0052FF';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS color_theme TEXT DEFAULT 'vibrant';

-- Y estos 4 son para las nuevas opciones que agregamos ahora:
ALTER TABLE site_config ADD COLUMN font_headline TEXT DEFAULT 'Hanken Grotesk';
ALTER TABLE site_config ADD COLUMN font_body TEXT DEFAULT 'Inter';
ALTER TABLE site_config ADD COLUMN font_label TEXT DEFAULT 'JetBrains Mono';
ALTER TABLE site_config ADD COLUMN radius_scale TEXT DEFAULT 'medium';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS tertiary_color TEXT DEFAULT '#262626';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS neutral_color TEXT DEFAULT '#8A8A8A';
