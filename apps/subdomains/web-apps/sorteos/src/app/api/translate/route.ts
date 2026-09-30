import { NextResponse } from 'next/server';
import { translateText } from '@atpdev/database';

async function fallbackGoogleTranslate(text: string, targetLang: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      next: { revalidate: 86400 } // Cache for 24h
    });

    if (!res.ok) return text;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((item: any) => item[0]).join('');
    }
    return text;
  } catch {
    return text;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, texts, targetLang } = body;

    if (!targetLang) {
      return NextResponse.json({ error: 'Missing targetLang' }, { status: 400 });
    }

    if (targetLang === 'es') {
      if (Array.isArray(texts)) {
        return NextResponse.json({ translations: texts });
      }
      return NextResponse.json({ translated: text || '' });
    }

    // Single text translation
    if (typeof text === 'string') {
      let translated = '';
      try {
        translated = await translateText(text, targetLang);
      } catch {
        translated = '';
      }

      // If database translation returned original or failed, use Google fallback
      if (!translated || translated === text) {
        translated = await fallbackGoogleTranslate(text, targetLang);
      }

      return NextResponse.json({ translated: translated || text });
    }

    // Batch texts translation
    if (Array.isArray(texts)) {
      const translations = await Promise.all(
        texts.map(async (t: string) => {
          if (!t) return t;
          let tr = '';
          try {
            tr = await translateText(t, targetLang);
          } catch {
            tr = '';
          }
          if (!tr || tr === t) {
            tr = await fallbackGoogleTranslate(t, targetLang);
          }
          return tr || t;
        })
      );
      return NextResponse.json({ translations });
    }

    return NextResponse.json({ error: 'Missing text or texts array' }, { status: 400 });
  } catch (err: any) {
    console.error('Translation route error:', err);
    return NextResponse.json({ error: err.message || 'Translation failed' }, { status: 500 });
  }
}
