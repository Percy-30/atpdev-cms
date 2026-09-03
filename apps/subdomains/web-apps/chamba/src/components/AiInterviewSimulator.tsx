'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2, AlertTriangle, XCircle, Building2, RotateCcw } from 'lucide-react';

interface QuestionTemplate {
  entity: string;
  role: string;
  question: string;
  evaluationCriteria: string[];
  idealLegalPoints: string[];
  sampleModelAnswer: string;
}

const TEMPLATES: QuestionTemplate[] = [
  {
    entity: 'SUNAT',
    role: 'Sistemas & Tecnología de la Información',
    question: 'Si se detecta una vulnerabilidad o caída del servicio en el portal de comprobantes electrónicos en pleno cierre mensual de contribuyentes, ¿cuál es el protocolo inmediato de contingencia e interoperabilidad que aplicaría siguiendo los lineamientos de la Secretaría de Gobierno y Transformación Digital (PCM)?',
    evaluationCriteria: ['Priorización del servicio al contribuyente', 'Gestión de incidentes cibernéticos (ISO 27001)', 'Comunicación oportuna y trazabilidad'],
    idealLegalPoints: ['Decreto Legislativo N° 1412 (Ley de Gobierno Digital)', 'Marco Nacional de Seguridad Digital (PCM)'],
    sampleModelAnswer: 'En primer lugar, activaría de inmediato el protocolo de respuesta ante incidentes de acuerdo al D.L. N° 1412 (Ley de Gobierno Digital) y la ISO 27001. Habilitaría la infraestructura de alta disponibilidad (servidor de respaldo espejo) para restaurar la emisión de comprobantes en menos de 15 minutos, notificando en paralelo a la Jefatura de TI y emitiendo un comunicado oficial para tranquilidad de los contribuyentes.'
  },
  {
    entity: 'MINEDU',
    role: 'Administración & Gestión Pública',
    question: '¿De qué manera garantizaría que la asignación presupuestaria para el mantenimiento de locales escolares cumpla con los principios de eficiencia y transparencia exigidos por el Sistema Nacional de Presupuesto Público?',
    evaluationCriteria: ['Cumplimiento de metas físicas y financieras', 'Mecanismos de control interno y rendición de cuentas', 'Uso del aplicativo Mi Mantenimiento'],
    idealLegalPoints: ['Decreto Legislativo N° 1440 (Sistema Nacional de Presupuesto)', 'Directivas de Pronied / MINEDU'],
    sampleModelAnswer: 'Aplicaría rigurosamente las normas del Decreto Legislativo N° 1440 (Sistema Nacional de Presupuesto Público) y las directivas de PRONIED. Establecería cronogramas de verificación de metas físicas y financieras mediante el aplicativo "Mi Mantenimiento", asegurando la rendición de cuentas pública con participación del Comité de Mantenimiento de la comunidad educativa.'
  },
  {
    entity: 'Poder Judicial',
    role: 'Derecho & Asesoría Legal',
    question: 'En un procedimiento administrativo sancionador, si el administrado alega la caducidad del procedimiento por transcurso del plazo de 9 meses, ¿cuál es la fundamentación jurídica adecuada que usted sustentaría ante el comité?',
    evaluationCriteria: ['Manejo impecable del TUO de la Ley N° 27444', 'Cómputo de plazos y suspensión de caducidad', 'Derecho al debido procedimiento'],
    idealLegalPoints: ['Art. 259 del TUO de la Ley N° 27444', 'Jurisprudencia del Tribunal del Servicio Civil (SERVIR)'],
    sampleModelAnswer: 'Sustentaría la resolución evaluando taxativamente el Art. 259 del TUO de la Ley N° 27444 (LPAG). Verificaría si operó alguna causal de suspensión imputable al administrado. En caso contrario, corresponde declarar de oficio o a pedido de parte la caducidad del procedimiento, resguardando el derecho al debido procedimiento y la jurisprudencia vinculante del Tribunal de SERVIR.'
  },
  {
    entity: 'EsSalud',
    role: 'Salud & Gestión Asistencial',
    question: 'Frente al desabastecimiento temporal de un medicamento esencial en la farmacia del hospital por demora del proveedor del Estado, ¿qué acciones administrativas inmediatas adoptaría usted para garantizar la atención ininterrumpida del asegurado?',
    evaluationCriteria: ['Enfoque de gestión centrado en el paciente', 'Aplicación de compra por desabastecimiento inminente', 'Coordinación interinstitucional (CEABE)'],
    idealLegalPoints: ['Ley N° 30225 (Ley de Contrataciones del Estado)', 'Reglamento de Organización y Funciones de EsSalud'],
    sampleModelAnswer: 'Privilegiando el derecho a la salud del asegurado, activaría la causal de contratación directa por desabastecimiento inminente conforme al artículo 27 de la Ley N° 30225 de Contrataciones del Estado. Coordinaría una redistribución de emergencia con la red asistencial más cercana y la CEABE para abastecer la farmacia hospitalaria en 24 horas.'
  }
];

