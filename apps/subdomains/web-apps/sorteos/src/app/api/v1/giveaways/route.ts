import { NextRequest } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';
import { cleanStr, isValidPostUrl, toInt } from '@/lib/server/validators';
import type { Giveaway, GiveawayRules } from '@/lib/types';

const PLATFORMS = ['lista', 'ruleta', 'instagram', 'facebook', 'youtube'] as const;

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
    return fail('platform debe ser lista, ruleta, instagram, facebook o youtube.', 400);
  }
  const postUrl = cleanStr(body.postUrl, 500);
  if (['instagram', 'facebook', 'youtube'].includes(platform)) {
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

  const id = `sorteo_${uid('').replace(/^_/, '')}`;
  const now = new Date().toISOString();
  const giveaway: Giveaway & { userId: string; updatedAt: string; auditLog: string[] } = {
    id,
    userId: auth.userId,
    title,
    description: cleanStr(body.description, 2000) || undefined,
    platform: platform as Giveaway['platform'],
    network: platform as unknown as Giveaway['network'],
    postUrl: postUrl || undefined,
    status: scheduledAt ? 'scheduled' : 'draft',
    rules,
    winners: [],
    substitutes: [],
    scheduledAt,
    createdAt: now,
    updatedAt: now,
    auditLog: [`${now} creado`],
  };
  db.giveaways.set(giveaway);
  audit(auth.userId, 'giveaway.create', 'giveaway', id, { platform });
  logEvent('giveaway.create', { userId: auth.userId, giveawayId: id, platform });
  return ok({ message: 'Sorteo creado exitosamente.', giveaway }, 201);
}
