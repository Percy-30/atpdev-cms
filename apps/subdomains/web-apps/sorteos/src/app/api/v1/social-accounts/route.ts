import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: 'acc_ig_1',
        platform: 'instagram',
        name: 'Cuenta Instagram Business',
        handle: '@atpdev_oficial',
        status: 'connected',
        expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'acc_fb_1',
        platform: 'facebook',
        name: 'Página de Facebook',
        handle: 'facebook.com/atpdev.pe',
        status: 'connected',
        expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'acc_yt_1',
        platform: 'youtube',
        name: 'Canal de YouTube',
        handle: '@ATPDevTech',
        status: 'connected',
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
      }
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    const { platform, oauthCode } = await req.json();

    return NextResponse.json({
      success: true,
      message: `Cuenta de ${platform} conectada exitosamente vía OAuth 2.0.`,
      account: {
        id: `acc_${platform}_${Date.now().toString(36)}`,
        platform,
        status: 'connected',
        connectedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al conectar cuenta social.' }, { status: 500 });
  }
}
