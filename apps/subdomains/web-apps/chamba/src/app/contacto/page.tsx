'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, ShieldCheck, MapPin, Send, CheckCircle2, ArrowLeft, AlertCircle, Clock } from 'lucide-react';

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Consulta General',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070d14] text-slate-100 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Volver al inicio de Chamba Pro</span>
        </Link>

        {/* Header Hero */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
            <Mail size={14} />
            <span>Atención al Usuario & Transparencia</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
            Canal de Contacto, Soporte & Alianzas
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            ¿Tienes dudas sobre una convocatoria, detectaste una alerta de fraude o representas a una institución que desea publicar sus vacantes verificadas? Nuestro equipo editorial te responderá a la brevedad.
          </p>
        </div>

        {/* Main Grid: Form + Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Direct Info Cards */}
          <div className="space-y-4 md:col-span-1">
            <div className="glass-card p-6 rounded-3xl space-y-3 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Mail size={20} />
              </div>
              <h3 className="text-sm font-bold text-white">Correo Editorial</h3>
              <p className="text-xs text-slate-400">Consultas de usuarios y soporte:</p>
              <a href="mailto:contacto@atpdev.dev" className="text-xs font-mono text-emerald-400 hover:underline block font-semibold">
                contacto@atpdev.dev
              </a>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-3 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <h3 className="text-sm font-bold text-white">Tiempo de Respuesta</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Atendemos consultas de lunes a viernes en un plazo promedio menor a 24 horas hábiles.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-3 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <MapPin size={20} />
              </div>
              <h3 className="text-sm font-bold text-white">Ubicación & Cobertura</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lima, Perú. Cobertura informativa de las 25 regiones y portales oficiales del Estado.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <MessageSquare className="text-emerald-400" size={20} />
              <span>Envíanos un Mensaje</span>
            </h2>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Gracias por escribirnos, <strong>{formData.name}</strong>. Hemos recibido tu consulta y nos pondremos en contacto a través de <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Tu Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="juan.perez@email.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Asunto del Contacto</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Consulta General">Consulta General sobre el portal</option>
                    <option value="Alerta de Convocatoria / Fraude">Reportar enlace caído o convocatoria sospechosa</option>
                    <option value="Publicación de Puesto Institucional">Publicar vacantes para mi institución o empresa</option>
                    <option value="Publicidad & Alianzas">Consultas sobre anuncios publicitarios</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Tu Mensaje o Detalle *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe tu consulta, reporte o requerimiento con el mayor detalle posible..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-display transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Enviar Consulta al Equipo Editorial</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
