"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle, Flame, CheckCircle2 } from "lucide-react";

interface JobCountdownClockProps {
  endDate: string; // Formato YYYY-MM-DD
  size?: "sm" | "md" | "lg";
}

export function JobCountdownClock({
  endDate,
  size = "md",
}: JobCountdownClockProps) {
  // Parse target date assuming Peru end of day (23:59:59)
  const calculateRemaining = () => {
    if (!endDate) {
      return { totalMs: 0, days: 0, hours: 0, minutes: 0, isExpired: true };
    }
    const [y, m, d] = endDate.split("-").map(Number);
    const target = new Date(y, (m || 1) - 1, d || 1, 23, 59, 59).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return { totalMs: 0, days: 0, hours: 0, minutes: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { totalMs: diff, days, hours, minutes, isExpired: false };
  };

  const [timeLeft, setTimeLeft] = useState(calculateRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateRemaining());
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(timer);
  }, [endDate]);

  const { days, hours, minutes, isExpired } = timeLeft;

  // Semáforo de color y estado según requerimiento:
  // 1. Azul: Si ya venció
  // 2. Rojo: Si está por vencer (<= 1 día / hoy)
  // 3. Naranja: Si faltan menos de 4 días (2 a 3 días)
  // 4. Verde: Si faltan 4 o más días (tiempo holgado)
  let theme = {
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
    iconColor: "text-emerald-400",
    label: "Vigente",
    subtext: "Tiempo suficiente para postular",
    icon: Clock,
    isPulsing: false,
  };

  if (isExpired) {
    theme = {
      badgeBg: "bg-blue-950/40",
      badgeBorder: "border-blue-500/30",
      badgeText: "text-blue-300",
      iconColor: "text-blue-400",
      label: "Concluida",
      subtext: "Proceso de postulación cerrado",
      icon: CheckCircle2,
      isPulsing: false,
    };
  } else if (days === 0) {
    theme = {
      badgeBg: "bg-rose-500/20",
      badgeBorder: "border-rose-500/50",
      badgeText: "text-rose-300",
      iconColor: "text-rose-400",
      label: "¡Cierra Hoy!",
      subtext: "Últimas horas para enviar documentos",
      icon: Flame,
      isPulsing: true,
    };
  } else if (days === 1) {
    theme = {
      badgeBg: "bg-rose-500/15",
      badgeBorder: "border-rose-500/40",
      badgeText: "text-rose-300",
      iconColor: "text-rose-400",
      label: "Vence Mañana",
      subtext: "Etapa final de registro",
      icon: Flame,
      isPulsing: true,
    };
  } else if (days < 4) {
    theme = {
      badgeBg: "bg-amber-500/15",
      badgeBorder: "border-amber-500/40",
      badgeText: "text-amber-300",
      iconColor: "text-amber-400",
      label: "Por Vencer",
      subtext: "Últimos días para postular",
      icon: AlertTriangle,
      isPulsing: false,
    };
  }

  const IconComponent = theme.icon;

  // Tamaño Pequeño (Badge compacto para tarjetas o filas)
  if (size === "sm") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold ${
          theme.badgeBg
        } ${theme.badgeBorder} ${theme.badgeText} ${
          theme.isPulsing ? "animate-pulse" : ""
        }`}
        title={`Fecha de cierre: ${endDate}`}
      >
        <IconComponent size={13} className={theme.iconColor} />
        <span>
          {isExpired
            ? "Cerrada"
            : days === 0
            ? `${hours}h restantes`
            : `${days}d restantes`}
        </span>
      </div>
    );
  }

  // Tamaño Mediano (Para JobCard o widgets intermedios)
  if (size === "md") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs ${
          theme.badgeBg
        } ${theme.badgeBorder} ${theme.badgeText} ${
          theme.isPulsing ? "animate-pulse" : ""
        }`}
        title={`Cierre de postulaciones: ${endDate}`}
      >
        <IconComponent size={14} className={theme.iconColor} />
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold">{theme.label}</span>
          <span className="opacity-40">•</span>
          {isExpired ? (
            <span>Convocatoria finalizada</span>
          ) : days === 0 ? (
            <span className="font-extrabold">{hours}h {minutes}m restantes</span>
          ) : (
            <span>{days} {days === 1 ? "día" : "días"} restantes</span>
          )}
        </div>
      </div>
    );
  }

  // Tamaño Grande (Destacado en la vista de detalle /empleos/[slug])
  return (
    <div
      className={`p-5 rounded-2xl border ${theme.badgeBg} ${
        theme.badgeBorder
      } space-y-3 relative overflow-hidden ${
        theme.isPulsing ? "shadow-[0_0_20px_rgba(244,63,94,0.15)]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl ${
              theme.isPulsing ? "bg-rose-500/20 text-rose-300" : "bg-white/5"
            }`}
          >
            <IconComponent size={20} className={theme.iconColor} />
          </div>
          <div>
            <h4
              className={`font-display font-black text-sm uppercase tracking-wider ${theme.badgeText}`}
            >
              {theme.label}
            </h4>
            <p className="text-xs text-slate-400">{theme.subtext}</p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          <span className="block text-[10px] uppercase text-slate-500">Cierre Oficial</span>
          <span className="font-bold text-slate-200">{endDate}</span>
        </div>
      </div>

      {/* Reloj con dígitos segmentados estilo panel tech */}
      {!isExpired ? (
        <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
          <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 text-center">
            <span className={`block text-2xl font-black ${theme.badgeText}`}>
              {String(days).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Días</span>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 text-center">
            <span className={`block text-2xl font-black ${theme.badgeText}`}>
              {String(hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Horas</span>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 text-center">
            <span className={`block text-2xl font-black ${theme.badgeText}`}>
              {String(minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Minutos</span>
          </div>
        </div>
      ) : (
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 text-center text-xs font-mono text-blue-300">
          Esta convocatoria ha concluido su período de recepción de expedientes y postulaciones.
        </div>
      )}
    </div>
  );
}
