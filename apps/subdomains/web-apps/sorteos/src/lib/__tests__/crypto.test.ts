import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { decryptToken, encryptToken, hashPassword, signJwt, verifyJwt, verifyPassword } from '../server/crypto.ts';

describe('passwords', () => {
  it('hash/verify roundtrip y rechazo', () => {
    const { hash, salt } = hashPassword('Secreta123');
    assert.equal(verifyPassword('Secreta123', salt, hash), true);
    assert.equal(verifyPassword('otra', salt, hash), false);
  });
});

describe('jwt', () => {
  it('sign/verify roundtrip con expiración ≤24h', () => {
    const t = signJwt('u1', 'a@b.co', 'user');
    const p = verifyJwt(t);
    assert.ok(p);
    assert.equal(p!.sub, 'u1');
    assert.ok(p!.exp - p!.iat <= 24 * 3600);
  });

  it('rechaza token manipulado y ttl>24h se recorta', () => {
    const t = signJwt('u1', 'a@b.co', 'user', 99);
    const p = verifyJwt(t);
    assert.ok(p);
    assert.ok(p!.exp - p!.iat <= 24 * 3600);
    assert.equal(verifyJwt(t.slice(0, -2) + 'xx'), null);
    assert.equal(verifyJwt('invalido'), null);
  });
});

describe('token encryption', () => {
  it('encrypt/decrypt roundtrip', () => {
    const enc = encryptToken('oauth-secret-xyz');
    assert.notEqual(enc, 'oauth-secret-xyz');
    assert.equal(decryptToken(enc), 'oauth-secret-xyz');
  });
});
