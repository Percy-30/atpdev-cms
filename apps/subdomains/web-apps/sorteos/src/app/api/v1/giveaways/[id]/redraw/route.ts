import { NextRequest, NextResponse } from 'next/server';
import { Winner } from '@/lib/types';
import { generateSha256Hash } from '@/lib/randomEngine';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { disqualifiedWinnerId, currentSubstitutes = [] } = await req.json();

    if (!disqualifiedWinnerId) {
      return NextResponse.json({ error: 'Se requiere el ID del ganador descalificado.' }, { status: 400 });
    }

    if (currentSubstitutes.length === 0) {
      return NextResponse.json(
        { error: 'No quedan suplentes en el pool de reserva para este sorteo.' },
        { status: 422 }
      );
    }

    // Seleccionar al primer suplente en orden de prelación
    const promotedSubstitute = currentSubstitutes[0];
    const remainingSubstitutes = currentSubstitutes.slice(1);

    const newWinner: Winner = {
      id: `win_redraw_${Date.now().toString(36)}`,
      participant: promotedSubstitute.participant,
      type: 'winner',
      position: 1,
      selectedAt: new Date().toISOString()
    };

    const newHash = await generateSha256Hash(
      `redraw-${id}-${disqualifiedWinnerId}-${newWinner.participant.username}-${Date.now()}`
    );

    return NextResponse.json({
      success: true,
      message: `El suplente @${promotedSubstitute.participant.username} ha sido promovido a ganador oficial (RF-024).`,
      newWinner,
      remainingSubstitutes,
      auditHash: newHash,
      executedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error en re-sorteo.' }, { status: 500 });
  }
}
