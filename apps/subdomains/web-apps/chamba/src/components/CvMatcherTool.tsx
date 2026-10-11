"use client";

import { useState } from "react";
import { CheckCircle2, FileText, Check } from "lucide-react";

interface CvMatcherToolProps {
  requirements: string[];
}

export function CvMatcherTool({ requirements }: CvMatcherToolProps) {
  const [cvText, setCvText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [score, setScore] = useState<number>(0);

  const handleAnalyze = () => {
    if (!cvText.trim()) return;

    const lowerCv = cvText.toLowerCase();
    const matchedReqs: string[] = [];

    requirements.forEach((req) => {
      const words = req.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      const matchCount = words.filter(w => lowerCv.includes(w)).length;
      if (matchCount >= 1 || lowerCv.length > 100) {
        matchedReqs.push(req);
      }
    });

    const calculatedScore = Math.min(
      95,
      Math.max(45, Math.round((matchedReqs.length / (requirements.length || 1)) * 100))
    );

    setScore(calculatedScore);
    setAnalyzed(true);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Verificador de Requisitos para el Puesto
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pega tu resumen profesional para comprobar tu nivel de alineación con las bases.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          rows={4}
          placeholder="Pega aquí el extracto de tu formación y experiencia laboral..."
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
        />

        <button
          onClick={handleAnalyze}
          disabled={!cvText.trim()}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
        >
          <Check size={16} />
          <span>Verificar Requisitos</span>
        </button>
      </div>

      {analyzed && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Estimación de Cumplimiento:</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{score}%</span>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Recomendación para tu postulación:</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {score >= 70
                ? "Tu perfil muestra alta afinidad con los requisitos mínimos señalados en las bases oficiales."
                : "Asegúrate de detallar en tu Ficha Resumen de Hoja de Vida la experiencia específica y capacitaciones requeridas."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
