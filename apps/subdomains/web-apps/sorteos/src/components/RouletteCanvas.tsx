"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getSecureRandomInt } from '@/lib/randomEngine';

interface RouletteCanvasProps {
  options: string[];
  onWinnerSelected: (winner: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const PALETTE = [
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#a855f7', // Purple
];

export const RouletteCanvas: React.FC<RouletteCanvasProps> = ({
  options,
  onWinnerSelected,
  isSpinning,
  setIsSpinning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRotationRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;
    const arc = (2 * Math.PI) / (options.length || 1);

    ctx.clearRect(0, 0, size, size);

    // Borde exterior brillante
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1b4b';
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();

    // Dibujar gajos
    options.forEach((opt, index) => {
      const angle = rotation + index * arc;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + arc);
      ctx.fillStyle = PALETTE[index % PALETTE.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#070a12';
      ctx.stroke();

      // Texto de la opción
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px var(--font-inter), sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      // Truncar si es muy largo
      const truncated = opt.length > 16 ? opt.substring(0, 14) + '...' : opt;
      ctx.fillText(truncated, radius - 24, 5);
      ctx.restore();
    });

    // Círculo central
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

    // Puntero superior
    ctx.save();
    ctx.translate(center, 12);
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.lineTo(0, 24);
    ctx.closePath();
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }, [options]);

  useEffect(() => {
    drawWheel(currentRotationRef.current);
  }, [drawWheel, options]);

  const spin = () => {
    if (isSpinning || options.length === 0) return;
    setIsSpinning(true);

    const fullSpins = getSecureRandomInt(5, 8); // 5 to 8 vueltas completas
    const randomAngle = (getSecureRandomInt(0, 360) * Math.PI) / 180;
    const targetRotation = currentRotationRef.current + fullSpins * 2 * Math.PI + randomAngle;

    const startRotation = currentRotationRef.current;
    const duration = 4500; // 4.5 segundos
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing cúbico hacia afuera (desaceleración suave y emocionante)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startRotation + (targetRotation - startRotation) * easeOut;

      currentRotationRef.current = current;
      drawWheel(current);

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Calcular ganador
        const arc = (2 * Math.PI) / options.length;
        // El puntero está en la parte superior (ángulo 3*PI/2)
        const normalized = (currentRotationRef.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle = (3 * Math.PI) / 2;
        let relativeAngle = (pointerAngle - normalized) % (2 * Math.PI);
        if (relativeAngle < 0) relativeAngle += 2 * Math.PI;

        const winnerIndex = Math.floor(relativeAngle / arc) % options.length;
        onWinnerSelected(options[winnerIndex]);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative p-2 rounded-full glass-card shadow-2xl border border-violet-500/30">
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="max-w-[300px] sm:max-w-[380px] max-h-[380px] rounded-full"
        />
      </div>

      <button
        type="button"
        disabled={isSpinning || options.length === 0}
        onClick={spin}
        className={`btn-pro-primary text-lg py-4 px-10 rounded-2xl ${
          isSpinning || options.length === 0
            ? '!bg-zinc-800 !text-zinc-500 !cursor-not-allowed !shadow-none !transform-none opacity-60'
            : ''
        }`}
      >
        {isSpinning ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>Girando la Ruleta...</span>
          </>
        ) : (
          <span>🎯 ¡Girar Ruleta Ahora!</span>
        )}
      </button>
    </div>
  );
};

export default RouletteCanvas;
