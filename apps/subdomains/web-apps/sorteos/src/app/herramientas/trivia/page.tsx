"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, CheckCircle2, XCircle, Trophy, RotateCcw, Timer, Sparkles, ArrowRight } from 'lucide-react';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import ConfettiEffect from '@/components/ConfettiEffect';
import { playCelebrationSound } from '@/lib/soundEffects';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: '¿Cuál es el estándar criptográfico utilizado por Sorteos Pro para certificar ganadores inmutables?',
    options: ['MD5', 'SHA-256', 'Base64', 'CRC32'],
    correctIndex: 1
  },
  {
    id: 2,
    question: '¿Qué red social permite sorteos con recolección directa de comentarios mediante la API oficial de Google?',
    options: ['YouTube', 'Twitch', 'Snapchat', 'Pinterest'],
    correctIndex: 0
  },
  {
    id: 3,
    question: '¿Cuál es la mejor práctica recomendada al organizar un sorteo en Instagram o TikTok?',
    options: ['Elegir a dedo sin sorteo', 'Publicar las Bases Legales y Certificado verificable', 'Ocultar a los ganadores', 'Borrar los comentarios duplicados a mano'],
    correctIndex: 1
  },
  {
    id: 4,
    question: '¿Qué garantiza un Certificado Digital emitido por Sorteos Pro?',
    options: ['Que el premio es de oro', 'Aleatoriedad verificable, fecha inmutable y ganadores auditables', 'Seguidores falsos', 'Likes automáticos'],
    correctIndex: 1
  }
];

export default function TriviaPage() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    if (isFinished || isAnswered) return;
    if (timeLeft <= 0) {
      handleOptionSelect(-1); // Timeout
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isFinished]);

  const currentQ = SAMPLE_QUESTIONS[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < SAMPLE_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setIsFinished(true);
      setShowConfetti(true);
      playCelebrationSound();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
    setTimeLeft(15);
    setShowConfetti(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ConfettiEffect active={showConfetti} />
      <ToolSwitcher />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Trivia para Sorteos
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg">
          Preguntas interactivas con temporizador para calificar participantes y sortear premios entre las respuestas correctas.
        </p>
      </div>

      {!isFinished ? (
        <div className="bg-white dark:bg-[#0f172a] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
          {/* Progress & Timer */}
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 dark:text-zinc-400">
            <span>
              Pregunta {currentIdx + 1} de {SAMPLE_QUESTIONS.length}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-pink-600 dark:text-pink-400">
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Question Title */}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-300 font-bold';
                } else {
                  btnStyle = 'opacity-40 border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="btn-pro-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <span>{currentIdx + 1 < SAMPLE_QUESTIONS.length ? 'Siguiente Pregunta' : 'Ver Resultado'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished Results Screen */
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl text-center space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              ¡Trivia Completada!
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Obtuviste <strong className="text-pink-600 dark:text-pink-400">{score}</strong> de <strong>{SAMPLE_QUESTIONS.length}</strong> respuestas correctas.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-zinc-300">
            {score === SAMPLE_QUESTIONS.length ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                🌟 ¡Puntaje Perfecto! Tu participación califica automáticamente para el sorteo del premio mayor.
              </span>
            ) : (
              <span>¡Buen intento! Puedes reiniciar la trivia para mejorar tu puntaje antes del cierre del sorteo.</span>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jugar de Nuevo</span>
            </button>

            <Link
              href="/sorteos/nuevo"
              className="btn-pro-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span>Crear Sorteo con Trivia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
