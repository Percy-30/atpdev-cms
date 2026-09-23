import { NextRequest, NextResponse } from 'next/server';
import { Giveaway } from '@/lib/types';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: 'sorteo-aniversario-2026',
        title: 'Sorteo Oficial de Aniversario ATP Dev',
        platform: 'instagram',
        status: 'completed',
        winnersCount: 1,
        totalCommentsCount: 1420,
        createdAt: '2026-09-22T14:30:00.000Z'
      }
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newGiveaway: Giveaway = {
      id: `sorteo_${Date.now().toString(36)}`,
      title: body.title || 'Nuevo Sorteo',
      platform: body.platform || 'instagram',
      postUrl: body.postUrl,
      status: body.scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: body.scheduledAt,
      rules: body.rules || {
        excludeDuplicates: true,
        minMentions: 1,
        blockedUsers: [],
        winnersCount: 1,
        substitutesCount: 2
      },
      winners: [],
      substitutes: [],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Sorteo creado exitosamente.',
      giveaway: newGiveaway
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al crear sorteo.' }, { status: 500 });
  }
}
