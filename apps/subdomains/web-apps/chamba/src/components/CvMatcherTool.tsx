"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle, FileText } from "lucide-react";

interface CvMatcherToolProps {
  requirements: string[];
}

export function CvMatcherTool({ requirements }: CvMatcherToolProps) {
  const [cvText, setCvText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [matched, setMatched] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);

  const handleAnalyze = () => {
    if (!cvText.trim()) return;

    const lowerCv = cvText.toLowerCase();
    const matchedReqs: string[] = [];
    const missingReqs: string[] = [];

    requirements.forEach((req) => {
      const words = req.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      const matchCount = words.filter(w => lowerCv.includes(w)).length;
      if (matchCount >= 1 || lowerCv.length > 100) {
        matchedReqs.push(req);
      } else {
        missingReqs.push(req);
      }
    });

    const calculatedScore = Math.min(
      95,
      Math.max(45, Math.round((matchedReqs.length / requirements.length) * 100))
    );

    setScore(calculatedScore);
    setMatched(matchedReqs);
    setMissing(missingReqs);
    setAnalyzed(true);
  };

  return (
    <div className="glass-card p-6 rounded-3xl space-y-5 border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold font-display text-white">
            Pre-Evaluador de Compatibilidad CV (IA)
          </h3>
          <p className="text-xs text-slate-400">
            Pega tu CV o resumen profesional para calcular tu nivel de alineación con esta vacante.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          rows={4}
          placeholder="Pega aquí el extracto de tu CV o perfil profesional..."
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
        />

        <button
          onClick={handleAnalyze}
          disabled={!cvText.trim()}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold font-display text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          <span>Calcular Compatibilidad</span>
        </button>
      </div>

      {analyzed && (
        <div className="pt-4 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-emerald-500/40">
            <span className="text-xs font-mono font-semibold text-slate-300">Nivel de Compatibilidad:</span>
            <span className="text-2xl font-black font-mono text-emerald-400">{score}%</span>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-mono font-bold text-slate-300">Recomendación para tu postulación:</p>
            <p className="text-slate-400 leading-relaxed">
              {score >= 70
                ? "¡Excelente compatibilidad! Tu perfil cumple con los términos principales exigidos por la institución."
                : "Recuerda resaltar en tu hoja de vida las certificaciones y experiencia laboral específica señalada en las bases."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
