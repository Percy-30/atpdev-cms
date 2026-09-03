import Link from 'next/link';
import WhatsAppSubscribeWidget from '@/components/WhatsAppSubscribeWidget';
import { ShieldCheck, CheckCircle2, Award, ExternalLink, Zap, Users, Lock } from 'lucide-react';

export const metadata = {
  title: 'Quiénes Somos & Garantía de Transparencia — Chamba Pro',
  description: 'Conoce la misión de Chamba Pro: el agregador nacional de empleo público y privado en Perú con enlace directo a fuentes oficiales del Estado, 0 cobros y transparencia total.',
};

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-[#070d14] text-slate-100 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            <ShieldCheck size={16} />
            <span>Manifiesto de Transparencia & Meritocracia</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white">
            Reduciendo la Brecha entre el Talentoso Postulante y el <span className="text-emerald-400">Estado Peruano</span>
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            <strong>Chamba Pro</strong> nace con un propósito claro: eliminar las estafas laborales, los enlaces rotos y la desinformación en el mercado de trabajo nacional. Agregamos y verificamos convocatorias de las 25 regiones de Perú con acceso 100% gratuito y sin intermediarios.
          </p>
        </div>

        {/* 4 Pilar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/20 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">100% Redirección Directa a Fuentes Oficiales</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              En Chamba Pro jamás escondemos las bases ni cobramos por el acceso. Cada convocatoria contiene enlaces verificados directos al portal institucional de la entidad (ONPE, SUNAT, RENIEC, MINEDU, BCRP, GOREs).
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/20 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Garantía Anti-Estafas y Cero Cobros</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ninguna postulación a convocatorias del Estado Peruano (CAS 1057, 728, 276) requiere pago alguno. Alertamos y protegemos a nuestra comunidad de falsos tramitadores y cobros indebidos.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/20 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Ingesta con Asistencia de IA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utilizamos motores avanzados de Inteligencia Artificial para procesar e interpretar las bases oficiales en PDF en tiempo real, garantizando publicaciones inmediatas y estandarizadas diariamente.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/20 space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Cobertura Descentralizada y Nacional</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitoreamos más de 1,800 municipios, Redes de Salud, UGELs y ministerios desde Tacna hasta Loreto, asegurando oportunidades equitativas para todas las profesiones y niveles educativos.
            </p>
          </div>

        </div>

        {/* Sección de Prueba Social y Transparencia */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950 border border-emerald-500/30 text-center space-y-6">
          <Award size={48} className="text-emerald-400 mx-auto" />
          <h2 className="text-3xl font-black text-white">Compromiso de Calidad e Integridad</h2>
          <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chamba Pro es un agregador informativo independiente comprometido con la transparencia, la normativa del Servicio Civil (SERVIR) y la Ley N° 29733 de Protección de Datos Personales.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/empleos"
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Explorar Convocatorias Vigentes →
            </Link>
            <Link
              href="/admin/ingesta"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              ✨ Ingesta Asistida por IA
            </Link>
          </div>
        </div>

        {/* WhatsApp Widget */}
        <WhatsAppSubscribeWidget />

      </div>
    </div>
  );
}
