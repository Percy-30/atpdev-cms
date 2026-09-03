'use client';

import { useState } from 'react';

export default function WhatsAppSubscribeWidget() {
  const [selectedRegion, setSelectedRegion] = useState('Nacional');
  const [selectedCareer, setSelectedCareer] = useState('Todas las Carreras');

  const handleJoinWhatsApp = () => {
    const text = encodeURIComponent(`Hola Chamba Pro, deseo unirme a las alertas de empleo para ${selectedCareer} en ${selectedRegion}.`);
    window.open(`https://wa.me/51900000000?text=${text}`, '_blank');
  };

  const handleJoinTelegram = () => {
    window.open('https://t.me/chambapro_peru', '_blank');
  };

  return (
    <div className="my-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      {/* Glow Ambient Accent */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            📱 Alertas Directas Gratis por Celular
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            ¡Recibe Convocatorias Diarias en tu WhatsApp!
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Elige tu departamento y profesión para recibir exclusivamente las convocatorias del Estado con bases y vacantes vigentes.
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-auto space-y-2">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 font-semibold focus:outline-none"
            >
              <option value="Nacional">Todas las Regiones</option>
              <option value="Lima">Lima y Callao</option>
              <option value="Arequipa">Arequipa</option>
              <option value="Cusco">Cusco</option>
              <option value="Junín">Junín</option>
              <option value="Puno">Puno</option>
              <option value="La Libertad">La Libertad</option>
              <option value="Piura">Piura</option>
            </select>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={handleJoinWhatsApp}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>💬 Canal WhatsApp</span>
            </button>
            <button
              onClick={handleJoinTelegram}
              className="w-full sm:w-auto px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>✈️ Telegram</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
