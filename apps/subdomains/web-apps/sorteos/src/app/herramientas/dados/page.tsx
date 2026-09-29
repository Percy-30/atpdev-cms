"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dices, RefreshCw, Trophy, Sparkles, Volume2, VolumeX, 
  Maximize2, Minimize2, Share2, Tv 
} from 'lucide-react';
import { rollDice } from '@/lib/randomEngine';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { playDiceSound, playWinnerFanfare, isAudioMuted, toggleAudioMute } from '@/lib/soundEffects';

interface DiceCubeProps {
  value: number;
  isRolling: boolean;
  rollAngleX: number;
  rollAngleY: number;
  rollAngleZ: number;
}

const renderDotsForFace = (val: number) => {
  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1 items-center justify-items-center p-3 select-none">
      {val === 1 && (
        <div className="col-start-2 row-start-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 shadow-inner" />
      )}
      {val === 2 && (
        <>
          <div className="col-start-1 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
        </>
      )}
      {val === 3 && (
        <>
          <div className="col-start-1 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-2 row-start-2 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-red-600 shadow-inner" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
        </>
      )}
      {val === 4 && (
        <>
          <div className="col-start-1 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-1 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
        </>
      )}
      {val === 5 && (
        <>
          <div className="col-start-1 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-2 row-start-2 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-red-600 shadow-inner" />
          <div className="col-start-1 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-900" />
        </>
      )}
      {val === 6 && (
        <>
          <div className="col-start-1 row-start-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-1 row-start-2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-1 row-start-3 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-3 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
        </>
      )}
    </div>
  );
};

