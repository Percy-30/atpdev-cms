'use client';

import { useState } from 'react';

interface WhatsAppSubscribeWidgetProps {
  whatsappEnabled?: boolean;
  telegramEnabled?: boolean;
  whatsappUrl?: string;
  telegramUrl?: string;
}

export default function WhatsAppSubscribeWidget({
  whatsappEnabled = true,
  telegramEnabled = true,
  whatsappUrl,
  telegramUrl = 'https://t.me/chambapro_peru',
}: WhatsAppSubscribeWidgetProps) {
  const [selectedRegion, setSelectedRegion] = useState('Nacional');
  const [selectedCareer, setSelectedCareer] = useState('Todas las Carreras');

  // Si ambos canales están desactivados desde el CMS, ocultamos el widget por completo
  if (!whatsappEnabled && !telegramEnabled) {
    return null;
  }

  const handleJoinWhatsApp = () => {
    if (whatsappUrl && whatsappUrl.startsWith('http')) {
      window.open(whatsappUrl, '_blank');
      return;
    }
    const cleanNumber = (whatsappUrl || '51987654321').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hola Chamba Pro, deseo unirme a las alertas de empleo para ${selectedCareer} en ${selectedRegion}.`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handleJoinTelegram = () => {
    const targetUrl = telegramUrl && telegramUrl.startsWith('http') 
      ? telegramUrl 
      : `https://t.me/${telegramUrl.replace(/^@/, '') || 'chambapro_peru'}`;
    window.open(targetUrl, '_blank');
  };

  const widgetTitle = whatsappEnabled && telegramEnabled
    ? '¡Recibe Convocatorias Diarias en tu Celular!'
    : whatsappEnabled
    ? '¡Recibe Convocatorias Diarias en tu WhatsApp!'
    : '¡Únete a Nuestro Canal Oficial de Telegram!';

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
            {widgetTitle}
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
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-emerald-300 font-semibold focus:outline-none"
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
            {whatsappEnabled && (
              <button
                type="button"
                onClick={handleJoinWhatsApp}
                className="btn-brand-gradient w-full sm:w-auto px-5 py-2.5 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-white drop-shadow-sm font-black">💬 Canal WhatsApp</span>
              </button>
            )}
            {telegramEnabled && (
              <button
                type="button"
                onClick={handleJoinTelegram}
                className="w-full sm:w-auto px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>✈️ Telegram</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
