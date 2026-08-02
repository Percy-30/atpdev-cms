export async function translateClient(text: string, lang: string): Promise<string> {
  if (!text) return text;
  if (lang === 'es' || !lang) return text; // Español es el predeterminado

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, targetLang: lang }),
    });

    if (!res.ok) throw new Error('Network error');
    
    const data = await res.json();
    return data.translated || text;
  } catch (error) {
    console.error('Translation error on client:', error);
    return text; // Fallback al texto original
  }
}
