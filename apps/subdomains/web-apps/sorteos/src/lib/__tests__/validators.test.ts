import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanStr, isEmail, isStrongPassword, isValidPostUrl, toInt } from '../server/validators.ts';

describe('validators', () => {
  it('isEmail valida formato básico', () => {
    assert.equal(isEmail('a@b.co'), true);
    assert.equal(isEmail('no-email'), false);
    assert.equal(isEmail('a@b'), false);
    assert.equal(isEmail(123), false);
  });

  it('isStrongPassword exige 8-128 chars', () => {
    assert.equal(isStrongPassword('12345678'), true);
    assert.equal(isStrongPassword('corto'), false);
    assert.equal(isStrongPassword('x'.repeat(129)), false);
  });

  it('cleanStr recorta y limita', () => {
    assert.equal(cleanStr('  hola  '), 'hola');
    assert.equal(cleanStr('abcdef', 3), 'abc');
    assert.equal(cleanStr(null), '');
  });

  it('toInt respeta min/max y fallback', () => {
    assert.equal(toInt('5', 1, 1, 10), 5);
    assert.equal(toInt('99', 1, 1, 10), 10);
    assert.equal(toInt('x', 7, 1, 10), 7);
  });

  it('isValidPostUrl por plataforma', () => {
    assert.equal(isValidPostUrl('instagram', 'https://www.instagram.com/p/abc'), true);
    assert.equal(isValidPostUrl('instagram', 'https://youtube.com/watch?v=x'), false);
    assert.equal(isValidPostUrl('youtube', 'https://youtu.be/x'), true);
    assert.equal(isValidPostUrl('facebook', 'https://fb.watch/x'), true);
  });
});
