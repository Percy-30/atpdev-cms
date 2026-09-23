import { NextRequest, NextResponse } from 'next/server';
import { executeVerifiableDraw, filterParticipants } from '@/lib/randomEngine';
import { Participant, GiveawayRules } from '@/lib/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { participants, rules, winnersCount = 1, substitutesCount = 2 } = body;

    if (!participants || participants.length === 0) {
      return NextResponse.json({ error: 'Lista de participantes requerida.' }, { status: 400 });
    }

    const { eligible, excluded } = filterParticipants(participants, rules || {
      excludeDuplicates: true,
      minMentions: 1,
      blockedUsers: [],
      winnersCount,
      substitutesCount
    });

    const result = await executeVerifiableDraw(eligible, winnersCount, substitutesCount);

    return NextResponse.json({
      success: true,
      giveawayId: id,
      winners: result.winners,
      substitutes: result.substitutes,
      verificationHash: result.verificationHash,
      timestamp: result.timestamp,
      totalEligible: eligible.length,
      totalExcluded: excluded.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al ejecutar sorteo.' }, { status: 500 });
  }
}
