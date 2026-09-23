import { NextRequest, NextResponse } from 'next/server';
import { executeVerifiableDraw, filterParticipants } from '@/lib/randomEngine';
import { Participant, GiveawayRules } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      participants, 
      winnersCount = 1, 
      substitutesCount = 0, 
      rules 
    } = body as {
      participants: Participant[];
      winnersCount?: number;
      substitutesCount?: number;
      rules?: GiveawayRules;
    };

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere una lista de participantes válida y no vacía.' },
        { status: 400 }
      );
    }

    // Aplicar filtros si se suministran reglas
    let eligible = participants;
    let excluded: Participant[] = [];

    if (rules) {
      const filtered = filterParticipants(participants, rules);
      eligible = filtered.eligible;
      excluded = filtered.excluded;
    }

    if (eligible.length === 0) {
      return NextResponse.json(
        { error: 'No quedaron participantes elegibles tras aplicar los filtros de exclusión.' },
        { status: 422 }
      );
    }

    const drawResult = await executeVerifiableDraw(eligible, winnersCount, substitutesCount);

    return NextResponse.json({
      success: true,
      data: {
        winners: drawResult.winners,
        substitutes: drawResult.substitutes,
        verificationHash: drawResult.verificationHash,
        timestamp: drawResult.timestamp,
        totalEligible: eligible.length,
        totalExcluded: excluded.length,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error interno al procesar el sorteo.' },
      { status: 500 }
    );
  }
}
