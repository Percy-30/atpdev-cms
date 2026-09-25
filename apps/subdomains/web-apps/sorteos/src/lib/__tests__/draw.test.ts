import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  executeDrawServer,
  filterParticipantsServer,
  sha256Server,
  shuffleServer,
} from '../server/draw.ts';
import type { GiveawayRules, Participant } from '../types.ts';

const baseRules: GiveawayRules = {
  excludeDuplicates: true,
  minMentions: 1,
  blockedUsers: [],
  winnersCount: 1,
  substitutesCount: 1,
};

function p(username: string, commentText = 'hola @amigo #sorteopro'): Participant {
  return { id: `id-${username}`, username, commentText, isEligible: true };
}

describe('filterParticipantsServer', () => {
  it('excluye duplicados cuando excludeDuplicates=true', () => {
    const { eligible, excluded } = filterParticipantsServer([p('ana'), p('ANA', 'otro @x #sorteopro'), p('luis')], baseRules);
    assert.equal(eligible.length, 2);
    assert.equal(excluded.length, 1);
    assert.equal(excluded[0].exclusionReason, 'Comentario duplicado');
  });

  it('exige mínimo de menciones', () => {
    const { eligible, excluded } = filterParticipantsServer(
      [p('ana', 'sin menciones #sorteopro'), p('luis', 'voy con @a y @b #sorteopro')],
      { ...baseRules, minMentions: 2 }
    );
    assert.equal(eligible.length, 1);
    assert.equal(eligible[0].username, 'luis');
    assert.match(excluded[0].exclusionReason || '', /menciones/);
  });

  it('exige hashtag requerido', () => {
    const { eligible } = filterParticipantsServer(
      [p('ana', 'voy con @a sin tag'), p('luis')],
      { ...baseRules, requiredHashtag: '#sorteopro' }
    );
    assert.deepEqual(eligible.map((x) => x.username), ['luis']);
  });

  it('respeta lista negra insensible a mayúsculas', () => {
    const { eligible, excluded } = filterParticipantsServer([p('Bot_Spammer'), p('ana')], {
      ...baseRules,
      blockedUsers: ['bot_spammer'],
    });
    assert.equal(eligible.length, 1);
    assert.equal(excluded[0].exclusionReason, 'Cuenta en lista negra');
  });
});

describe('executeDrawServer', () => {
  it('reparte ganadores y suplentes con hash verificable', () => {
    const users = ['a', 'b', 'c', 'd'].map((u) => p(u));
    const { winners, substitutes, verificationHash, timestamp } = executeDrawServer(users, 1, 2);
    assert.equal(winners.length, 1);
    assert.equal(substitutes.length, 2);
    assert.equal(verificationHash.length, 64);
    assert.ok(Date.parse(timestamp) > 0);
    const picked = [...winners, ...substitutes].map((w) => w.participant.username);
    assert.equal(new Set(picked).size, 3);
  });

  it('lanza error sin elegibles', () => {
    assert.throws(() => executeDrawServer([], 1, 0), /elegibles/);
  });
});

describe('utilidades', () => {
  it('sha256 determinista de 64 hex', () => {
    assert.equal(sha256Server('abc'), sha256Server('abc'));
    assert.match(sha256Server('abc'), /^[a-f0-9]{64}$/);
  });

  it('shuffle conserva el conjunto', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    assert.deepEqual([...shuffleServer(arr)].sort((a, b) => a - b), arr);
  });
});
