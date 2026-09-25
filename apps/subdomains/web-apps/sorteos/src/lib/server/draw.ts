/**
 * Motor de sorteo server-side (RF-015, RF-021, RF-022).
 * CSPRNG vía node:crypto (auditable). Misma semántica que `@/lib/randomEngine`
 * pero segura en SSR/serverless.
 */
import { randomInt, createHash } from 'node:crypto';
import type { GiveawayRules, Participant, Winner } from '@/lib/types';

export function filterParticipantsServer(
  raw: Participant[],
  rules: GiveawayRules
): { eligible: Participant[]; excluded: Participant[] } {
  const eligible: Participant[] = [];
  const excluded: Participant[] = [];
  const seen = new Set<string>();
  for (const p of raw) {
    const uname = String(p.username || '').toLowerCase();
    if (rules.blockedUsers?.some((b) => b.toLowerCase() === uname)) {
      excluded.push({ ...p, isEligible: false, exclusionReason: 'Cuenta en lista negra' });
      continue;
    }
    if (rules.excludeDuplicates && seen.has(uname)) {
      excluded.push({ ...p, isEligible: false, exclusionReason: 'Comentario duplicado' });
      continue;
    }
    if (rules.minMentions > 0 && p.commentText) {
      const mentions = (p.commentText.match(/@([a-zA-Z0-9._]+)/g) || []).length;
      if (mentions < rules.minMentions) {
        excluded.push({ ...p, isEligible: false, exclusionReason: `Requiere ${rules.minMentions} menciones (tiene ${mentions})` });
        continue;
      }
    }
    if (rules.requiredHashtag?.trim()) {
      const tag = rules.requiredHashtag.trim().toLowerCase();
      if (!p.commentText?.toLowerCase().includes(tag)) {
        excluded.push({ ...p, isEligible: false, exclusionReason: `No incluye ${rules.requiredHashtag}` });
        continue;
      }
    }
    seen.add(uname);
    eligible.push({ ...p, isEligible: true });
  }
  return { eligible, excluded };
}

export function shuffleServer<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sha256Server(s: string): string {
  return createHash('sha256').update(s, 'utf8').digest('hex');
}

export function executeDrawServer(
  eligible: Participant[],
  winnersCount: number,
  substitutesCount: number
): { winners: Winner[]; substitutes: Winner[]; verificationHash: string; timestamp: string } {
  if (eligible.length === 0) throw new Error('No hay participantes elegibles.');
  if (winnersCount < 1) throw new Error('winnersCount debe ser ≥ 1.');
  const timestamp = new Date().toISOString();
  const shuffled = shuffleServer(eligible);
  const winners: Winner[] = shuffled.slice(0, Math.min(winnersCount, shuffled.length)).map((p, i) => ({
    id: `win-${i + 1}-${Date.now().toString(36)}`,
    participant: p, type: 'winner', position: i + 1, selectedAt: timestamp,
  }));
  const substitutes: Winner[] = shuffled.slice(winners.length, winners.length + substitutesCount).map((p, i) => ({
    id: `sub-${i + 1}-${Date.now().toString(36)}`,
    participant: p, type: 'substitute', position: i + 1, selectedAt: timestamp,
  }));
  const auditStr = `${timestamp}|W:${winners.map((w) => w.participant.username).join(',')}|S:${substitutes.map((s) => s.participant.username).join(',')}|TOTAL:${eligible.length}`;
  return { winners, substitutes, verificationHash: sha256Server(auditStr), timestamp };
}
