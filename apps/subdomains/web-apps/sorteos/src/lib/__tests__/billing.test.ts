import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { commentLimitOf, quotaCheck, usageThisMonth } from '../server/billing.ts';
import { db } from '../server/store.ts';

describe('commentLimitOf', () => {
  it('free=100 y enterprise mayor que pro', () => {
    assert.equal(commentLimitOf('free'), 100);
    assert.ok(commentLimitOf('enterprise') > commentLimitOf('pro'));
  });
});

describe('quotaCheck', () => {
  it('bloquea cuando el lote supera la cuota', () => {
    const r = quotaCheck('usuario-inexistente-quota', 10_000_000);
    assert.equal(r.allowed, false);
    assert.match(r.message || '', /Límite del plan/);
  });

  it('permite lote pequeño y avisa desde 80%', () => {
    const ok = quotaCheck('usuario-inexistente-quota', 1);
    assert.equal(ok.allowed, true);
    assert.equal(ok.warn80, false);
  });
});

describe('usageThisMonth', () => {
  it('usuario nuevo parte en cero', () => {
    const u = usageThisMonth('nadie-uso');
    assert.equal(u.used, 0);
    assert.ok(u.limit > 0);
    assert.match(u.month, /^\d{4}-\d{2}$/);
  });

  it('suma eventos del mes actual', () => {
    const uid = 'test-usage-1';
    db.users.set({ id: uid, name: 'T', email: `${uid}@t.local`, passwordHash: 'x', salt: 'y',
      role: 'user', status: 'active', plan: 'free', language: 'es',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    db.usage.push({
      id: 'u1', userId: uid, giveawayId: 'g1', commentsProcessed: 40,
      provider: 'instagram', latencyMs: 10, createdAt: new Date().toISOString(),
      monthKey: `${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}`,
    });
    const u = usageThisMonth(uid);
    assert.equal(u.used, 40);
    db.usage.deleteEvent('u1');
    db.users.delete(uid);
  });
});
