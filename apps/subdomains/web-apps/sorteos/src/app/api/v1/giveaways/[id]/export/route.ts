import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/store';
import { fail, getAuthOrDemo } from '@/lib/server/http';

/** GET /api/v1/giveaways/:id/export?format=csv — RF-023 (participantes + ganadores). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthOrDemo(req);
  const { id } = await params;
  const g = db.giveaways.get(id);
  if (!g || g.userId !== auth.userId) return fail('Sorteo no encontrado.', 404);

  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = ['username,comment_text,eligible,exclusion_reason,role,selected_at'];
  for (const p of g.participants || []) {
    lines.push([esc(p.username), esc(p.commentText), esc(p.isEligible), esc(p.exclusionReason), esc('participant'), esc(p.timestamp)].join(','));
  }
  for (const w of g.winners || []) {
    lines.push([esc(w.participant.username), esc(w.participant.commentText), esc(true), esc(''), esc(`winner-${w.position}`), esc(w.selectedAt)].join(','));
  }
  for (const s of g.substitutes || []) {
    lines.push([esc(s.participant.username), esc(s.participant.commentText), esc(true), esc(''), esc(`substitute-${s.position}`), esc(s.selectedAt)].join(','));
  }
  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="sorteo-${id}-participantes.csv"`,
    },
  });
}