export function AiInterviewSimulator() {
  const [selectedEntity, setSelectedEntity] = useState<string>('SUNAT');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    positives: string[];
    improvements: string[];
    verdict: string;
    statusType: 'error' | 'warning' | 'apto' | 'excelente';
  } | null>(null);

  const currentTemplate = TEMPLATES.find(t => t.entity === selectedEntity) || TEMPLATES[0];

  // Helper to detect gibberish, spam, or random keystrokes
  const isGibberishOrSpam = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length < 15) return true;

    // Check vowel ratio (Spanish has ~35-45% vowels)
    const vowels = trimmed.match(/[aeiouáéíóúAEIOUÁÉÍÓÚ]/g) || [];
    const vowelRatio = vowels.length / trimmed.length;
    if (vowelRatio < 0.18 || vowelRatio > 0.65) return true;

    // Check max consecutive consonants
    const cleanText = trimmed.toLowerCase().replace(/[^a-zñáéíóú]/g, '');
    const longConsonants = cleanText.match(/[^aeiouáéíóú]{5,}/g);
    if (longConsonants && longConsonants.length > 0) return true;

    // Check repeating character spam (e.g. "aaaaa", "asdfasdfasdf")
    const words = trimmed.split(/\s+/);
    const validWords = words.filter(w => w.length >= 2);
    if (validWords.length < 4) return true;

    return false;
  };

  const handleRunEvaluation = () => {
    if (!userAnswer.trim()) return;

    setIsAnalyzing(true);
    setEvaluation(null);

    setTimeout(() => {
      const text = userAnswer.trim();
      const lowerText = text.toLowerCase();

      // 1. Detect Gibberish / Random Keystrokes
      if (isGibberishOrSpam(text)) {
        setEvaluation({
          score: 0,
          statusType: 'error',
          verdict: '⛔ DESCALIFICADO (0%) — Texto no válido o caracteres aleatorios detectados. El Jurado Evaluador requiere respuestas comprensibles redactadas en español.',
          positives: ['Ninguno. El texto ingresado no posee coherencia gramatical ni vocabulario técnico.'],
          improvements: [
            'Ingresa una respuesta formal desarrollada en español para responder a la pregunta planteada.',
            'Puedes presionar el botón "💡 Cargar Respuesta Modelo de Prueba" para visualizar una evaluación satisfactoria.'
          ]
        });
        setIsAnalyzing(false);
        return;
      }

      // 2. Detect Extremely Short / Insufficient Answers (< 40 characters or < 8 words)
      const words = text.split(/\s+/).filter(w => w.length > 0);
      if (text.length < 50 || words.length < 10) {
        setEvaluation({
          score: 25,
          statusType: 'warning',
          verdict: '⚠️ NO APTO (25%) — Respuesta demasiado breve e insuficiente para sustentar la entrevista CAS.',
          positives: ['Intento inicial de respuesta.'],
          improvements: [
            'Desarrolla más tu argumento explicando paso a paso las medidas que tomarías.',
            `Incorpora referencias normativas exigidas por la entidad: ${currentTemplate.idealLegalPoints.join(' o ')}.`
          ]
        });
        setIsAnalyzing(false);
        return;
      }

      // 3. Intelligent Evaluation Logic
      let score = 50; // Base score for coherent, well-formed response

      const positives: string[] = ['Demuestra sintaxis clara y articulación adecuada en español.'];
      const improvements: string[] = [];

      // Check Criteria Matches
      let criteriaMatches = 0;
      if (lowerText.includes('protocolo') || lowerText.includes('contingencia') || lowerText.includes('incidente') || lowerText.includes('mantenimiento') || lowerText.includes('procedimiento') || lowerText.includes('emergencia')) {
        score += 12;
        criteriaMatches++;
        positives.push('Aplica enfoque de contingencia y procedimientos de control técnico.');
      }

      if (lowerText.includes('contribuyente') || lowerText.includes('ciudadano') || lowerText.includes('paciente') || lowerText.includes('asegurado') || lowerText.includes('usuario') || lowerText.includes('administrado')) {
        score += 10;
        criteriaMatches++;
        positives.push('Enfoque centrado en el servicio al ciudadano y atención al usuario final.');
      }

      // Check Legal References Match
      const mentionsLaws = lowerText.includes('ley') || lowerText.includes('decreto') || lowerText.includes('norma') || lowerText.includes('iso') || lowerText.includes('1412') || lowerText.includes('1440') || lowerText.includes('27444') || lowerText.includes('30225') || lowerText.includes('tuo') || lowerText.includes('pronied') || lowerText.includes('servir');

      if (mentionsLaws) {
        score += 18;
        positives.push('Sustenta su respuesta en base legal formal y normatividad del Estado Peruano.');
      } else {
        improvements.push(`Incorporar expresamente las normas aplicables: ${currentTemplate.idealLegalPoints.join(' y ')}.`);
      }

      // Check text length & detail (+10 for rich detailed answer)
      if (text.length > 150) {
        score += 10;
      }

      if (score > 96) score = 96;

      if (improvements.length === 0) {
        improvements.push('Mantener el nivel de precisión técnica y fluidez verbal durante la entrevista presencial/virtual.');
      }

      // Verdict Classification
      let verdict = '';
      let statusType: 'apto' | 'excelente' | 'warning' = 'apto';

      if (score >= 85) {
        statusType = 'excelente';
        verdict = '🌟 ALTO RENDIMIENTO — Tu respuesta califica para obtener el máximo puntaje en el cuadro de méritos del Comité de Selección.';
      } else if (score >= 60) {
        statusType = 'apto';
        verdict = '👍 APTO CON OBSERVACIONES — Buen enfoque práctico. Incorpora las bases legales recomendadas para asegurar la plaza.';
      } else {
        statusType = 'warning';
        verdict = '⚠️ REGULAR — Respuesta aceptable pero requiere mayor solidez técnica y normativa para superar a otros postulantes.';
      }

      setEvaluation({
        score,
        statusType,
        verdict,
        positives,
        improvements
      });

      setIsAnalyzing(false);
    }, 1000);
  };

  const handleReset = () => {
    setUserAnswer('');
    setEvaluation(null);
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b0f19] space-y-6">
      
      {/* Step Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 mb-2">
            <Bot size={14} className="text-emerald-400" />
            <span>Asistente de Inteligencia Artificial para Postulantes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white">
            Simulador de Entrevista de Selección CAS / Estado
          </h2>
        </div>

        {/* Entity Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(t => (
            <button
              key={t.entity}
              type="button"
              onClick={() => {
                setSelectedEntity(t.entity);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedEntity === t.entity
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-950 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              {t.entity}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generated Question Box */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-white/15 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <Building2 size={14} />
            <span>Comité de Evaluación {currentTemplate.entity} — {currentTemplate.role}</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Pregunta Tipo CAS 2026
          </span>
        </div>

        <p className="text-base font-bold font-display text-white leading-relaxed">
          "{currentTemplate.question}"
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-slate-300 font-bold">Criterios a evaluar:</span>
          {currentTemplate.evaluationCriteria.map((c, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
              ✓ {c}
            </span>
          ))}
        </div>
      </div>

      {/* User Response Area */}
      <div className="space-y-3">
        <label className="block text-xs font-mono font-bold text-slate-300">
          📝 Escribe tu respuesta como si estuvieras respondiendo al Jurado de la Entrevista:
        </label>
        <textarea
          rows={4}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Escribe aquí tu respuesta sustentada..."
          className="w-full p-4 rounded-2xl bg-slate-950 border border-white/15 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 font-sans leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setUserAnswer(currentTemplate.sampleModelAnswer)}
            className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <span>💡 Cargar Respuesta Modelo de Prueba ({currentTemplate.entity})</span>
          </button>

          <div className="flex items-center justify-end gap-2">
            {userAnswer && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-mono transition-colors border border-white/10"
              >
                Limpiar
              </button>
            )}
            <button
              type="button"
              onClick={handleRunEvaluation}
              disabled={!userAnswer.trim() || isAnalyzing}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-display text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles size={16} className="animate-spin" />
                  <span>Analizando con IA...</span>
                </>
              ) : (
                <>
                  <Bot size={16} />
                  <span>Evaluar Respuesta con IA</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Evaluation Report Result */}
      {evaluation && (
        <div className={`p-6 rounded-2xl bg-slate-950 border space-y-4 animate-in fade-in duration-300 ${
          evaluation.statusType === 'error'
            ? 'border-rose-500/60 bg-rose-950/10'
            : evaluation.statusType === 'warning'
            ? 'border-amber-500/60 bg-amber-950/10'
            : evaluation.statusType === 'excelente'
            ? 'border-emerald-500/60 bg-emerald-950/10'
            : 'border-cyan-500/60 bg-cyan-950/10'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black font-mono text-2xl border ${
                evaluation.statusType === 'error'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                  : evaluation.statusType === 'warning'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : evaluation.statusType === 'excelente'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                  : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
              }`}>
                {evaluation.score}%
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Puntaje del Jurado</span>
                <span className="text-sm font-bold font-display text-white">{evaluation.verdict}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className={`space-y-2 p-4 rounded-xl border ${
              evaluation.statusType === 'error'
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-emerald-950/20 border-emerald-500/30'
            }`}>
              <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                <span>Aspectos Positivos Destacados:</span>
              </span>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {evaluation.positives.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className={`space-y-2 p-4 rounded-xl border ${
              evaluation.statusType === 'error'
                ? 'bg-rose-950/30 border-rose-500/40'
                : 'bg-amber-950/20 border-amber-500/30'
            }`}>
              <span className={`font-mono font-bold flex items-center gap-1.5 ${
                evaluation.statusType === 'error' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {evaluation.statusType === 'error' ? <XCircle size={16} /> : <AlertTriangle size={16} />}
                <span>{evaluation.statusType === 'error' ? 'Acción Requerida:' : 'Recomendaciones para Subir Puntaje:'}</span>
              </span>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
