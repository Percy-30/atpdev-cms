import { NextResponse } from 'next/server';
import { trackPageView } from '@atpdev/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, path } = body;

    if (!domain || !path) {
      return NextResponse.json({ error: 'Faltan parámetros domain o path' }, { status: 400 });
    }

    // Opcional: Extraer User Agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Llamar a Supabase
    const success = await trackPageView({
      domain,
      path,
      user_agent: userAgent,
      session_id: 'anon' // Podríamos usar cookies de sesión luego
    });

    if (!success) {
      return NextResponse.json({ error: 'Error guardando en BD' }, { status: 500 });
    }

    // Habilitar CORS para permitir llamadas desde almaniq.atpdev.dev
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return NextResponse.json({ success: true }, { status: 200, headers });
  } catch (error) {
    console.error('Error in /api/track:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return new NextResponse(null, { status: 200, headers });
}
