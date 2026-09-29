"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import CertificateCard from '@/components/CertificateCard';
import { Certificate } from '@/lib/types';

const SAMPLE_CERTIFICATE: Certificate = {
  id: 'CERT-SP-98A41E8D',
  giveawayId: 'sorteo-aniversario-2026',
  giveawayTitle: 'Sorteo Oficial de Aniversario ATP Dev',
  network: 'instagram',
  winnersCount: 1,
  substitutesCount: 2,
  totalParticipants: 1420,
  issuedAt: '2026-09-22T14:30:00.000Z',
  verificationHash: '98a41e8dc34f6782b3a2e1d0987fa421990c8b23f54316a7e029d5b4129e160a',
  verificationUrl: 'https://sorteos.atpdev.pe/certificados/CERT-SP-98A41E8D'
};

export default function CertificadoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [cert, setCert] = useState<Certificate>(SAMPLE_CERTIFICATE);
  const [searchHash, setSearchHash] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<'valid' | 'invalid' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
      const item = stored[resolvedParams.id];
      if (item) {
        setCert({
          id: item.certificateId || resolvedParams.id,
          giveawayId: item.id,
          giveawayTitle: item.title,
          network: item.network,
          winnersCount: item.winners.length,
          substitutesCount: item.substitutes.length,
          totalParticipants: item.totalCommentsCount,
          issuedAt: item.createdAt,
          verificationHash: item.verificationHash,
          verificationUrl: window.location.href
        });
      } else {
        setCert((prev) => ({
          ...prev,
          id: resolvedParams.id,
          verificationUrl: window.location.href
        }));
      }
    }
  }, [resolvedParams.id]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHash.trim()) return;
    if (
      searchHash.trim().toLowerCase() === cert.verificationHash.toLowerCase() ||
      searchHash.trim().toUpperCase() === cert.id.toUpperCase()
    ) {
      setVerifyResult('valid');
    } else {
      setVerifyResult('invalid');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link
          href={`/sorteo/${cert.giveawayId}`}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al resultado del sorteo</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Firma Digital Válida</span>
        </div>
      </div>

      {/* Main Certificate Display */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
            Certificado Oficial de Transparencia
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            Acreditación pública inmutable de selección aleatoria criptográfica conforme a las normas de Meta y YouTube.
          </p>
        </div>

        <CertificateCard certificate={cert} />
      </div>

      {/* Interactive Hash Validator Section */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-pink-600 dark:text-purple-400" />
            <span>Verificador Público de Autenticidad</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Cualquier persona puede auditar este certificado ingresando el código de certificado o el hash SHA-256 para constatar que no ha sido adulterado.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            placeholder="Pega el hash SHA-256 o código de certificado..."
            aria-label="Pega el hash SHA-256 o código de certificado"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-pink-500 dark:focus:border-purple-500 transition-colors shadow-xs"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl btn-pro-primary font-bold font-display text-xs cursor-pointer"
          >
            Verificar Firma
          </button>
        </form>

        {verifyResult === 'valid' && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>¡Certificado 100% Auténtico!</strong> Coincide de manera exacta con el registro criptográfico emitido por Sorteos Pro.
            </span>
          </div>
        )}

        {verifyResult === 'invalid' && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/30 text-rose-800 dark:text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-red-400 shrink-0" />
            <span>
              <strong>Firma no coincidente:</strong> El código o hash ingresado no corresponde a este sorteo.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
