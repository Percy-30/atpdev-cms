'use client';

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ChevronRight, BookOpen, Sparkles, Award, RotateCcw } from 'lucide-react';

export interface PreguntaCas {
  id: string;
  category: 'Ley 27444 (LPAG)' | 'Ley 30225 (Contrataciones)' | 'Ley 27815 (Ética)' | 'Gestión Pública (SIAF/SIGA)';
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  legalBase: string;
}

const PREGUNTAS: PreguntaCas[] = [
  {
    id: 'lpag-1',
    category: 'Ley 27444 (LPAG)',
    question: '¿En qué consiste el Principio de Presunción de Veracidad en el procedimiento administrativo?',
    options: [
      'Que la administración pública debe dudar siempre de los documentos del administrado.',
      'Que se responde que todos los documentos y declaraciones juradas presentadas por los administrados corresponden a la verdad de los hechos.',
      'Que el administrado debe legalizar notarialmente todos los documentos que adjunte.',
      'Que el funcionario público no puede ser sancionado si comete un error.'
    ],
    correctIdx: 1,
    explanation: 'En la tramitación del procedimiento administrativo, se presume que los documentos y declaraciones presentados por los administrados responden a la verdad de los hechos que ellos afirman.',
    legalBase: 'Art. 51 del TUO de la Ley N° 27444',
  },
  {
    id: 'lpag-2',
    category: 'Ley 27444 (LPAG)',
    question: '¿Qué es el Silencio Administrativo Negativo (SAN)?',
    options: [
      'Un acto por el cual la entidad aprueba automáticamente lo solicitado por el ciudadano.',
      'Un mecanismo por el cual el transcurso del tiempo sin pronunciamiento habilita al administrado a interponer los recursos administrativos correspondientes.',
      'Una sanción disciplinaria al funcionario público.',
      'Una multa aplicable al postulante que no firma su declaración jurada.'
    ],
    correctIdx: 1,
    explanation: 'El Silencio Administrativo Negativo desestima la solicitud a efectos de que el administrado pueda interponer los recursos administrativos o acudiera a la vía contencioso administrativa.',
    legalBase: 'Art. 38 del TUO de la Ley N° 27444',
  },
  {
    id: 'contrataciones-1',
    category: 'Ley 30225 (Contrataciones)',
    question: '¿Cuál es el sistema oficial para la publicación de los procesos de selección y contrataciones del Estado en Perú?',
    options: [
      'SIAF (Sistema de Administración Financiera)',
      'SEACE (Sistema Electrónico de Contrataciones del Estado)',
      'SIGA (Sistema de Gestión Administrativa)',
      'SUNAT Operaciones en Línea'
    ],
    correctIdx: 1,
    explanation: 'El SEACE es el sistema electrónico que permite el intercambio de información y difusión de las contrataciones del Estado, administrado por el OSCE.',
    legalBase: 'Art. 47 de la Ley N° 30225',
  },
  {
    id: 'etica-1',
    category: 'Ley 27815 (Ética)',
    question: '¿Qué principio de la función pública obliga a actuar con rectitud, honradez y honestidad?',
    options: [
      'Principio de Eficiencia',
      'Principio de Probidad',
      'Principio de Transparencia',
      'Principio de Veracidad'
    ],
    correctIdx: 1,
    explanation: 'El principio de Probidad exige que el servidor público actúe con rectitud, honradez y honestidad, desechando todo provecho o ventaja personal.',
    legalBase: 'Art. 6 inc. 2 de la Ley N° 27815',
  },
  {
    id: 'gestion-1',
    category: 'Gestión Pública (SIAF/SIGA)',
    question: '¿Qué documento constituye la certificación que garantiza la disponibilidad de crédito presupuestario para realizar un gasto en el Estado?',
    options: [
      'La Orden de Compra',
      'La Certificación de Crédito Presupuestario (CCP)',
      'El Cuadro de Necesidades',
      'La Factura Electrónica'
    ],
    correctIdx: 1,
    explanation: 'La Certificación del Crédito Presupuestario garantiza que la entidad cuenta con el presupuesto asignado y disponible para asumir un compromiso de gasto.',
    legalBase: 'Decreto Legislativo N° 1440 del Sistema Nacional de Presupuesto Público',
  },
];

export function PreguntasCasSimulator() {
  const [selectedCat, setSelectedCat] = useState<string>('Todas');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

  const filtered = selectedCat === 'Todas'
    ? PREGUNTAS
    : PREGUNTAS.filter((p) => p.category === selectedCat);

  const handleSelectOption = (qId: string, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleShowAnswer = (qId: string) => {
    setShowAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="space-y-6">
      {/* Category Pills Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {['Todas', 'Ley 27444 (LPAG)', 'Ley 30225 (Contrataciones)', 'Ley 27815 (Ética)', 'Gestión Pública (SIAF/SIGA)'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedCat === cat
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filtered.map((item, idx) => {
          const userAns = userAnswers[item.id];
          const isRevealed = showAnswers[item.id];
          const isCorrect = userAns === item.correctIdx;

          return (
            <div
              key={item.id}
              className="glass-card p-6 rounded-3xl space-y-4 border border-white/15 bg-gradient-to-b from-slate-900 to-[#0b0f19]"
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-slate-400">Pregunta {idx + 1} de {filtered.length}</span>
              </div>

              <h3 className="text-base font-bold font-display text-white leading-snug">
                {item.question}
              </h3>

              {/* Options Grid */}
              <div className="space-y-2 pt-2">
                {item.options.map((opt, optIdx) => {
                  let optStyle = 'bg-slate-950/70 border-white/10 text-slate-300 hover:border-amber-500/40';

                  if (userAns === optIdx) {
                    if (isRevealed) {
                      optStyle = optIdx === item.correctIdx
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                    } else {
                      optStyle = 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold';
                    }
                  } else if (isRevealed && optIdx === item.correctIdx) {
                    optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(item.id, optIdx)}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-mono transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action and Legal Explanation */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => toggleShowAnswer(item.id)}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen size={14} />
                  <span>{isRevealed ? 'Ocultar Explicación Legal' : 'Ver Respuesta y Base Legal'}</span>
                </button>

                {userAns !== undefined && !isRevealed && (
                  <span className="text-xs font-mono text-amber-400">
                    Respuesta registrada. Haz clic en ver explicación.
                  </span>
                )}
              </div>

              {/* Legal Explanation Box */}
              {isRevealed && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                    <CheckCircle2 size={16} />
                    <span>Respuesta Correcta: Opción {String.fromCharCode(65 + item.correctIdx)}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{item.explanation}</p>
                  <div className="text-[11px] font-mono text-slate-400 border-t border-white/10 pt-2">
                    ⚖️ <strong className="text-white">Base Legal Oficial:</strong> {item.legalBase}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
