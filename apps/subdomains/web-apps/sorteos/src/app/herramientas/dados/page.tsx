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
          <div className="col-start-3 row-start-1 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-1 row-start-2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-2 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-1 row-start-3 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
          <div className="col-start-3 row-start-3 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 rounded-full bg-zinc-900" />
        </>
      )}
    </div>
  );
};

const Dice3DCube: React.FC<DiceCubeProps> = ({ value, isRolling, rollAngleX, rollAngleY, rollAngleZ }) => {
  const d = 40;

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
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-md backface-hidden"
          style={{ transform: `translateZ(${d}px)` }}
        >
          {renderDotsForFace(1)}
        </div>

        {/* Face 6 (Posterior) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-md backface-hidden"
          style={{ transform: `rotateY(180deg) translateZ(${d}px)` }}
        >
          {renderDotsForFace(6)}
        </div>

        {/* Face 2 (Superior) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-md backface-hidden"
          style={{ transform: `rotateX(90deg) translateZ(${d}px)` }}
        >
          {renderDotsForFace(2)}
        </div>

        {/* Face 5 (Inferior) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-md backface-hidden"
          style={{ transform: `rotateX(-90deg) translateZ(${d}px)` }}
        >
          {renderDotsForFace(5)}
        </div>

        {/* Face 3 (Derecha) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-md backface-hidden"
          style={{ transform: `rotateY(90deg) translateZ(${d}px)` }}
        >
          {renderDotsForFace(3)}
        </div>

        {/* Face 4 (Izquierda) */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-zinc-200 border-2 border-white/80 shadow-md backface-hidden"
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

      if (results.every((r) => r === 6) || total === diceCount * 6) {
        playWinnerFanfare();
      }
    }, 800);
  };

  const totalSum = diceValues.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ToolSwitcher />

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Dices className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 font-display">
          Tirar Dados 3D
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
          Tira de 1 a 6 dados tridimensionales con giros físicos realistas y suma automática
        </p>

        {/* Small Audio & Screen Controls */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-pink-600 dark:text-pink-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="py-1.5 px-3 rounded-lg bg-pink-50 hover:bg-pink-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-pink-700 dark:text-purple-300 border border-pink-200 dark:border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
          <button
            type="button"
            onClick={() => setShowLiveStream(true)}
            className="py-1.5 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>En Vivo</span>
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-10 space-y-6 border border-slate-200 dark:border-white/10 shadow-sm text-center relative overflow-hidden">
        {/* Dice Count Selector */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mr-2">Cantidad de dados:</span>
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
              className={`w-9 h-9 rounded-xl font-bold font-mono text-xs transition-all cursor-pointer ${
                diceCount === num
                  ? 'bg-[#d91a7a] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* 3D Dice Display Stage */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-6 min-h-[160px] bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
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
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 shadow-xs">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Suma Total:</span>
            <span className="text-4xl font-extrabold font-display text-amber-900 dark:text-amber-300 font-mono-num">
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
            className="bg-[#d91a7a] hover:bg-[#c2186b] active:scale-95 disabled:opacity-50 text-white font-bold text-base sm:text-lg py-3.5 px-12 rounded-xl shadow-md hover:shadow-lg shadow-pink-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Lanzando dados 3D...' : '¡Tirar Dados Ahora!'}</span>
          </button>
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Historial de Tiradas Recientes
          </h2>
          <div className="flex flex-wrap gap-2">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-zinc-300 flex items-center gap-2"
              >
                <span className="text-pink-600 dark:text-pink-400 font-bold text-sm">{item.total}</span>
                <span className="text-slate-400 dark:text-zinc-500">[{item.values.join(', ')}]</span>
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
