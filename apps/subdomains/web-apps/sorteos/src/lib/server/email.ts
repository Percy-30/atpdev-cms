/**
 * Mock de email transaccional (RF-003, RF-030).
 * En producción: configurar RESEND_API_KEY o AWS SES y reemplazar `sendEmail`.
 * Hoy: log estructurado + bandeja en memoria consultable en /api/v1/admin/emails.
 */
import { db, uid } from './store';
import { logEvent } from './http';

export interface OutboxEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: 'password-recover' | 'quota-warning' | 'plan-blocked';
  createdAt: string;
}

const g = globalThis as unknown as { __sorteosOutbox?: OutboxEmail[] };
if (!g.__sorteosOutbox) g.__sorteosOutbox = [];
export const outbox: OutboxEmail[] = g.__sorteosOutbox;

export async function sendEmail(to: string, subject: string, body: string, type: OutboxEmail['type']) {
  const email: OutboxEmail = { id: uid('mail'), to, subject, body, type, createdAt: new Date().toISOString() };
  outbox.push(email);
  logEvent('email.send', { to, subject, type, mode: process.env.RESEND_API_KEY ? 'live-resend' : 'mock-outbox' });
  // TODO prod: await fetch('https://api.resend.com/emails', { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` }, ... })
  return email;
}
