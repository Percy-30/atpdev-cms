import { NextRequest } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';
import { cleanStr, isValidPostUrl, toInt } from '@/lib/server/validators';
import type { Giveaway, GiveawayRules } from '@/lib/types';

const PLATFORMS = ['lista', 'ruleta', 'instagram', 'facebook', 'youtube', 'tiktok', 'x', 'threads'] as const;

function defaultRules(): GiveawayRules {
  return { excludeDuplicates: true, minMentions: 0, blockedUsers: [], winnersCount: 1, substitutesCount: 1 };
}

/**
 * GET /api/v1/giveaways — lista del tenant (paginada).
 * POST /api/v1/giveaways — RF-010..017 (lista/ruleta/social + reglas + programación).
 */
export async function GET(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const list = db.giveaways.list().filter((g) => g.userId === auth.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((g) => ({
      id: g.id, title: g.title, platform: g.platform, network: g.network,
      postUrl: g.postUrl, status: g.status, winnersCount: g.winners.length,
      totalCommentsCount: g.totalCommentsCount, scheduledAt: g.scheduledAt,
      verificationHash: g.verificationHash, createdAt: g.createdAt,
    }));
  return ok({ data: list });
}

export async function POST(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));

  const title = cleanStr(body.title, 140);
  if (!title) return fail('El título es obligatorio.', 400);
  const platform = cleanStr(body.platform, 20).toLowerCase() || 'instagram';
  if (!(PLATFORMS as readonly string[]).includes(platform)) {
    return fail('platform debe ser lista, ruleta, instagram, facebook, youtube, tiktok, x o threads.', 400);
  }
  const postUrl = cleanStr(body.postUrl, 500);
  if (['instagram', 'facebook', 'youtube', 'tiktok', 'x', 'threads'].includes(platform)) {
    if (!postUrl || !isValidPostUrl(platform, postUrl)) {
      return fail(`postUrl inválida para ${platform}.`, 400);
    }
  }

  const rawRules = (body.rules || {}) as Partial<GiveawayRules>;
  const rules: GiveawayRules = {
    excludeDuplicates: rawRules.excludeDuplicates ?? true,
    minMentions: toInt(rawRules.minMentions, 0, 0, 10),
    requiredHashtag: cleanStr(rawRules.requiredHashtag, 60) || undefined,
    blockedUsers: Array.isArray(rawRules.blockedUsers)
      ? rawRules.blockedUsers.map((u) => cleanStr(u, 80)).filter(Boolean).slice(0, 100)
      : [],
    winnersCount: toInt(rawRules.winnersCount, 1, 1, 50),
    substitutesCount: toInt(rawRules.substitutesCount, 1, 0, 50),
  };

  const scheduledAt = cleanStr(body.scheduledAt, 40) || undefined;
  if (scheduledAt && Number.isNaN(Date.parse(scheduledAt))) {
    return fail('scheduledAt debe ser fecha ISO válida.', 400);
  }

  const id = cleanStr(body.id, 60) || `sorteo_${uid('').replace(/^_/, '')}`;
  const now = new Date().toISOString();
  const totalComments = toInt(body.totalCommentsCount, 0, 0, 5000000);
  const winners = Array.isArray(body.winners) ? body.winners : [];
  const substitutes = Array.isArray(body.substitutes) ? body.substitutes : [];
  const certificateId = cleanStr(body.certificateId, 100) || undefined;
  const verificationHash = cleanStr(body.verificationHash, 128) || undefined;
  const status = cleanStr(body.status, 20) || (scheduledAt ? 'scheduled' : winners.length > 0 ? 'completed' : 'draft');

  const giveaway: Giveaway & { userId: string; updatedAt: string; auditLog: string[] } = {
    id,
    userId: auth.userId,
    title,
    description: cleanStr(body.description, 2000) || undefined,
    platform: platform as Giveaway['platform'],
    network: platform as unknown as Giveaway['network'],
    postUrl: postUrl || undefined,
    status: (status === 'finished' ? 'completed' : status) as Giveaway['status'],
    totalCommentsCount: totalComments,
    rules,
    winners,
    substitutes,
    certificateId,
    verificationHash,
    scheduledAt,
    executedAt: winners.length > 0 ? now : undefined,
    createdAt: now,
    updatedAt: now,
    auditLog: [`${now} creado con ${totalComments} comentarios`],
  };
  db.giveaways.set(giveaway);

  // Registrar consumo de comentarios en db.usage
  if (totalComments > 0) {
    db.usage.push({
      id: uid('usg'),
      userId: auth.userId,
      giveawayId: id,
      commentsProcessed: totalComments,
      provider: platform,
      latencyMs: 120,
      createdAt: now,
      monthKey: `${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}`,
    });
  }

  if (certificateId) {
    db.certificates.set({
      id: certificateId,
      giveawayId: id,
      userId: auth.userId,
      title,
      winnerUsername: winners[0]?.participant?.username || '',
      verificationHash: verificationHash || '',
      issuedAt: now,
    });
  }

  // Sincronizar inmediatamente con la base de datos central (@atpdev/database)
  try {
    const { recordSorteosUserConsumption, saveSorteosGiveaway, syncRealSorteosUser } = await import('@atpdev/database');
    await syncRealSorteosUser({
      id: auth.userId,
      email: auth.email,
    });
    if (totalComments > 0) {
      await recordSorteosUserConsumption(auth.email, totalComments, true);
    }
    await saveSorteosGiveaway({
      id,
      title,
      platform: (platform === 'youtube' ? 'youtube' : platform === 'facebook' ? 'facebook' : 'instagram') as any,
      network: platform,
      postUrl,
      authorUsername: winners[0]?.participant?.username ? `@${winners[0].participant.username}` : '@organizador',
      totalCommentsCount: totalComments,
      status: (status === 'finished' ? 'completed' : status) as any,
      rules: {
        excludeDuplicates: rules.excludeDuplicates,
        minMentions: rules.minMentions,
        requiredHashtag: rules.requiredHashtag,
        blockedUsers: rules.blockedUsers,
        winnersCount: rules.winnersCount,
        substitutesCount: rules.substitutesCount,
      },
      winners: winners.map((w: any) => ({
        id: w.id || `w-${Date.now()}`,
        position: w.position || 1,
        type: 'winner',
        selectedAt: now,
        participant: {
          id: w.participant?.id || 'p-1',
          username: w.participant?.username || 'ganador',
          name: w.participant?.name,
          avatarUrl: w.participant?.avatarUrl,
          commentText: w.participant?.commentText,
          isEligible: true,
        }
      })),
      substitutes: substitutes.map((s: any, idx: number) => ({
        id: s.id || `s-${Date.now()}-${idx}`,
        position: s.position || idx + 1,
        type: 'substitute',
        selectedAt: now,
        participant: {
          id: s.participant?.id || `s-${idx}`,
          username: s.participant?.username || 'suplente',
          name: s.participant?.name,
          avatarUrl: s.participant?.avatarUrl,
          commentText: s.participant?.commentText,
          isEligible: true,
        }
      })),
      certificateId,
      verificationHash,
      createdAt: now,
      executedAt: winners.length > 0 ? now : undefined,
    });
  } catch (err) {
    console.error('Error synchronizing giveaway with central database:', err);
  }

  audit(auth.userId, 'giveaway.create', 'giveaway', id, { platform, totalComments });
  logEvent('giveaway.create', { userId: auth.userId, giveawayId: id, platform, totalComments });
  return ok({ message: 'Sorteo creado exitosamente.', giveaway }, 201);
}