const Dice3DCube: React.FC<DiceCubeProps> = ({ value, isRolling, rollAngleX, rollAngleY, rollAngleZ }) => {
  // Dimensiones del dado (80px x 80px, d = 40px)
  const d = 40;

  // Ángulos finales exactos para mostrar cada cara de frente
  const targetAngles: Record<number, { x: number; y: number }> = {
    1: { x: 0, y: 0 },
    6: { x: 0, y: 180 },
    2: { x: -90, y: 0 },
    5: { x: 90, y: 0 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
  };

  const currentTarget = targetAngles[value] || { x: 0, y: 0 };
  const finalX = rollAngleX + currentTarget.x;
  const finalY = rollAngleY + currentTarget.y;
  const finalZ = rollAngleZ;

  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center perspective-1000 select-none">
      <div
        className="w-20 h-20 sm:w-22 sm:h-22 relative transform-style-3d transition-transform duration-800"
        style={{
          transform: `rotateX(${finalX}deg) rotateY(${finalY}deg) rotateZ(${finalZ}deg)`,
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transition: isRolling
            ? 'transform 800ms cubic-bezier(0.18, 0.89, 0.32, 1.28)'
            : 'transform 300ms ease-out',
        }}
      >
        {/* Face 1 (Frontal) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-2xl backface-hidden"
          style={{ transform: `translateZ(${d}px)` }}
        >
          {renderDotsForFace(1)}
        </div>

        {/* Face 6 (Posterior) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-2xl backface-hidden"
          style={{ transform: `rotateY(180deg) translateZ(${d}px)` }}
        >
          {renderDotsForFace(6)}
        </div>

        {/* Face 2 (Superior) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-2xl backface-hidden"
          style={{ transform: `rotateX(90deg) translateZ(${d}px)` }}
        >
          {renderDotsForFace(2)}
        </div>

        {/* Face 5 (Inferior) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-2xl backface-hidden"
          style={{ transform: `rotateX(-90deg) translateZ(${d}px)` }}
        >
          {renderDotsForFace(5)}
        </div>

        {/* Face 3 (Izquierda) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-2xl backface-hidden"
          style={{ transform: `rotateY(90deg) translateZ(${d}px)` }}
        >
          {renderDotsForFace(3)}
        </div>

        {/* Face 4 (Derecha) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-2xl backface-hidden"
          style={{ transform: `rotateY(-90deg) translateZ(${d}px)` }}
        >
          {renderDotsForFace(4)}
        </div>
      </div>
    </div>
  );
};

export default function DadosPage() {
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceValues, setDiceValues] = useState<number[]>([3, 4]);
  const [rollAngles, setRollAngles] = useState<Array<{ x: number; y: number; z: number }>>([
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [history, setHistory] = useState<{ values: number[]; total: number }[]>([
    { values: [3, 4], total: 7 },
  ]);
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const handleToggleSound = () => {
    setMuted(toggleAudioMute());
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    playDiceSound();

    // Rotación 3D enérgica y aleatoria antes de clavar la cara
    const nextAngles = Array.from({ length: diceCount }, (_, i) => {
      const prev = rollAngles[i] || { x: 0, y: 0, z: 0 };
      const turnsX = (Math.floor(prev.x / 360) + 3 + Math.floor(Math.random() * 2)) * 360;
      const turnsY = (Math.floor(prev.y / 360) + 3 + Math.floor(Math.random() * 2)) * 360;
      return { x: turnsX, y: turnsY, z: (prev.z + 180) % 360 };
    });
    setRollAngles(nextAngles);

    setTimeout(() => {
      const results = rollDice(diceCount);
      setDiceValues(results);
      const total = results.reduce((a, b) => a + b, 0);
      setHistory((prev) => [{ values: results, total }, ...prev.slice(0, 9)]);
      setIsRolling(false);
      playDiceSound();

      // Si es tirada perfecta o máxima (ej. dobles 6), fanfarria triunfal
      if (results.every((r) => r === 6) || total === diceCount * 6) {
        playWinnerFanfare();
      }
    }, 800);
  };

  const totalSum = diceValues.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />

      {/* Header con controles de Sonido y Modo En Vivo */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
            <Dices className="w-3.5 h-3.5" />
            <span>Dados 3D con Física Visual</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            Lanzador de Dados 3D
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
            Tira de 1 a 6 dados tridimensionales con giros físicos realistas y cálculo instantáneo.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {muted ? <VolumeX className="w-5 h-5 text-zinc-500" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5 text-purple-400" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => setShowLiveStream(true)}
            className="btn-pro-secondary py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Tv className="w-4 h-4 text-purple-400" />
            <span>Modo En Vivo</span>
          </button>
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="btn-pro-primary py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 border border-white/10 text-center relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dice Count Selector */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-mono text-zinc-400 mr-2">Cantidad de dados:</span>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isRolling}
              aria-label={`Seleccionar ${num} ${num === 1 ? 'dado' : 'dados'}`}
              onClick={() => {
                setDiceCount(num);
                setDiceValues(Array.from({ length: num }, () => 1));
                setRollAngles(Array.from({ length: num }, () => ({ x: 0, y: 0, z: 0 })));
              }}
              className={`w-9 h-9 rounded-xl font-bold font-mono text-xs transition-all ${
                diceCount === num
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* 3D Dice Display Stage */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-8 min-h-[160px]">
          {diceValues.map((val, idx) => (
            <Dice3DCube
              key={idx}
              value={val}
              isRolling={isRolling}
              rollAngleX={rollAngles[idx]?.x || 0}
              rollAngleY={rollAngles[idx]?.y || 0}
              rollAngleZ={rollAngles[idx]?.z || 0}
            />
          ))}
        </div>

        {/* Total Badge */}
        <div>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Suma Total:</span>
            <span className="text-4xl font-black font-display text-amber-300 font-mono-num drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
              {totalSum}
            </span>
          </div>
        </div>

        {/* Roll Action Button */}
        <div>
          <button
            type="button"
            disabled={isRolling}
            onClick={handleRoll}
            className={`btn-pro-gold text-base sm:text-lg py-4 px-12 rounded-2xl ${
              isRolling ? 'opacity-60 cursor-not-allowed !transform-none' : ''
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Lanzando dados 3D...' : '🎲 ¡Tirar Dados Ahora!'}</span>
          </button>
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
            Historial de Tiradas Recientes
          </h2>
          <div className="flex flex-wrap gap-2">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-mono text-zinc-300 flex items-center gap-2"
              >
                <span className="text-amber-400 font-bold text-sm">{item.total}</span>
                <span className="text-zinc-500">[{item.values.join(', ')}]</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Stream Stage */}
      <LiveStreamStage
        isOpen={showLiveStream}
        onClose={() => setShowLiveStream(false)}
        title="Lanzamiento de Dados 3D"
        winner={`Suma Total: ${totalSum} (${diceValues.join(' + ')})`}
        platform="Dados 3D Sorteos Pro"
        onReroll={handleRoll}
      />

      {/* Card Export */}
      <WinnerExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        winnerName={`Suma: ${totalSum} [${diceValues.join(', ')}]`}
        drawTitle="Tirada de Dados 3D"
        platform="Dados Criptográficos"
      />
    </div>
  );
}
