import { NextRequest } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { audit, fail, getAuth, getAuthOrDemo, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

/**
 * CMS de marketing sin despliegues (RF-035/036).
 * GET /api/v1/cms/posts — público, solo publicados (cache 1h, SAD §19).
 * POST /api/v1/cms/posts — requiere admin/super-admin o demo (crea/actualiza borrador).
 */
export async function GET() {
  const posts = [...db.cms.values()]
    .filter((p) => p.status === 'published')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return ok({ data: posts }, { status: 200, headers: { 'Cache-Control': 'public, s-maxage=3600' } });
}

export async function POST(req: NextRequest) {
  const auth = getAuth(req) || getAuthOrDemo(req);
  const u = db.users.get(auth.userId);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const slug = cleanStr(body.slug, 120).toLowerCase().replace(/[^a-z0-9-]/g, '-') || `post-${Date.now().toString(36)}`;
  const existing = [...db.cms.values()].find((p) => p.slug === slug);
  const now = new Date().toISOString();
  const post = {
    id: existing?.id || uid('cms'),
    slug,
    title: cleanStr(body.title, 200) || existing?.title || 'Sin título',
    excerpt: cleanStr(body.excerpt, 500) || existing?.excerpt || '',
    body: cleanStr(body.body, 50000) || existing?.body || '',
    category: cleanStr(body.category, 80) || existing?.category || 'General',
    status: (cleanStr(body.status, 20) === 'published' ? 'published' : 'draft') as 'draft' | 'published',
    updatedAt: now,
  };
  db.cms.set(post);
  audit(auth.userId, 'cms.upsert', 'cms_post', post.id, { slug, status: post.status });
  return ok({ post }, existing ? 200 : 201);
}
