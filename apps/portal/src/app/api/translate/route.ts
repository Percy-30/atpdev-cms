import { NextResponse } from 'next/server';
import { translateText } from '@atpdev/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, targetLang } = body;

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
    }

    const translated = await translateText(text, targetLang);
    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Translation API route error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
