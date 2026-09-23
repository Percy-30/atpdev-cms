import { NextRequest, NextResponse } from 'next/server';
import { Participant } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, platform } = body as { url: string; platform: string };

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere una URL válida de la publicación.' },
        { status: 400 }
      );
    }

    // Ingestión y extracción simulada para V1
    const mockComments: Participant[] = [
      { id: 'c-1', username: 'valeria.gomez', commentText: '¡Me encanta este giveaway! Participando con @carlos_m y @sofia.r #sorteopro', isEligible: true },
      { id: 'c-2', username: 'diego_martinez99', commentText: 'Quiero ganar para regalarle a @mariana.paz #sorteopro', isEligible: true },
      { id: 'c-3', username: 'camila_rodriguez', commentText: 'Participo!! @lucia.v y @andres_b #sorteopro', isEligible: true },
      { id: 'c-4', username: 'lucas_fernandez', commentText: 'Genial concurso @marcos.tech #sorteopro', isEligible: true },
      { id: 'c-5', username: 'elena_castillo', commentText: 'Ojalá me toque a mí @pedro_ramirez @carla_m #sorteopro', isEligible: true },
      { id: 'c-6', username: 'juan_perez_pro', commentText: 'Mucha suerte a todos @mateo.dev #sorteopro', isEligible: true },
      { id: 'c-7', username: 'daniela_sanchez', commentText: '¡Listo! Cumplí todos los pasos con @flor_k #sorteopro', isEligible: true },
      { id: 'c-8', username: 'roberto_navarro', commentText: 'Increíble premio @laura_v #sorteopro', isEligible: true },
      { id: 'c-9', username: 'sol_alvarez', commentText: 'Participando con toda la fe @franco_d #sorteopro', isEligible: true },
      { id: 'c-10', username: 'tomas_herrera', commentText: 'Ojalá gane @monica_s #sorteopro', isEligible: true },
    ];

    return NextResponse.json({
      success: true,
      data: {
        url,
        platform: platform || 'instagram',
        commentsCount: mockComments.length,
        comments: mockComments,
        fetchedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener comentarios de la publicación.' },
      { status: 500 }
    );
  }
}
